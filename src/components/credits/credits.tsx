import './credits.css';

import {
  OVERLAY_ACTIVE_ATOM,
  OverlayContentProps,
  setOverlayContent,
} from 'components/overlay/overlay';
import { useTranslation } from 'react-i18next';

import Markdown from 'react-markdown';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import rehypeExternalLinks from 'rehype-external-links';

import { useAtomValue } from 'jotai';

// eslint-disable-next-line import/no-unresolved
import credits from './credits.md?raw';

function Credits(props: OverlayContentProps) {
  const { closeFunc } = props;

  const [t] = useTranslation(['gui-general', 'gui-landing']);

  return (
    <div className="credits-container">
      <h1 className="credits-title">{t('gui-landing:credits.title')}</h1>
      <div
        className="parchment-box credits-text-box"
        style={{ backgroundImage: '' }}
      >
        <div className="credits-text">
          <Markdown
            rehypePlugins={[[rehypeExternalLinks, { target: '_blank' }]]}
          >
            {credits}
          </Markdown>
        </div>
      </div>
      <button
        type="button"
        className="ucp-button credits-close"
        onClick={closeFunc}
      >
        {t('gui-general:close')}
      </button>
    </div>
  );
}

export default function CreditsButton() {
  const overlayActive = useAtomValue(OVERLAY_ACTIVE_ATOM);

  const [t] = useTranslation(['gui-landing']);
  return (
    <button
      type="button"
      className="credits-button"
      onClick={() => setOverlayContent(Credits, true, true)}
      disabled={overlayActive}
    >
      {t('gui-landing:credits.open')}
    </button>
  );
}
