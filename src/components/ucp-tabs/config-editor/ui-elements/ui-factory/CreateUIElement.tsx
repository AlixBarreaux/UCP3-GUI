import { DisplayConfigElement } from 'config/ucp/common';
import { useTranslation } from 'react-i18next';
import { warn } from 'util/scripts/logging';
import { DisplayDefaults } from '../display-defaults';
import CreateChoice from './CreateChoice';
// eslint-disable-next-line import/no-cycle
import CreateGroup from './CreateGroup';
// eslint-disable-next-line import/no-cycle
import CreateGroupBox from './CreateGroupBox';
import CreateNumberInput from './CreateNumberInput';
import CreateParagraph from './CreateParagraph';
import CreateRadioGroup from './CreateRadioGroup';
import CreateSlider from './CreateSlider';
import CreateSwitch from './CreateSwitch';
import CreateUCP2RadioGroup from './CreateUCP2RadioGroup';
import CreateUCP2Slider from './CreateUCP2Slider';
import CreateUCP2SliderChoice from './CreateUCP2SliderChoice';
import CreateUCP2Switch from './CreateUCP2Switch';
import CreateCustomMenu from './CreateCustomMenu';

function CreateUIElement(args: {
  spec: DisplayConfigElement;
  disabled: boolean;
  className: string;
}) {
  const { spec, disabled, className } = args;

  const [t] = useTranslation(['gui-editor']);

  // TODO: looks like this could be replaced at least by a switch
  if (spec.display === undefined) {
    if (spec.contents.type !== undefined) {
      spec.display = DisplayDefaults[spec.contents.type];
    }
  }
  // why the second if?
  if (spec.display === undefined) {
    warn(
      t('gui-editor:config.element.unsupported.type', {
        url: spec.url,
        type: spec.contents.type,
      })
    );
    return <div />;
  }
  if (spec.display === 'UCP2Slider') {
    return (
      <CreateUCP2Slider spec={spec} disabled={disabled} className={className} />
    );
  }
  if (spec.display === 'UCP2SliderChoice') {
    return (
      <CreateUCP2SliderChoice
        spec={spec}
        disabled={disabled}
        className={className}
      />
    );
  }
  if (spec.display === 'UCP2Switch') {
    return (
      <CreateUCP2Switch
        spec={spec as DisplayConfigElement}
        disabled={disabled}
        className={className}
      />
    );
  }
  if (spec.display === 'UCP2RadioGroup') {
    return (
      <CreateUCP2RadioGroup
        spec={spec as DisplayConfigElement}
        disabled={disabled}
        className={className}
      />
    );
  }
  if (spec.display === 'Slider') {
    return (
      <CreateSlider spec={spec} disabled={disabled} className={className} />
    );
  }
  if (spec.display === 'Paragraph') {
    return (
      <CreateParagraph spec={spec} disabled={disabled} className={className} />
    );
  }
  if (spec.display === 'Group') {
    return (
      <CreateGroup spec={spec} disabled={disabled} className={className} />
    );
  }
  if (spec.display === 'GroupBox') {
    return (
      <CreateGroupBox spec={spec} disabled={disabled} className={className} />
    );
  }
  if (spec.display === 'Switch') {
    return (
      <CreateSwitch spec={spec} disabled={disabled} className={className} />
    );
  }
  if (spec.display === 'Number') {
    return (
      <CreateNumberInput
        spec={spec}
        disabled={disabled}
        className={className}
      />
    );
  }
  if (spec.display === 'Choice') {
    return (
      <CreateChoice spec={spec} disabled={disabled} className={className} />
    );
  }
  if (spec.display === 'RadioGroup') {
    return (
      <CreateRadioGroup spec={spec} disabled={disabled} className={className} />
    );
  }
  if (spec.display === 'CustomMenu') {
    return (
      <CreateCustomMenu spec={spec} disabled={disabled} className={className} />
    );
  }
  warn(
    t('gui-editor:config.element.unsupported.type', {
      url: spec.url,
      type: spec.contents.type,
    })
  );
  return <div />;
}

export default CreateUIElement;
