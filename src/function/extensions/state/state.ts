import { atomWithReducer } from 'jotai/utils';
import { atom } from 'jotai';
import { ExtensionDependencyTree } from '../dependency-management/dependency-resolution';
import { ExtensionsState } from '../extensions-state';
import { generateAndSetFullConfig } from './change';
import { createEmptyConfigurationState } from '../../configuration/state';

// eslint-disable-next-line func-style
export const extensionStateReducer = (
  oldState: ExtensionsState,
  newState: Partial<ExtensionsState>,
): ExtensionsState => {
  const state = { ...oldState, ...newState };
  return state;
};

export const EXTENSION_STATE_INTERNAL_ATOM = atomWithReducer(
  {
    extensions: [],
    onlineAvailableExtensions: [],
    installedExtensions: [],
    activeExtensions: [],
    explicitlyActivatedExtensions: [],
    tree: new ExtensionDependencyTree([]),
    configuration: createEmptyConfigurationState(),
  },
  extensionStateReducer,
);

export const EXTENSION_STATE_INTERFACE_ATOM = atom(
  (get) => get(EXTENSION_STATE_INTERNAL_ATOM),
  (get, set, newValue: ExtensionsState) => {
    generateAndSetFullConfig(get, set, newValue);
    set(EXTENSION_STATE_INTERNAL_ATOM, newValue);
  },
);

export const EXTENSION_STATE_REDUCER_ATOM = EXTENSION_STATE_INTERFACE_ATOM;
export type PreferredExtensionVersionDictionary = {
  [extensionName: string]: string;
};
export const PREFERRED_EXTENSION_VERSION_ATOM =
  atom<PreferredExtensionVersionDictionary>({});
export type AvailableExtensionVersionsDictionary = {
  [extensionName: string]: string[];
};
export const AVAILABLE_EXTENSION_VERSIONS_ATOM =
  atom<AvailableExtensionVersionsDictionary>((get) => {
    const { extensions } = get(EXTENSION_STATE_REDUCER_ATOM);

    const { tree } = get(EXTENSION_STATE_REDUCER_ATOM);

    return Object.fromEntries(
      Array.from(new Set(extensions.map((e) => e.name))).map((name) => [
        name,
        tree.allExtensionVersionsForName(name),
      ]),
    ) as AvailableExtensionVersionsDictionary;
  });
