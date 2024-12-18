// Helper file, wrapping tauri invokes in simple functions

import { BinaryFileContents } from '@tauri-apps/api/fs';
import { invoke } from '@tauri-apps/api/tauri';

const PLUGIN_CONFIG = 'tauri-plugin-ucp-config';
const PLUGIN_LOGGING = 'tauri-plugin-ucp-logging';
const PLUGIN_ZIP = 'tauri-plugin-ucp-zip-support';

const TEXT_ENCODER = new TextEncoder();

function buildPluginCmd(pluginName: string, command: string) {
  return `plugin:${pluginName}|${command}`;
}

function generateBinaryDataFromContent(content: BinaryFileContents | string) {
  let internalContent = content ?? [];
  if (typeof internalContent === 'string') {
    internalContent = TEXT_ENCODER.encode(internalContent);
  }
  return Array.from(
    internalContent instanceof ArrayBuffer
      ? new Uint8Array(internalContent)
      : internalContent,
  );
}

/* eslint-disable */
const TAURI_COMMAND = {
  CONFIG_GET_RECENT_FOLDERS: buildPluginCmd(PLUGIN_CONFIG, 'get_config_recent_folders'),
  CONFIG_SELECT_RECENT_FOLDER: buildPluginCmd(PLUGIN_CONFIG, 'select_config_recent_folder'),
  CONFIG_REMOVE_RECENT_FOLDER: buildPluginCmd(PLUGIN_CONFIG, 'remove_config_recent_folder'),
  CONFIG_GET_LOG_LEVEL: buildPluginCmd(PLUGIN_CONFIG, 'get_config_log_level'),
  CONFIG_SET_LOG_LEVEL: buildPluginCmd(PLUGIN_CONFIG, 'set_config_log_level'),
  CONFIG_SAVE: buildPluginCmd(PLUGIN_CONFIG, 'save_config'),

  ZIP_EXTRACT_TO_PATH: buildPluginCmd(PLUGIN_ZIP, 'extract_zip_to_path'),
  ZIP_READER_LOAD: buildPluginCmd(PLUGIN_ZIP, 'load_zip_reader'),
  ZIP_READER_CLOSE: buildPluginCmd(PLUGIN_ZIP, 'close_zip_reader'),
  ZIP_READER_IS_EMPTY: buildPluginCmd(PLUGIN_ZIP, 'is_zip_reader_empty'),
  ZIP_READER_GET_NUMBER_OF_ENTRIES: buildPluginCmd(PLUGIN_ZIP, 'get_zip_reader_number_of_entries'),
  ZIP_READER_EXIST_ENTRY: buildPluginCmd(PLUGIN_ZIP, 'exist_zip_reader_entry'),
  ZIP_READER_GET_ENTRY_NAMES: buildPluginCmd(PLUGIN_ZIP, 'get_zip_reader_entry_names'),
  ZIP_READER_GET_ENTRY_AS_BINARY: buildPluginCmd(PLUGIN_ZIP, 'get_zip_reader_entry_as_binary'),
  ZIP_READER_GET_ENTRY_AS_TEXT: buildPluginCmd(PLUGIN_ZIP, 'get_zip_reader_entry_as_text'),
  ZIP_WRITER_LOAD: buildPluginCmd(PLUGIN_ZIP, 'load_zip_writer'),
  ZIP_WRITER_CLOSE: buildPluginCmd(PLUGIN_ZIP, 'close_zip_writer'),
  ZIP_WRITER_ADD_DIRECTORY: buildPluginCmd(PLUGIN_ZIP, 'add_zip_writer_directory',),
  ZIP_WRITER_WRITE_ENTRY_FROM_BINARY: buildPluginCmd(PLUGIN_ZIP, 'write_zip_writer_entry_from_binary'),
  ZIP_WRITER_WRITE_ENTRY_FROM_TEXT: buildPluginCmd(PLUGIN_ZIP, 'write_zip_writer_entry_from_text'),
  ZIP_WRITER_WRITE_ENTRY_FROM_FILE: buildPluginCmd(PLUGIN_ZIP, 'write_zip_writer_entry_from_file'),

  HASH_GET_SHA256_OF_FILE: 'get_sha256_of_file',
  OS_OPEN_PROGRAM: 'os_open_program',

  FILES_SLASHIFY: 'slashify',
  FILES_CANONICALIZE: 'canonicalize',
  FILES_READ_AND_FILTER_DIR: 'read_and_filter_dir',
  FILES_SCAN_FILE_FOR_BYTES: 'scan_file_for_bytes',

  LOGGING_LOG: buildPluginCmd(PLUGIN_LOGGING, 'log'),
};
/* eslint-enable */

export async function getGuiConfigRecentFolders(): Promise<string[]> {
  return invoke(TAURI_COMMAND.CONFIG_GET_RECENT_FOLDERS);
}

export async function selectGuiConfigRecentFolder(
  directoryPath: string = '',
  newDir: boolean = false,
  title: string = '',
): Promise<string | null> {
  return invoke(TAURI_COMMAND.CONFIG_SELECT_RECENT_FOLDER, {
    directoryPath,
    new: newDir,
    title,
  });
}

// will not remove them from the allowlist of the current run state
export async function removeGuiConfigRecentFolder(path: string): Promise<void> {
  return invoke(TAURI_COMMAND.CONFIG_REMOVE_RECENT_FOLDER, { path });
}

export async function getGuiConfigLogLevel(): Promise<string> {
  return invoke(TAURI_COMMAND.CONFIG_GET_LOG_LEVEL);
}

// does not report success, wrong input sets default log level
export async function setGuiConfigLogLevel(logLevel: string): Promise<void> {
  return invoke(TAURI_COMMAND.CONFIG_SET_LOG_LEVEL, { logLevel });
}

