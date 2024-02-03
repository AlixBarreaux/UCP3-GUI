import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';

import { useRef, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  NumberContents,
  SliderDisplayConfigElement,
} from '../../../../../config/ucp/common';
import { STATUS_BAR_MESSAGE_ATOM } from '../../../../footer/footer';
import {
  CONFIGURATION_SUGGESTIONS_REDUCER_ATOM,
  CONFIGURATION_LOCKS_REDUCER_ATOM,
  CONFIGURATION_DEFAULTS_REDUCER_ATOM,
  CONFIGURATION_TOUCHED_REDUCER_ATOM,
  CONFIGURATION_FULL_REDUCER_ATOM,
  CONFIGURATION_USER_REDUCER_ATOM,
} from '../../../../../function/configuration/state';
import { parseEnabledLogic } from '../enabled-logic';
import { createStatusBarMessage } from './StatusBarMessage';
import { ConfigPopover } from './popover/ConfigPopover';

function CreateSlider(args: {
  spec: SliderDisplayConfigElement;
  disabled: boolean;
  className: string;
}) {
  const [configuration, setConfiguration] = useAtom(
    CONFIGURATION_FULL_REDUCER_ATOM,
  );
  const setUserConfiguration = useSetAtom(CONFIGURATION_USER_REDUCER_ATOM);
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

  const { spec, disabled } = args;
  // TODO: text property is unused... is that correct?
  const { url, enabled } = spec;
  const { contents } = spec;
  const { min, max, step } = contents as NumberContents;
  const { [url]: value } = configuration as {
    [url: string]: { enabled: boolean; sliderValue: number };
  };
  const isEnabled = parseEnabledLogic(
    enabled,
    configuration,
    configurationDefaults,
  );

  // const hasWarning = configurationWarnings[url] !== undefined;

  // eslint-disable-next-line no-nested-ternary
  const factor = 1 / (step === undefined ? 1 : step === 0 ? 1 : step);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [localValue, setLocalValue] = useState(
    value.sliderValue === undefined
      ? 0
      : (value.sliderValue as number) * factor,
  );

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

  const [showPopover, setShowPopover] = useState(false);
  const ref = useRef(null);

  return (
    <div
      onMouseEnter={() => {
        setShowPopover(true);
        setStatusBarMessage(statusBarMessage);
      }}
      onMouseLeave={() => {
        setShowPopover(false);
        setStatusBarMessage(undefined);
      }}
      ref={ref}
      className="ui-element"
    >
      <ConfigPopover show={showPopover} url={url} theRef={ref} />
      <RangeSlider
        className="ucp-slider"
        min={min * factor}
        max={max * factor}
        step={step * factor}
        id={`${url}-slider`}
        size="sm"
        value={localValue}
        tooltipLabel={(currentValue) => (currentValue / factor).toString()}
        onChange={(event) => {
          setLocalValue(parseInt(event.target.value, 10));
        }}
        onAfterChange={(event) => {
          setUserConfiguration({
            type: 'set-multiple',
            value: Object.fromEntries([
              [
                url,
                {
                  ...value,
                  ...{
                    sliderValue: parseInt(event.target.value, 10) / factor,
                  },
                },
              ],
            ]),
          });
          setConfiguration({
            type: 'set-multiple',
            value: Object.fromEntries([
              [
                url,
                {
                  ...value,
                  ...{
                    sliderValue: parseInt(event.target.value, 10) / factor,
                  },
                },
              ],
            ]),
          });
          setConfigurationTouched({
            type: 'set-multiple',
            value: Object.fromEntries([[url, true]]),
          });
        }}
        disabled={isDisabled}
      />
    </div>
  );
}

export default CreateSlider;
