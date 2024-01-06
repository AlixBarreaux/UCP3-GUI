import { BinaryFileContents } from '@tauri-apps/api/fs';
import { TFunction } from 'i18next';
import { askInfo, showWarning } from 'tauri/tauri-dialog';
import {
  getLocalDataFolder,
  recursiveCreateDirForFile,
  removeFile,
  writeBinaryFile,
  Error as FileUtilError,
} from 'tauri/tauri-files';
import { extractZipToPath } from 'tauri/tauri-invoke';
import Result from 'util/structs/result';
import {
  UCP_STATE_ATOM,
  activateUCP,
  createRealBink,
} from 'function/ucp-files/ucp-state';
import { getBinary } from 'tauri/tauri-http';
import { getStore } from 'hooks/jotai/base';
import { checkForLatestUCP3DevReleaseUpdate } from './github';
import { UCP_VERSION_ATOM } from '../ucp-files/ucp-version';
import { GITHUB_AUTH_HEADER } from './download-enums';

export async function installUCPFromZip(
  zipFilePath: string,
  gameFolder: string,
  statusCallback: (status: string) => void,
  t: TFunction,
): Promise<Result<void, FileUtilError>> {
  return Result.tryAsync(async () => {
    (await createRealBink()).throwIfErr();

    statusCallback(t('gui-download:zip.extract'));
    try {
      await extractZipToPath(zipFilePath, gameFolder);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw t('gui-download:zip.extract.error', { error });
    }

    // Force a refresh on this atom to ensure activateUCP() is dealing with the right IO state
    getStore().set(UCP_VERSION_ATOM);

    // Force a refresh on this atom to ensure activateUCP() is dealing with the right IO state
    getStore().set(UCP_STATE_ATOM);

    // Activate the UCP by default when installing
    (await activateUCP()).throwIfErr();
  });
}

export async function checkForUCP3Updates(
  gameFolder: string,
  statusCallback: (status: string) => void,
  t: TFunction,
) {
  const returnObject = {
    update: false,
    file: '',
    downloaded: false,
    installed: false,
  };

  statusCallback(t('gui-download:ucp.version.yaml.load'));
  const vr = await getStore().get(UCP_VERSION_ATOM);
  const { version } = vr;
  const sha = version!.sha.getOrElse('!');

  statusCallback(t('gui-download:ucp.version.check'));
  const result = await checkForLatestUCP3DevReleaseUpdate(sha);

  if (result.update !== true) {
    statusCallback(t('gui-download:ucp.version.not.available'));
    return returnObject;
  }
  returnObject.update = true;
  returnObject.file = result.file;

  // ask options are fixed in tauri
  const dialogResult = await askInfo(
    t('gui-download:ucp.download.request', { version: result.file }),
    t('gui-general:confirm'),
  );

  if (dialogResult !== true) {
    statusCallback(t('gui-download:ucp.download.cancelled'));
    return returnObject;
  }

  statusCallback(t('gui-download:ucp.download.download'));
  const downloadPath = `${await getLocalDataFolder()}/ucp-zip/${result.file}`;
  try {
    (await recursiveCreateDirForFile(downloadPath)).throwIfErr();

    const response = await getBinary<BinaryFileContents>(
      result.downloadUrl,
      GITHUB_AUTH_HEADER,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch update.');
    }

    (await writeBinaryFile(downloadPath, response.data)).throwIfErr();
  } catch (error) {
    statusCallback(t('gui-download:ucp.download.failed', { error }));
    return returnObject;
  }
  returnObject.downloaded = true;

  // has its own statusCallbacks
  const installResult = await installUCPFromZip(
    downloadPath,
    gameFolder,
    statusCallback,
    t,
  );
  if (installResult.isErr()) {
    installResult
      .err()
      .ifPresent((error) =>
        statusCallback(t('gui-download:ucp.install.failed', { error })),
      );
    return returnObject;
  }

  // TODO: in the future, use a cache?
  (await removeFile(downloadPath))
    .err()
    .ifPresent((error) =>
      showWarning(t('gui-download:ucp.install.zip.remove.failed', { error })),
    );

  returnObject.installed = true;
  return returnObject;
}