export async function saveGuiConfig(): Promise<void> {
  return invoke(TAURI_COMMAND.CONFIG_SAVE);
}

export async function extractZipToPath(
  source: string,
  dest: string,
): Promise<void> {
  return invoke(TAURI_COMMAND.ZIP_EXTRACT_TO_PATH, { source, dest });
}

// WARNING: Do not use directly, only through ZipReader
export async function loadZipReader(source: string): Promise<number> {
  return invoke(TAURI_COMMAND.ZIP_READER_LOAD, { source });
}

// WARNING: Do not use directly, only through ZipReader
export async function closeZipReader(id: number): Promise<void> {
  return invoke(TAURI_COMMAND.ZIP_READER_CLOSE, { id });
}

// WARNING: Do not use directly, only through ZipReader
export async function isZipReaderEmpty(id: number): Promise<boolean> {
  return invoke(TAURI_COMMAND.ZIP_READER_IS_EMPTY, { id });
}

// WARNING: Do not use directly, only through ZipReader
export async function getZipReaderNumberOfEntries(id: number): Promise<number> {
  return invoke(TAURI_COMMAND.ZIP_READER_GET_NUMBER_OF_ENTRIES, { id });
}

// WARNING: Do not use directly, only through ZipReader
export async function existZipReaderEntry(
  id: number,
  path: string,
): Promise<boolean> {
  return invoke(TAURI_COMMAND.ZIP_READER_EXIST_ENTRY, { id, path });
}

// WARNING: Do not use directly, only through ZipReader
export async function getZipReaderEntryNames(
  id: number,
  pattern: string = '',
): Promise<string[]> {
  return invoke(TAURI_COMMAND.ZIP_READER_GET_ENTRY_NAMES, { id, pattern });
}

// WARNING: Do not use directly, only through ZipReader
export async function getZipReaderEntryAsBinary(
  id: number,
  path: string,
): Promise<Uint8Array> {
  return invoke(TAURI_COMMAND.ZIP_READER_GET_ENTRY_AS_BINARY, { id, path });
}

// WARNING: Do not use directly, only through ZipReader
export async function getZipReaderEntryAsText(
  id: number,
  path: string,
): Promise<string> {
  return invoke(TAURI_COMMAND.ZIP_READER_GET_ENTRY_AS_TEXT, { id, path });
}

// WARNING: Do not use directly, only through ZipWriter
export async function loadZipWriter(source: string): Promise<number> {
  return invoke(TAURI_COMMAND.ZIP_WRITER_LOAD, { source });
}

// WARNING: Do not use directly, only through ZipWriter
export async function closeZipWriter(id: number): Promise<void> {
  return invoke(TAURI_COMMAND.ZIP_WRITER_CLOSE, { id });
}

// WARNING: Do not use directly, only through ZipWriter
export async function addZipWriterDirectory(
  id: number,
  path: string,
): Promise<boolean> {
  return invoke(TAURI_COMMAND.ZIP_WRITER_ADD_DIRECTORY, { id, path });
}

// WARNING: Do not use directly, only through ZipWriter
export async function writeZipWriterEntryFromBinary(
  id: number,
  path: string,
  binary: BinaryFileContents,
): Promise<void> {
  return invoke(TAURI_COMMAND.ZIP_WRITER_WRITE_ENTRY_FROM_BINARY, {
    id,
    path,
    binary: generateBinaryDataFromContent(binary),
  });
}

// WARNING: Do not use directly, only through ZipWriter
export async function writeZipWriterEntryFromText(
  id: number,
  path: string,
  text: string,
): Promise<void> {
  return invoke(TAURI_COMMAND.ZIP_WRITER_WRITE_ENTRY_FROM_TEXT, {
    id,
    path,
    text,
  });
}

// WARNING: Do not use directly, only through ZipWriter
export async function writeZipWriterEntryFromFile(
  id: number,
  path: string,
  source: string,
): Promise<void> {
  return invoke(TAURI_COMMAND.ZIP_WRITER_WRITE_ENTRY_FROM_FILE, {
    id,
    path,
    source,
  });
}

export async function getSha256OfFile(path: string): Promise<string> {
  return invoke(TAURI_COMMAND.HASH_GET_SHA256_OF_FILE, { path });
}

export async function log(level: number, message: string): Promise<void> {
  return invoke(TAURI_COMMAND.LOGGING_LOG, { level, message });
}

export async function osOpenProgram(
  path: string,
  args: string[] = [],
  envs: Record<string, string> = {},
): Promise<void> {
  return invoke(TAURI_COMMAND.OS_OPEN_PROGRAM, { path, args, envs });
}

// converts a path to once using only slashes
export async function slashify(path: string): Promise<string> {
  return invoke(TAURI_COMMAND.FILES_SLASHIFY, { path });
}

// important, is not equals to typical "toAbsolute" of some languages,
// and will fail if the file or the directory does not exist
export async function canonicalize(
  path: string,
  slash: boolean = true,
): Promise<string> {
  return invoke(TAURI_COMMAND.FILES_CANONICALIZE, { path, slash });
}

// paths returned by this function will always use the slash as separator
export async function readAndFilterPaths(
  baseDir: string,
  pattern: string = '',
): Promise<string[]> {
  return invoke(TAURI_COMMAND.FILES_READ_AND_FILTER_DIR, {
    base: baseDir,
    pattern,
  });
}

export async function scanFileForBytes(
  path: string,
  searchBytes: string | BinaryFileContents,
  scanAmount?: number,
): Promise<number | null> {
  return invoke(TAURI_COMMAND.FILES_SCAN_FILE_FOR_BYTES, {
    path,
    searchBytes: generateBinaryDataFromContent(searchBytes),
    scanAmount,
  });
}
