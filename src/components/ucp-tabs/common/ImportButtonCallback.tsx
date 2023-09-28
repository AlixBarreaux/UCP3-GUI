import {
  ConfigFile,
  Extension,
  ConfigEntry,
  ConfigFileExtensionEntry,
} from 'config/ucp/common';
import { loadConfigFromFile } from 'config/ucp/config-files';
import { ConfigMetaObjectDB } from 'config/ucp/config-merge/objects';
import { DependencyStatement, Version } from 'config/ucp/dependency-statement';
import { collectConfigEntries } from 'function/extensions/discovery';
import { ExtensionsState, ConfigurationQualifier } from 'function/global/types';
import { openFileDialog } from 'tauri/tauri-dialog';
import { TFunction } from 'i18next';
import { getStore } from 'hooks/jotai/base';
import {
  AVAILABLE_EXTENSION_VERSIONS_ATOM,
  CONFIGURATION_QUALIFIER_REDUCER_ATOM,
  CONFIGURATION_REDUCER_ATOM,
  CONFIGURATION_TOUCHED_REDUCER_ATOM,
  EXTENSION_STATE_REDUCER_ATOM,
  PREFERRED_EXTENSION_VERSION_ATOM,
} from 'function/global/global-atoms';
import { showGeneralModalOk } from 'components/modals/ModalOk';
import {
  buildExtensionConfigurationDB,
  buildConfigMetaContentDB,
} from '../extension-manager/extension-configuration';
import { addExtensionToExplicityActivatedExtensions } from '../extension-manager/extensions-state';
import { propagateActiveExtensionsChange } from '../helpers';
import warnClearingOfConfiguration from './WarnClearingOfConfiguration';

const setConfiguration = (arg0: {
  type: string;
  value: { [key: string]: unknown };
}) => {
  getStore().set(CONFIGURATION_REDUCER_ATOM, arg0);
};

const setConfigurationTouched = (arg0: {
  type: string;
  value: { [key: string]: boolean };
}) => {
  getStore().set(CONFIGURATION_TOUCHED_REDUCER_ATOM, arg0);
};

const setExtensionsState = (arg0: ExtensionsState) => {
  getStore().set(EXTENSION_STATE_REDUCER_ATOM, arg0);
};

const setConfigurationQualifier = (arg0: {
  type: string;
  value: { [key: string]: ConfigurationQualifier };
}) => {
  getStore().set(CONFIGURATION_QUALIFIER_REDUCER_ATOM, arg0);
};

