import styled, { css } from 'styled-components';

export const BaseButton = styled.button`
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  &:hover {
    transition: all 0.3s ease;
  }
`;

/* ----------------------------- Shaped Buttons ----------------------------- */

export const PillButton = styled(BaseButton)`
  border-radius: 1em;
  padding: 0.125em 0.75em;
`;

export const SlimButton = styled(BaseButton)`
  border-radius: 0.5em;
  padding: 0.125em 0.75em;
`;

export const SlimButton2 = styled(BaseButton)`
  border-radius: 0.75em;
  padding: 0.125em 0.5em;
`;

export const SlimButton3 = styled(BaseButton)`
  border-radius: 0.5em;
  padding: 0em 0.5em;
`;

export const PrimaryButton = styled(BaseButton)`
  padding: 0.375em 0.75em;
  border-radius: 0.625em;
`;

export const WideButton = styled(BaseButton)`
  border-radius: 0.75em;
  padding: 0.75em 1em;
  width: 100%;

  & > div {
    display: flex;
    align-items: center;
    gap: 0.25em;
  }
`;

export const NarrowButton = styled(BaseButton)`
  padding: 0.25em 0;
  border-radius: 0.375em;
`;

/* --------------------------------- Colors --------------------------------- */

export const charcoal = css`
  background-color: var(--btn-chcl);
  color: var(--m-invert-text);
  font-weight: var(--fw-bold);

  &:hover {
    background-color: var(--btn-chcl-hover);
  }
`;

export const blue = css`
  background-color: var(--blue-medium);
  color: var(--white);

  * {
    color: inherit;
  }

  &:hover {
    background-color: var(--blue-medium-hover);
  }
`;

export const main = css`
  background-color: var(--btn-main);
  color: var(--white);

  * {
    color: inherit;
  }

  &:hover {
    background-color: var(--btn-main-hover);
  }
`;

export const gray = css`
  box-shadow: var(--btn-drop-shadow);
  background-color: var(--btn-light-gray);

  &:hover {
    background-color: var(--btn-light-gray-hover);
  }
`;

export const borderedGray = css`
  box-shadow: var(--btn-drop-shadow);
  border: 1.25px solid var(--btn-feather-light-gray);

  &:hover {
    border-color: var(--btn-light-gray);
  }
`;

export const featherGray = css`
  box-shadow: var(--btn-drop-shadow);
  background-color: var(--btn-feather-light-gray);

  &:hover {
    background-color: var(--btn-feather-light-gray-hover);
  }
`;

export const gray2 = css`
  box-shadow: var(--btn-drop-shadow);
  background-color: var(--btn-feather-light-gray);

  &:hover {
    background-color: var(--btn-feather-light-gray-hover);
  }
`;

export const clearGray = css`
  background-color: transparent;

  &:hover {
    background-color: var(--btn-light-gray);
  }
`;

export const clearBlue = css`
  background-color: transparent;

  &:hover {
    background-color: var(--blue-light);
  }
`;

export const red = css`
  background-color: var(--mute-red);
  color: var(--m-invert-text);
  font-weight: var(--fw-regular);
  margin: 0.25em 0;

  &:hover {
    background-color: var(--hover-red);
  }
`;

export const blueText = css`
  color: var(--blue-sat);

  * {
    color: var(--blue-sat);
  }

  &:hover {
    color: var(--blue-sat-hover);

    * {
      color: var(--blue-sat-hover);
    }
  }
`;
export const inputStyle = css`
  color: var(--input-placeholder2);
  background-color: var(--input-background);
  gap: 0.25em;
  border: var(--input-border);

  &:focus-visible {
    border: var(--input-border-focus);
  }

  &:hover {
    border: var(--input-border-hover);
  }
`;

export const hoverText = css`
  color: var(--m-text-secondary);

  * {
    color: var(--m-text-secondary);
  }

  &:hover {
    color: var(--m-text);

    * {
      color: var(--m-text);
    }
  }
`;

export const hoverHalfBlueText = css`
  color: var(--m-text-secondary);

  * {
    color: var(--m-text-secondary);
  }

  &:hover {
    color: var(--blue-sat);

    * {
      color: var(--blue-sat);
    }
  }
`;

export const hoverBlueText = css`
  color: var(--blue-sat);
  font-weight: var(--fw-bold);

  * {
    color: var(--blue-sat);
  }

  &:hover {
    color: var(--blue-sat-hover);

    * {
      color: var(--blue-sat-hover);
    }
  }
`;

export const SocialButton = styled(BaseButton)`
  border-radius: 0.75em;
  padding: 0.375em;
  border: 1.5px solid var(--btn-light-gray);
  transition: all 0.3s;

  &:hover {
    border-color: var(--btn-gray);
    transition: all 0.3s;
  }

  svg {
    padding: 0;
    margin: 0;
  }
`;
