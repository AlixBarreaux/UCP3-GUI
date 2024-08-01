import { atom } from 'jotai';
import { atomWithQuery } from 'jotai-tanstack-query';
import { DEFAULT_CONTENT_STATE } from '../../../../function/content/state/content-state';
import { DEFAULT_CONTENT_INTERFACE_STATE } from '../../../../function/content/state/content-interface-state';
import { dummyFetchStore } from '../../../../function/content/store/fetch';
import { EXTENSION_STATE_INTERFACE_ATOM } from '../../../../function/extensions/state/state';
import { ContentElement } from '../../../../function/content/types/content-element';

// eslint-disable-next-line import/prefer-default-export
export const CONTENT_STATE_ATOM = atom(DEFAULT_CONTENT_STATE);
export const CONTENT_INTERFACE_STATE_ATOM = atom(
  DEFAULT_CONTENT_INTERFACE_STATE,
);

export const CONTENT_STORE_ATOM = atomWithQuery(() => ({
  queryKey: ['store'],
  queryFn: false || dummyFetchStore,
  retry: false,
  // staleTime: Infinity,
}));

export const CONTENT_ELEMENTS_ATOM = atom((get) => {
  const { data } = get(CONTENT_STORE_ATOM);

  const { extensions } = get(EXTENSION_STATE_INTERFACE_ATOM);

  const storePackages =
    data === undefined
      ? []
      : data.extensions.list.map(
          (ec) => ({ ...ec, online: true, installed: false }) as ContentElement,
        );

  const extensionPackages = extensions.map(
    (e) =>
      ({
        definition: {
          ...e.definition,
          url: 'nonsense',
          dependencies: Object.fromEntries(
            Object.entries(e.definition.dependencies).map(([n, range]) => [
              n,
              range.raw,
            ]),
          ),
        },
        sources: {
          package: [],
          description: [
            {
              language: 'default',
              content: e.description || '< not loaded >',
              method: 'inline',
            },
          ],
        },
        online: false,
        installed: true,
        extension: e,
      }) as ContentElement,
  );

  const epIDs = extensionPackages.map(
    (ce) => `${ce.definition.name}@${ce.definition.version}`,
  );

  return [
    // Filter out already installed elements
    ...storePackages.filter(
      (ce) =>
        epIDs.indexOf(`${ce.definition.name}@${ce.definition.version}`) === -1,
    ),
    ...extensionPackages,
  ];
});