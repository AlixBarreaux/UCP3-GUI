import { RadioGroup, Radio } from 'react-radio-group';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Form } from 'react-bootstrap';
import { useState, useRef } from 'react';
import { STATUS_BAR_MESSAGE_ATOM } from '../../../../footer/footer';
import {
  CONFIGURATION_SUGGESTIONS_REDUCER_ATOM,
  CONFIGURATION_LOCKS_REDUCER_ATOM,
  CONFIGURATION_DEFAULTS_REDUCER_ATOM,
  CONFIGURATION_TOUCHED_REDUCER_ATOM,
  CONFIGURATION_FULL_REDUCER_ATOM,
} from '../../../../../function/configuration/state';

import {
  ChoiceContents,
  DisplayConfigElement,
} from '../../../../../config/ucp/common';
import { parseEnabledLogic } from '../enabled-logic';
import { createStatusBarMessage } from './StatusBarMessage';
import { ConfigPopover } from './popover/ConfigPopover';

// TODO is this deprecated?

function CreateRadioGroup(args: {
  spec: DisplayConfigElement;
  disabled: boolean;
  className: string;
}) {
  const [configuration, setConfiguration] = useAtom(
    CONFIGURATION_FULL_REDUCER_ATOM,
  );
  const setConfigurationTouched = useSetAtom(
    CONFIGURATION_TOUCHED_REDUCER_ATOM,
  );
  const configurationDefaults = useAtomValue(
    CONFIGURATION_DEFAULTS_REDUCER_ATOM,
  );
  const configurationLocks = useAtomValue(CONFIGURATION_LOCKS_REDUCER_ATOM);
  const configurationSuggestions = useAtomValue(
    CONFIGURATION_SUGGESTIONS_REDUCER_ATOM,
  );

  const { spec, disabled, className } = args;
  const { url, text, enabled } = spec;
  const { contents } = spec;
  const { choices } = contents as ChoiceContents;
  const { [url]: value } = configuration;
  const isEnabled = parseEnabledLogic(
    enabled,
    configuration,
    configurationDefaults,
  );

  // const hasWarning = configurationWarnings[url] !== undefined;
  const defaultChoice = choices[0];

  const statusBarMessage = createStatusBarMessage(
    disabled,
    !isEnabled,
    configurationLocks[url] !== undefined,
    enabled,
    configurationLocks[url],
    configurationSuggestions[url] !== undefined,
    configurationSuggestions[url],
  );
  const isDisabled =
    disabled || !isEnabled || configurationLocks[url] !== undefined;

  const setStatusBarMessage = useSetAtom(STATUS_BAR_MESSAGE_ATOM);

  const radios = choices.map((choice) => (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <div key={choice.name} className="form-check">
      <Radio
        className="form-check-input"
        value={choice.name}
        id={`${url}-radio-${choice.name}`}
      />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label
        className="form-check-label"
        htmlFor={`${url}-radio-${choice.name}`}
      >
        {choice.text}
      </label>
    </div>
  ));

  const [showPopover, setShowPopover] = useState(false);
  const ref = useRef(null);

  return (
    <Form.Group
      className={`d-flex align-items-baseline lh-sm config-number-group my-1 ${className}`}
      onMouseEnter={() => {
        setShowPopover(true);
        setStatusBarMessage(statusBarMessage);
      }}
      onMouseLeave={() => {
        setShowPopover(false);
        setStatusBarMessage(undefined);
      }}
      ref={ref}
    >
      <ConfigPopover show={showPopover} url={url} theRef={ref} />
      <p>{text}</p>
      <RadioGroup
        name={url}
        selectedValue={value === undefined ? defaultChoice : (value as string)}
        onChange={(newValue: string) => {
          setConfiguration({
            type: 'set-multiple',
            value: Object.fromEntries([[url, newValue]]),
          });
          setConfigurationTouched({
            type: 'set-multiple',
            value: Object.fromEntries([[url, true]]),
          });
          configuration[url] = newValue;
        }}
        disabled={isDisabled}
      >
        {radios}
      </RadioGroup>
    </Form.Group>
  );
}

export default CreateRadioGroup;
