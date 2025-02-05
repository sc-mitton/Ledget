import { ComponentProps, FC } from 'react';

import { Control, FieldError } from 'react-hook-form';
import { DropdownDiv } from '../../animations/dropdowndiv/dropdowndiv';

interface BakedSelectPropsBase {
  name?: string;
  subLabelKey?: string;
  labelPrefix?: string;
  subLabelPrefix?: string;
  placement?: ComponentProps<typeof DropdownDiv>['placement'];
  placeholder?: string;
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
  renderIndicator?: (active: boolean, selected: boolean) => JSX.Element;
  indicatorIcon?: 'plus' | 'chevron';
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
  AN extends boolean,
  VK extends string = 'value',
  LK extends string = 'label'
> = BakedSelectPropsBase & {
  labelKey?: OL extends Option[] ? LK : never;
  valueKey?: OL extends Option[] ? VK : never;
  renderLabel?: (
    label: string,
    active: boolean,
    selected: boolean
  ) => JSX.Element;
} & (
    | {
        options: OL;
        allowNoneSelected?: AN;
        multiple?: true;
        defaultValue?: OL extends Option[] ? OL[number][VK][] : OL[number][];
        value?: OL extends Option[] ? OL[number][VK][] : OL[number][];
        renderSelected?: (
          value: OL extends Option[] ? OL[number][VK][] : OL[number][]
        ) => JSX.Element;
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
        defaultValue?: OL extends Option[] ? OL[number][VK] : OL[number];
        value?: OL extends Option[] ? OL[number][VK] : OL[number];
        renderLabel?: (op: OL[number][]) => JSX.Element;
        renderSelected?: (
          value: OL extends Option[] ? OL[number][VK] : OL[number]
        ) => JSX.Element;
        disabled?: OL[number];
        onChange?: React.Dispatch<
          React.SetStateAction<
            AN extends true ? OL[number] : OL[number] | undefined
          >
        >;
      }
  );
