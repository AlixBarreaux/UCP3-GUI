import {
  exists as tauriFileExists,
  createDir,
  readDir as tauriReadDir,
  FsOptions,
  readTextFile as tauriReadTextFile,
  writeTextFile as tauriWriteTextFile,
  readBinaryFile as tauriReadBinaryFile,
  writeBinaryFile as tauriWriteBinaryFile,
  copyFile as tauriCopyFile,
  renameFile as tauriRenameFile,
  removeFile as tauriRemoveFile,
  BinaryFileContents,
  FsDirOptions,
} from '@tauri-apps/api/fs';
import {
  fetch,
  FetchOptions,
  HttpVerb,
  Response,
  ResponseType,
} from '@tauri-apps/api/http';
import {
  dataDir,
  dirname,
  localDataDir,
  normalize as normalizePath,
  resolve,
} from '@tauri-apps/api/path';
import {
  DocumentOptions,
  parse as yamlParse,
  ParseOptions,
  SchemaOptions,
  ToJSOptions,
} from 'yaml';
import Result from 'util/structs/result';

// WARNING: Tauri funcs lie about their return.
// Void Promises return "null" as result instead of undefined.

// TYPES

export type Yaml = any;
export type Json = any;
export type Error = unknown;

// CODE

const BASE_FOLDER = 'UnofficialCrusaderPatch3';

// only proxy
export async function onFsExists(
  path: string,
  options?: FsOptions | undefined
): Promise<boolean> {
  return tauriFileExists(path, options);
}

// only proxy
export async function resolvePath(...paths: string[]): Promise<string> {
  return resolve(...paths);
}

export async function recursiveCreateDir(
  path: string
): Promise<Result<void, Error>> {
  return Result.tryAsync(async () => {
    await createDir(await dirname(path), { recursive: true });
  });
}

export async function readTextFile(
  path: string
): Promise<Result<string, Error>> {
  return Result.tryAsync(tauriReadTextFile, path);
}

export async function readBinaryFile(
  path: string
): Promise<Result<Uint8Array, Error>> {
  return Result.tryAsync(tauriReadBinaryFile, path);
}

export async function writeTextFile(
  path: string,
  contents: string
): Promise<Result<void, Error>> {
  return Result.tryAsync(async () => {
    (await recursiveCreateDir(path)).throwIfErr();
    await tauriWriteTextFile(path, contents);
  });
}

export async function writeBinaryFile(
  path: string,
  contents: BinaryFileContents
): Promise<Result<void, Error>> {
  return Result.tryAsync(async () => {
    (await recursiveCreateDir(path)).throwIfErr();
    await tauriWriteBinaryFile(path, contents);
  });
}

export async function copyFile(
  source: string,
  destination: string
): Promise<Result<void, Error>> {
  return Result.tryAsync(tauriCopyFile, source, destination);
}

export async function renameFile(
  oldPath: string,
  newPath: string
): Promise<Result<void, Error>> {
  return Result.tryAsync(tauriRenameFile, oldPath, newPath);
}

export async function removeFile(path: string): Promise<Result<void, Error>> {
  return Result.tryAsync(tauriRemoveFile, path);
}

export async function loadYaml(
  path: string,
  yamlOptions?:
    | (ParseOptions & DocumentOptions & SchemaOptions & ToJSOptions)
    | undefined
): Promise<Result<Yaml, Error>> {
  return Result.tryAsync(async () => {
    const readContent = (await readTextFile(path)).getOrThrow();
    return yamlParse(readContent, yamlOptions);
  });
}

export async function loadJson(
  path: string,
  reviver?:
    | ((this: unknown, key: string, value: unknown) => unknown)
    | undefined
): Promise<Result<Json, Error>> {
  return Result.tryAsync(async () => {
    const readContent = (await readTextFile(path)).getOrThrow();
    return JSON.parse(readContent, reviver);
  });
}

export async function writeJson(
  path: string,
  contents: unknown,
  replacer?:
    | ((this: unknown, key: string, value: unknown) => unknown)
    | undefined,
  space?: string | number | undefined
): Promise<Result<void, Error>> {
  return Result.tryAsync(async () => {
    const jsonStr = JSON.stringify(contents, replacer, space);
    (await writeTextFile(path, jsonStr)).throwIfErr();
  });
}

export async function fetchBinary<T>(
  url: string,
  addOptions?:
    | (Omit<FetchOptions, 'method'> & { method?: HttpVerb })
    | undefined
): Promise<Response<T>> {
  let options: FetchOptions = {
    method: 'GET',
    responseType: ResponseType.Binary, // important, because we are downloading inside a browser
    headers: {
      Accept: 'application/octet-stream',
    },
  };
  // merge with addOptions, with special handling for the records
  // others are overwritten
  if (addOptions) {
    const headersToUse = { ...options.headers, ...addOptions?.headers };
    options = { ...options, ...addOptions };
    options.headers = headersToUse;
  }
  return fetch<T>(url, options);
}

// GET FOLDER

export async function readDir(dir: string, options?: FsDirOptions | undefined) {
  return Result.tryAsync(tauriReadDir, dir, options);
}

export const getRoamingDataFolder: () => Promise<string> = (() => {
  let roamingFolder: string | null = null;
  return async () => {
    if (roamingFolder) {
      return roamingFolder;
    }
    roamingFolder = `${await dataDir()}/${BASE_FOLDER}/`;
    if (!(await onFsExists(roamingFolder))) {
      await createDir(roamingFolder);
    }
    return roamingFolder;
  };
})();

export const getExeFolder: () => Promise<string> = (() => {
  let f: string | null = null;
  return async () => {
    if (f) {
      return f;
    }
    f = `${await normalizePath('.')}`;
    console.log(`Executable path: ${f}`);
    return f;
  };
})();

export const getLocalDataFolder: () => Promise<string> = (() => {
  let localDataFolder: string | null = null;
  return async () => {
    if (localDataFolder) {
      return localDataFolder;
    }
    localDataFolder = `${await localDataDir()}/${BASE_FOLDER}/`;
    if (!(await onFsExists(localDataFolder))) {
      await createDir(localDataFolder);
    }
    return localDataFolder;
  };
})();

export function getGameFolderPath(urlParams: URLSearchParams) {
  return urlParams.get('directory') || '';
}