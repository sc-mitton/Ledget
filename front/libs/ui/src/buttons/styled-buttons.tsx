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
    featherGray,
    red,
    clearGray,
    inputStyle,
    hoverHalfBlueText,
    hoverBlueText,
    hoverText
} from './base';

// Pill Buttons
export const BlackPillButton = styled(PillButton)`${charcoal}`
export const GrayPillButton = styled(PillButton)`${gray}`
export const FeatherGrayPillButton = styled(PillButton)`${featherGray}`

// Primary Buttons
export const BlackPrimaryButton = styled(PrimaryButton)`${charcoal}`
export const BluePrimaryButton = styled(PrimaryButton)`${blue}`
export const RedButton = styled(PrimaryButton)`${red}`

// Secondary Buttons
export const SecondaryButton = styled(PrimaryButton)`
    ${clearGray}
    margin-right: .25em;
`
export const SecondaryButtonSlim = styled(SlimButton)`${clearGray}`

export const NarrowButton = styled(NarrowButtonBase)`${clearGray}`

// Slim Buttons
export { SlimButton }
export const BlackSlimButton = styled(SlimButton)`${charcoal}`
export const BlackSlimButton2 = styled(SlimButton2)`${charcoal}`
export const BlackSlimButton3 = styled(SlimButton3)`${charcoal}`
export const BlueSlimButton = styled(SlimButton)`${blue}`
export const BlueSlimButton2 = styled(SlimButton2)`${blue}`
export const BlueSlimButton3 = styled(SlimButton3)`${blue}`
export const RedSlimButton = styled(SlimButton)`${red}`

export const ClearNarrowButton = styled(NarrowButton)`${clearGray}`

export const TextButton = styled(BaseButton)`
    &:not(:disabled) * {
        ${hoverText}
    }
    &:disabled {
        opacity: 1
    }
`
export const TextButtonHalfBlue = styled(SlimButton)`${hoverHalfBlueText}`
export const TextButtonBlue = styled(SlimButton)`${hoverBlueText}`

export const PrimaryTextButton = styled(PrimaryButton)`
    color: var(--m-text-tirtiary);

    * {
        color: var(--m-text-tirtiary);
    }

    &:hover {
        color: var(--m-text);

        * {
            color: var(--m-text);
        }
    }
`
export const IconButtonHalfBlue = styled(BaseButton)`${hoverHalfBlueText}`
export const IconButtonHalfGray = styled(BaseButton)`${clearGray} border-radius: .375em; padding: .125em;`
export const IconButtonBlue = styled(BaseButton)`${hoverBlueText}`

export const FadedIconButton = styled(BaseButton)`
    color: var(--m-text-quaternary);

    &:hover {
        color: var(--m-text-secondary);
    }
`

export const FormInputButton = styled(BaseButton)`
    ${inputStyle}
    padding: .625em 1em;
    margin: .375em 0;
    min-height: 2.75em;
    border-radius: var(--border-radius2);
    width: 100%;
    overflow: visible;
`

export const FormInputButton2 = styled(BaseButton)`
    ${inputStyle}
    padding: .375em 1em;
    margin: .375em 0;
    border-radius: var(--border-radius2);
`

export const BlueFadedSquareRadio = styled(BaseButton) <React.HTMLProps<HTMLButtonElement> & { selected?: boolean }>`
    background-color: ${props => props.selected ? 'var(--blue-light)' : 'var(--btn-light-gray)'};
    color: ${props => props.selected ? 'var(--blue-sat-hover)' : 'var(--btn-gray)'};
    font-weight: ${props => props.selected ? 'var(--fw-bold)' : 'var(--fw-regular)'};
    border-radius: .375em;
    padding: .125em .25em;

    &:hover {
        background-color: ${props => props.selected ? 'var(--blue-light)' : 'var(--btn-light-gray-hover)'};
    }
`

export const FilterPillButton = styled(BaseButton) <React.HTMLProps<HTMLButtonElement> & { selected?: boolean }>`
    padding: .125em 1em;
    color: var(--m-text-secondary);
    border: ${props => props.selected ? '1px solid var(--blue-sat)' : '1px solid var(--border-color)'};
    border-radius: 1em;

    &:hover {
        border-color: var(--m-text-tirtiary);
    }
`
