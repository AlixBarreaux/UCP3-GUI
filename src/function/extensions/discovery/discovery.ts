// eslint-disable-next-line max-classes-per-file
import type { FileEntry } from '@tauri-apps/api/fs';
import yaml from 'yaml';

import { readDir } from 'tauri/tauri-files';

import {
  ConfigEntry,
  ConfigFile,
  ConfigFileExtensionEntry,
  DisplayConfigElement,
  Extension,
  ExtensionIOCallback,
  OptionEntry,
} from 'config/ucp/common';
import Logger from 'util/scripts/logging';
import languages from 'localization/languages.json';
import { createReceivePluginPathsFunction } from 'components/sandbox-menu/sandbox-menu-functions';
import { canonicalize, slashify } from 'tauri/tauri-invoke';
import { ExtensionTree } from '../dependency-management/dependency-resolution';
import DirectoryExtensionHandle from '../handles/directory-extension-handle';
import { ExtensionHandle } from '../handles/extension-handle';
import { changeLocale } from '../locale/locale';
import RustZipExtensionHandle from '../handles/rust-zip-extension-handle';

const LOGGER = new Logger('discovery.ts');

const OPTIONS_FILE = 'options.yml';
const CONFIG_FILE = 'config.yml';
const DEFINITION_FILE = 'definition.yml';
const LOCALE_FOLDER = 'locale';
const DESCRIPTION_FILE = 'description.md';

async function readDescription(eh: ExtensionHandle): Promise<string> {
  if (await eh.doesEntryExist(DESCRIPTION_FILE)) {
    return eh.getTextContents(DESCRIPTION_FILE);
  }
  return '# No description provided';
}

async function readUISpec(
  eh: ExtensionHandle,
): Promise<{ options: { [key: string]: unknown }[] }> {
  if (await eh.doesEntryExist(OPTIONS_FILE)) {
    return yaml.parse(await eh.getTextContents(OPTIONS_FILE));
  }
  return { options: [] };
}

async function readConfig(eh: ExtensionHandle): Promise<ConfigFile> {
  if (await eh.doesEntryExist(CONFIG_FILE)) {
    return yaml.parse(await eh.getTextContents(CONFIG_FILE));
  }
  return {
    'specification-version': '0.0.0',
    'config-sparse': {
      modules: {},
      plugins: {},
      'load-order': [],
    },
  };
}

type Translation = { [key: string]: string };
type TranslationDB = { [language: string]: Translation };

async function readLocales(
  eh: ExtensionHandle,
  ext: Extension,
  locales: string[],
) {
  const translations: TranslationDB = {};

  const locFolder = await eh.doesEntryExist(`${LOCALE_FOLDER}/`);
  if (locFolder) {
    // eslint-disable-next-line no-restricted-syntax
    for (const language of locales) {
      // eslint-disable-next-line no-await-in-loop
      if (await eh.doesEntryExist(`${LOCALE_FOLDER}/${language}.yml`)) {
        const translation = yaml.parse(
          // eslint-disable-next-line no-await-in-loop
          await eh.getTextContents(`${LOCALE_FOLDER}/${language}.yml`),
        ) as Translation;

        translations[language] = Object.fromEntries(
          Object.entries(translation).map(([key, value]) => [
            key.toLowerCase(),
            value,
          ]),
        );
      } else {
        LOGGER.msg(
          `No locale file found for: ${ext.name}: ${LOCALE_FOLDER}/${language}.yml`,
        ).info();
      }
    }
  }

  return translations;
}

function applyLocale(ext: Extension, locale: { [key: string]: string }) {
  const { ui } = ext;
  return ui.map((uiElement: { [key: string]: unknown }) =>
    changeLocale(locale, uiElement as { [key: string]: unknown }),
  );
}

