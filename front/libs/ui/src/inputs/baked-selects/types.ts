import { ComponentProps, FC } from 'react';

import { Control, FieldError } from 'react-hook-form';
import { DropdownDiv } from '../../animations/dropdowndiv/dropdowndiv';

interface BakedSelectPropsBase {
  name?: string;
  labelKey?: string;
  subLabelKey?: string;
  valueKey?: string;
  labelPrefix?: string;
  subLabelPrefix?: string;
  placement?: ComponentProps<typeof DropdownDiv>['placement'];
  placeholder?: string;
  withCheckMarkIndicator?: boolean;
  withChevron?: boolean;
  as?: FC<React.HTMLAttributes<HTMLButtonElement>>;
  error?: FieldError;
  style?: React.CSSProperties;
  dropdownStyle?: React.CSSProperties;
  control?: Control<any>;
  maxLength?: number;
  buttonMaxWidth?: boolean;
  dividerKey?: string;
  showLabel?: boolean;
}

export type Option = {
  label?: string;
  value?: string | { [key: string]: any };
  default?: boolean;
  disabled?: boolean;
  [key: string]: any;
};

export type BakedSelectProps<
  OL extends Option[] | readonly string[] | string[],
  AN extends boolean
> = BakedSelectPropsBase &
  (
    | {
        options: OL;
        allowNoneSelected?: AN;
        multiple?: true;
        value?: [OL[number]];
        defaultValue?: [OL[number]];
        disabled?: [OL[number]];
        onChange?: React.Dispatch<
          React.SetStateAction<
            AN extends true ? [OL[number]] : [OL[number]] | undefined
          >
        >;
      }
    | {
        options: OL;
        multiple?: false;
        allowNoneSelected?: AN;
        value?: OL[number];
        defaultValue?: OL[number];
        disabled?: OL[number];
        onChange?: React.Dispatch<
          React.SetStateAction<
            AN extends true ? OL[number] : OL[number] | undefined
          >
        >;
      }
  );