const importButtonCallback = async (
  gameFolder: string,
  setConfigStatus: (arg0: string) => void,
  t: TFunction<[string, string], undefined>,
  file: string | undefined
) => {
  const extensionsState = getStore().get(EXTENSION_STATE_REDUCER_ATOM);
  const { extensions } = extensionsState;
  const configurationTouched = getStore().get(
    CONFIGURATION_TOUCHED_REDUCER_ATOM
  );

  let path = file;

  if (file === undefined || file.length === 0) {
    const pathResult = await openFileDialog(gameFolder, [
      {
        name: t('gui-general:file.config'),
        extensions: ['yml', 'yaml'],
      },
      { name: t('gui-general:file.all'), extensions: ['*'] },
    ]);
    if (pathResult.isEmpty()) {
      setConfigStatus(t('gui-editor:config.status.no.file'));
      return;
    }

    path = pathResult.get();
  }

  if (path === undefined) return;

  warnClearingOfConfiguration(configurationTouched);

  let newExtensionsState = {
    ...extensionsState,
    activeExtensions: [],
    explicitlyActivatedExtensions: [],
  } as ExtensionsState;

  const parsingResult: {
    status: string;
    message: string;
    result: ConfigFile;
  } = await loadConfigFromFile(path, t);

  if (parsingResult.status !== 'OK') {
    setConfigStatus(`${parsingResult.status}: ${parsingResult.message}`);
    return;
  }

  if (parsingResult.result === undefined) {
    setConfigStatus(t('gui-editor:config.status.failed.unknown'));
    return;
  }

  const config = parsingResult.result;

  const lo = config['config-sparse']['load-order'];
  if (lo !== undefined && lo.length > 0) {
    const explicitActiveExtensions: Extension[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const e of lo) {
      const ds = DependencyStatement.fromString(e);

      // TODO: support more than just == in version statements. This is hard to do though.

      if (ds.operator === '') {
        const av = getStore().get(AVAILABLE_EXTENSION_VERSIONS_ATOM)[
          ds.extension
        ];
        if (av === undefined || av.length === 0) {
          throw Error(`hmmm, how did we get here?`);
        }
        ds.operator = '==';
        ds.version = Version.fromString(av[0]);
      }

      if (ds.operator !== '==') {
        const errorMsg = `Unimplemented operator in dependency statement: ${e}`;

        // eslint-disable-next-line no-await-in-loop
        await showGeneralModalOk({
          message: errorMsg,
          title: `Illegal dependency statement`,
        });

        throw Error(errorMsg);
      }

      const options = extensions.filter(
        (ext: Extension) =>
          ext.name === ds.extension && ext.version === ds.version.toString()
      );
      console.log(options);
      if (options.length === 0) {
        setConfigStatus(
          t('gui-editor:config.status.missing.extension', {
            extension: e,
          })
        );

        // eslint-disable-next-line no-await-in-loop
        await showGeneralModalOk({
          message: t('gui-editor:config.status.missing.extension', {
            extension: e,
          }),
          title: `Missing extension`,
        });

        return;
      }

      if (options.length > 1) {
        // eslint-disable-next-line no-await-in-loop
        await showGeneralModalOk({
          message: `The same version of extension is installed multiple times: ${e}`,
          title: `Duplicate extensions`,
        });

        return;
      }

      explicitActiveExtensions.push(options[0]);
    }

    const newPrefs = { ...getStore().get(PREFERRED_EXTENSION_VERSION_ATOM) };

    explicitActiveExtensions.forEach((e: Extension) => {
      newPrefs[e.name] = e.version;
    });

    getStore().set(PREFERRED_EXTENSION_VERSION_ATOM, newPrefs);

    const availableVersions = getStore().get(AVAILABLE_EXTENSION_VERSIONS_ATOM);

    // Now how do deal with these specific extensions.
    // Peferably the depednency solver should understand versions.
    //
    const specificExtensions = newExtensionsState.extensions.filter((e) => {
      const preferredVersion = newPrefs[e.name];
      if (preferredVersion !== undefined) {
        return e.version === preferredVersion;
      }

      // Select the highest version available by default
      return e.version === availableVersions[e.name][0];
    });

    explicitActiveExtensions
      .slice()
      .reverse()
      // TODO: does this execute still in line with what is expected, or does the promise mess things up?
      .forEach(async (ext) => {
        newExtensionsState = await addExtensionToExplicityActivatedExtensions(
          newExtensionsState,
          ext
        );
      });

    newExtensionsState = buildExtensionConfigurationDB(newExtensionsState);
  }

  propagateActiveExtensionsChange(newExtensionsState);

  setExtensionsState(newExtensionsState);

  console.log('opened config');
  console.log(parsingResult.result);

  let userConfigEntries: { [key: string]: ConfigEntry } = {};

  const parseEntry = ([extensionName, data]: [
    string,
    {
      config: ConfigFileExtensionEntry;
    }
  ]) => {
    const result = collectConfigEntries(
      data.config as {
        [key: string]: unknown;
        contents: unknown;
      },
      extensionName
    );

    userConfigEntries = { ...userConfigEntries, ...result };
  };

  Object.entries(config['config-sparse'].modules).forEach(parseEntry);
  Object.entries(config['config-sparse'].plugins).forEach(parseEntry);

  const db: ConfigMetaObjectDB = {};

  const newConfigurationQualifier: {
    [key: string]: ConfigurationQualifier;
  } = {};
  setConfigurationQualifier({
    type: 'set-multiple',
    value: {},
  });

  Object.entries(userConfigEntries).forEach(([url, data]) => {
    const m = buildConfigMetaContentDB('user', data);
    db[url] = {
      url,
      modifications: m,
    };
    // TODO: do checking here if the user part is not conflicting?

    let q = m.value.qualifier;
    if (q === 'unspecified') q = 'required';
    newConfigurationQualifier[url] = q as ConfigurationQualifier;
  });

  const newConfiguration: { [key: string]: unknown } = {};
  const newConfigurationTouched: { [key: string]: boolean } = {};

  Object.entries(db).forEach(([url, cmo]) => {
    newConfiguration[url] = cmo.modifications.value.content;
    newConfigurationTouched[url] = true;
  });

  setConfiguration({
    type: 'set-multiple',
    value: newConfiguration,
  });
  setConfigurationTouched({
    type: 'set-multiple',
    value: newConfigurationTouched,
  });
  setConfigurationQualifier({
    type: 'set-multiple',
    value: newConfigurationQualifier,
  });
};

export default importButtonCallback;