function collectOptionEntries(
  obj: { [key: string]: unknown },
  extensionName: string,
  collection?: { [key: string]: OptionEntry },
) {
  // eslint-disable-next-line no-param-reassign
  if (collection === undefined) collection = {};

  // WHY IS typeof(null) == 'object'
  if (typeof obj === 'object' && obj !== null) {
    if (obj.url !== undefined && obj.url !== null) {
      const oeObj = obj as OptionEntry;
      if (collection[oeObj.url] !== undefined) {
        throw new Error(`url already has a value: ${oeObj.url}`);
      }
      let colURL = oeObj.url;
      if (colURL.indexOf(`${extensionName}.`) !== 0) {
        colURL = `${extensionName}.${colURL}`;
      }
      // eslint-disable-next-line no-param-reassign
      collection[colURL] = oeObj;
    } else {
      Object.keys(obj).forEach((key: string) => {
        collectOptionEntries(
          obj[key] as { [key: string]: unknown },
          extensionName,
          collection,
        );
      });
    }
  }
  return collection;
}

function collectConfigEntries(
  obj: { contents: unknown; [key: string]: unknown },
  url?: string,
  collection?: { [key: string]: ConfigEntry },
) {
  // eslint-disable-next-line no-param-reassign
  if (collection === undefined) collection = {};
  // eslint-disable-next-line no-param-reassign
  if (url === undefined) url = '';

  if (obj !== null && obj !== undefined && typeof obj === 'object') {
    if (obj.contents !== undefined) {
      const o = obj as ConfigEntry;
      if (collection[url] !== undefined) {
        throw new Error(`url already has been set: ${url}`);
      }
      // eslint-disable-next-line no-param-reassign
      collection[url] = { ...o };
    } else {
      Object.keys(obj).forEach((key) => {
        let newUrl = url;
        if (newUrl === undefined) newUrl = '';
        if (newUrl !== '') {
          newUrl += '.';
        }
        newUrl += key;
        collectConfigEntries(
          obj[key] as { contents: unknown; [key: string]: unknown },
          newUrl,
          collection,
        );
      });
    }
  }

  return collection;
}

async function getExtensionHandles(ucpFolder: string) {
  const moduleDir = `${ucpFolder}/modules/`;
  const modDirEnts = (await readDir(moduleDir))
    .ok()
    .getOrReceive(() => []) as FileEntry[];

  const pluginDir = `${ucpFolder}/plugins/`;
  const pluginDirEnts = (await readDir(pluginDir))
    .ok()
    .getOrReceive(() => []) as FileEntry[];

  const de: FileEntry[] = [...modDirEnts, ...pluginDirEnts].filter(
    (fe) =>
      (fe.name || '').endsWith('.zip') ||
      (fe.children !== null && fe.children !== undefined),
  );
  const den = de.map((f) => f.name);
  const dirEnts = de.filter((e) => {
    // Zip files supersede folders
    // const isDirectory = e.children !== null && e.children !== undefined;
    // if (isDirectory) {
    //   const zipFileName = `${e.name}.zip`;
    //   if (den.indexOf(zipFileName) !== -1) {
    //     return false;
    //   }
    // }
    // Folders supersede zip files?
    if (e.name?.endsWith('.zip')) {
      const dirName = e.name.split('.zip')[0];
      if (den.indexOf(`${dirName}`) !== -1) {
        return false;
      }
    }
    return true;
  });

  const exts = await Promise.all(
    dirEnts.map(async (fe: FileEntry) => {
      const type = modDirEnts.indexOf(fe) === -1 ? 'plugin' : 'module';

      const folder = await slashify(
        type === 'module'
          ? `${ucpFolder}/modules/${fe.name}`
          : `${ucpFolder}/plugins/${fe.name}`,
      );

      if (fe.name !== undefined && fe.name.endsWith('.zip')) {
        // TODO: Do hash check here!
        const result = await RustZipExtensionHandle.fromPath(folder);
        return result as ExtensionHandle;
      }
      if (fe.children !== null) {
        // fe is a directory
        return new DirectoryExtensionHandle(folder) as ExtensionHandle;
      }
      throw new Error(`${folder} not a valid extension directory`);
    }),
  );

  return exts;
}

