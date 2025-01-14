import styled from 'styled-components';

import {
  BaseButton,
  PillButton,
  SlimButton,
  SlimButton2,
  SlimButton3,
  PrimaryButton,
  NarrowButton as NarrowButtonBase,
  charcoal,
  blue,
  gray,
  borderedGray,
  featherGray,
  red,
  clearGray,
  clearBlue,
  inputStyle,
  hoverHalfBlueText,
  hoverBlueText,
  hoverText,
} from './base';

// Pill Buttons
export const BlackPillButton = styled(PillButton)`
  ${charcoal}
`;
export const GrayPillButton = styled(PillButton)`
  ${gray}
`;
export const FeatherGrayPillButton = styled(PillButton)`
  ${featherGray}
`;

// Primary Buttons
export const BlackPrimaryButton = styled(PrimaryButton)`
  ${charcoal}
`;
export const BluePrimaryButton = styled(PrimaryButton)`
  ${blue}
`;
export const RedButton = styled(PrimaryButton)`
  ${red}
`;

// Secondary Buttons
export const SecondaryButton = styled(PrimaryButton)`
  ${clearGray}
  margin-right: .25em;
`;
export const SecondaryButtonSlim = styled(SlimButton)`
  ${clearGray}
`;

export const NarrowButton = styled(NarrowButtonBase)`
  ${clearGray}
`;

// Slim Buttons
export { SlimButton };
export const BlackSlimButton = styled(SlimButton)`
  ${charcoal}
`;
export const BlackSlimButton2 = styled(SlimButton2)`
  ${charcoal}
`;
export const BlackSlimButton3 = styled(SlimButton3)`
  ${charcoal}
`;
export const BlueSlimButton = styled(SlimButton)`
  ${blue}
`;
export const BlueSlimButton2 = styled(SlimButton2)`
  ${blue}
`;
export const BlueSlimButton3 = styled(SlimButton3)`
  ${blue}
`;
export const RedSlimButton = styled(SlimButton)`
  ${red}
`;
export const HalfTextSlimBlueButton = styled(SlimButton)`
  ${clearBlue}
  color: var(--blue);
  * {
    color: var(--blue);
  }
`;

export const ClearNarrowButton = styled(NarrowButton)`
  ${clearGray}
`;

export const TextButton = styled(BaseButton)`
  &:not(:disabled) * {
    ${hoverText}
  }
  &:disabled {
    opacity: 1;
  }
`;
export const TextButtonHalfBlue = styled(SlimButton)`
  ${hoverHalfBlueText}
  border-radius: .25em;
`;
export const TextButtonBlue = styled(SlimButton)`
  ${hoverBlueText}
`;

export const PrimaryTextButton = styled(PrimaryButton)`
  color: var(--m-text-tertiary);

  * {
    color: var(--m-text-tertiary);
  }

  &:hover {
    color: var(--m-text);

    * {
      color: var(--m-text);
    }
  }
`;

export const IconButtonHalfBlue = styled(BaseButton)`
  ${hoverHalfBlueText} border-radius: .25em;
`;

export const IconButtonHalfGray = styled(BaseButton)`
  ${clearGray} border-radius: .375em;
  padding: 0.125em;
`;

export const IconButtonGray = styled(BaseButton)`
  ${gray} border-radius: .375em;
  padding: 0.25em;
`;

export const IconButtonBlue = styled(BaseButton)`
  ${hoverBlueText} border-radius: .25em;
`;

export const IconButtonBorderedGray = styled(BaseButton)`
  ${borderedGray}
  border-radius: .5em;
  padding: 0.25em;
`;

export const FadedIconButton = styled(BaseButton)`
  color: var(--m-text-quaternary);

  &:hover {
    color: var(--m-text-secondary);
  }
`;

export const FormInputButton = styled(BaseButton)`
  ${inputStyle}
  padding: .625em 1em;
  margin: 0.375em 0;
  min-height: 2.75em;
  border-radius: var(--border-radius3);
  width: 100%;
  overflow: visible;
`;

export const FormInputButton2 = styled(BaseButton)`
  ${inputStyle}
  padding: .375em 1em;
  margin: 0.375em 0;
  border-radius: var(--border-radius3);
`;

export const BlueFadedSquareRadio = styled(BaseButton)<
  React.HTMLProps<HTMLButtonElement> & { selected?: boolean }
>`
  background-color: ${(props) =>
    props.selected ? 'var(--blue-light)' : 'var(--btn-light-gray)'};
  color: ${(props) =>
    props.selected ? 'var(--blue-sat-hover)' : 'var(--btn-gray)'};
  font-weight: ${(props) =>
    props.selected ? 'var(--fw-bold)' : 'var(--fw-regular)'};
  border-radius: 0.375em;
  padding: 0.125em 0.25em;
  justify-content: center;

  &:hover {
    background-color: ${(props) =>
      props.selected ? 'var(--blue-light)' : 'var(--btn-light-gray-hover)'};
  }
`;

export const FilterPillButton = styled(BaseButton)<
  React.HTMLProps<HTMLButtonElement> & { selected?: boolean }
>`
  padding: 0.125em 1em;
  color: ${(props) =>
    props.selected ? 'var(--blue-sat)' : 'var(--m-text-secondary)'};
  border: ${(props) =>
    props.selected
      ? '1px solid var(--blue-sat)'
      : '1px solid var(--border-color)'};
  border-radius: 1em;

  &:hover {
    border-color: var(--m-text-secondary);
  }
`;
