import {
  useConfigurationDefaults,
  useConfigurationLocks,
  useConfigurationReducer,
  useConfigurationSuggestions,
  useConfigurationWarnings,
  useSetConfigurationTouched,
} from 'hooks/jotai/globals-wrapper';

import { ChoiceContents, DisplayConfigElement } from 'config/ucp/common';
import { Form } from 'react-bootstrap';
import { STATUS_BAR_MESSAGE_ATOM } from 'function/global/global-atoms';
import { useSetAtom } from 'jotai';
import { parseEnabledLogic } from '../enabled-logic';
import { formatToolTip } from '../tooltips';
import ConfigWarning from './ConfigWarning';
import { createStatusBarMessage } from './StatusBarMessage';

function CreateChoice(args: {
  spec: DisplayConfigElement;
  disabled: boolean;
  className: string;
}) {
  const [configuration, setConfiguration] = useConfigurationReducer();
  const configurationWarnings = useConfigurationWarnings();
  const setConfigurationTouched = useSetConfigurationTouched();
  const configurationDefaults = useConfigurationDefaults();
  const configurationLocks = useConfigurationLocks();
  const configurationSuggestions = useConfigurationSuggestions();

  const { spec, disabled, className } = args;
  const { url, text, tooltip, enabled, contents } = spec;
  const { choices } = contents as ChoiceContents;
  const { [url]: value } = configuration;
  const isEnabled = parseEnabledLogic(
    enabled,
    configuration,
    configurationDefaults
  );
  const fullToolTip = formatToolTip(tooltip, url);

  const hasWarning = configurationWarnings[url] !== undefined;
  const defaultChoice = choices[0].name;

  const statusBarMessage = createStatusBarMessage(
    disabled,
    !isEnabled,
    configurationLocks[url] !== undefined,
    enabled,
    configurationLocks[url],
    configurationSuggestions[url] !== undefined,
    configurationSuggestions[url]
  );
  const isDisabled =
    disabled || !isEnabled || configurationLocks[url] !== undefined;

  const setStatusBarMessage = useSetAtom(STATUS_BAR_MESSAGE_ATOM);

  return (
    <Form.Group
      className={`d-flex align-items-baseline lh-sm config-number-group my-1 ${className}`}
      onMouseEnter={() => {
        setStatusBarMessage(statusBarMessage);
      }}
      onMouseLeave={() => {
        setStatusBarMessage(undefined);
      }}
    >
      {hasWarning ? (
        <ConfigWarning
          text={configurationWarnings[url].text}
          level={configurationWarnings[url].level}
        />
      ) : null}
      <div className="col-3">
        <Form.Select
          size="sm"
          className="bg-dark text-light fs-7 lh-1"
          key={`${url}-input`}
          id={`${url}-input`}
          // Tooltip stuff
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={fullToolTip}
          // End of tooltip stuff
          value={value === undefined ? defaultChoice : (value as string)}
          onChange={(event) => {
            setConfiguration({
              type: 'set-multiple',
              value: Object.fromEntries([[url, event.target.value]]),
            });
            setConfigurationTouched({
              type: 'set-multiple',
              value: Object.fromEntries([[url, true]]),
            });
          }}
          disabled={isDisabled}
        >
          {choices.map((choice) => (
            <option key={`choice-${choice.name}`} value={choice.name}>
              {choice.text}
            </option>
          ))}
        </Form.Select>
      </div>
      <div className={`flex-grow-1 px-2 ${isDisabled ? 'label-disabled' : ''}`}>
        <Form.Label
          htmlFor={`${url}-input`}
          // Tooltip stuff
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={fullToolTip}
          // End of tooltip stuff
          // disabled={!isEnabled || disabled || configurationLocks[url] === true}
        >
          {text}
        </Form.Label>
      </div>
    </Form.Group>
  );
}

export default CreateChoice;