const attachExtensionInformation = (extension: Extension, obj: unknown) => {
  const todo: unknown[] = [];
  const done: unknown[] = [];

  todo.push(obj);

  while (todo.length > 0) {
    const current = todo.pop();

    if (done.indexOf(current) !== -1) {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (current instanceof Array) {
      current.forEach((v) => todo.push(v));
    } else if (current instanceof Object) {
      Object.entries(current).forEach(([k, v]) => {
        todo.push(v);
      });
      (current as DisplayConfigElement).extension = extension;
    } else {
      // throw Error((obj as any).toString());
    }

    done.push(current);
  }
};

const Discovery = {
  discoverExtensions: async (gameFolder: string): Promise<Extension[]> => {
    LOGGER.msg('Discovering extensions').info();

    const ehs = await getExtensionHandles(`${gameFolder}/ucp`);

    const extensions = await Promise.all(
      ehs.map(async (eh) => {
        const inferredType =
          eh.path.indexOf('/modules/') !== -1 ? 'module' : 'plugin';
        const definition = yaml.parse(
          await eh.getTextContents(`${DEFINITION_FILE}`),
        );
        const { name, version } = definition;

        const { type } = definition;

        let assumedType = inferredType;
        if (type === undefined) {
          LOGGER.msg(
            '"type: " was not found in definition.yml of {}-{}. Extension was inferred to be a {}',
            name,
            version,
            inferredType,
          ).warn();
        } else if (type !== inferredType) {
          LOGGER.msg(
            `Extension type mismatch. Has a '${type}' (as found in definition.yml of ${name}-${version}) been placed in the folder for a ${inferredType}?`,
          ).error();
        } else {
          assumedType = type;
        }

        definition.dependencies =
          definition.dependencies || definition.depends || [];

        const io = {
          handle: async <R>(cb: ExtensionIOCallback<R>) => {
            const neh = await eh.clone();
            try {
              return await cb(neh);
            } finally {
              neh.close();
            }
          },
          isZip: eh instanceof RustZipExtensionHandle,
          isDirectory: eh instanceof DirectoryExtensionHandle,
          path: eh.path,
        };

        const ext = {
          name,
          version,
          type: assumedType,
          definition,
          io,
        } as unknown as Extension;

        const uiRaw = await readUISpec(eh);
        ext.ui = (uiRaw || {}).options || [];
        console.debug('attaching extension');
        attachExtensionInformation(ext, ext.ui);

        ext.locales = await readLocales(eh, ext, Object.keys(languages));
        ext.config = await readConfig(eh);

        // ext.optionEntries = collectOptionEntries(
        //   ext.ui as unknown as { [key: string]: unknown },
        //   ext.name,
        // );

        ext.configEntries = {};

        const parseEntry = ([extensionName, data]: [
          string,
          {
            config: ConfigFileExtensionEntry;
          },
        ]) => {
          const result = collectConfigEntries(
            data.config as {
              [key: string]: unknown;
              contents: unknown;
            },
            extensionName,
          );

          ext.configEntries = { ...ext.configEntries, ...result };
        };

        if (
          ext.config['config-sparse'] === undefined ||
          ext.config['config-sparse'].modules === undefined ||
          ext.config['config-sparse'].plugins === undefined
        ) {
          LOGGER.msg(
            `Extension ${ext.name} does not adhere to the configuration definition spec, skipped parsing of config object.`,
          ).warn();
        } else {
          Object.entries(ext.config['config-sparse'].modules).forEach(
            parseEntry,
          );
          Object.entries(ext.config['config-sparse'].plugins).forEach(
            parseEntry,
          );
        }

        ext.descriptionMD = await readDescription(eh);

        eh.close();

        return ext;
      }),
    );

    const extensionsByID: { [id: string]: Extension } = {};

    extensions.forEach((e) => {
      const id = `${e.name}@${e.version}`;
      if (extensionsByID[id] !== undefined) {
        throw Error(
          `Duplicate extension detected: ${id}. Please fix the issue in the ucp folder and then refresh this GUI.`,
        );
      }
      extensionsByID[id] = e;
    });

    return extensions;
  },
};

function tryResolveDependencies(extensions: Extension[]) {
  return new ExtensionTree(extensions).tryResolveDependencies();
}

// eslint-disable-next-line import/prefer-default-export
export {
  Discovery,
  collectConfigEntries,
  tryResolveDependencies,
  applyLocale,
  getExtensionHandles,
};
