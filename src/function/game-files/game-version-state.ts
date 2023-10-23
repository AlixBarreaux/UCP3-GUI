import { selectAtom } from 'jotai/utils';
import getGameExeHash from './game-hash';
import { EMPTY_GAME_VERSION, getGameVersionForHash } from './game-version';
import { EXTREME_PATH_ATOM, VANILLA_PATH_ATOM } from './game-path';

async function getGameVersionForPath(path: string) {
  return (await getGameExeHash(path))
    .map(getGameVersionForHash)
    .getOrElse(EMPTY_GAME_VERSION);
}

export const VANILLA_VERSION_ATOM = selectAtom(
  VANILLA_PATH_ATOM,
  getGameVersionForPath,
);

export const EXTREME_VERSION_ATOM = selectAtom(
  EXTREME_PATH_ATOM,
  getGameVersionForPath,
);