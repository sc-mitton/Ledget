import { useRef, useEffect, useState, useId, ComponentProps, FC } from 'react';

import { Listbox } from '@headlessui/react';
import {
  Control,
  useController,
  UseControllerReturn,
  FieldError,
} from 'react-hook-form';
import { ChevronDown, Check } from '@geist-ui/icons';

import styles from './baked-selects.module.scss';
import { DropdownDiv } from '../../animations/dropdowndiv/dropdowndiv';
import { FormInputButton } from '../../buttons/styled-buttons';
import { DropdownItem } from '../../containers/specialty';
import { LoadingRingDiv } from '../../pieces/loading-indicators/loading-indicators';
import { FormErrorTip } from '../../pieces/form-errors/form-errors';

export interface BakedSelectPropsBase<O> {
  name?: string;
  options?: O[];
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

interface BakedSelectProps1<TVal> {
  multiple?: true;
  value?: TVal[];
  defaultValue?: TVal[];
  disabled?: TVal[];
  onChange?: React.Dispatch<React.SetStateAction<TVal | undefined>>;
}

interface BakedSelectProps2<TVal> {
  multiple?: false;
  value?: TVal;
  defaultValue?: TVal;
  disabled?: TVal | TVal[];
  onChange?: React.Dispatch<React.SetStateAction<TVal | undefined>>;
}

export type Option = {
  label?: string;
  value?: string | { [key: string]: any };
  default?: boolean;
  disabled?: boolean;
  [key: string]: any;
};

export type BakedSelectProps<Val extends Option['value']> = (
  | BakedSelectProps1<Val>
  | BakedSelectProps2<Val>
) &
  BakedSelectPropsBase<Val extends string ? string | Option : Option>;

const useOptionalControl = (
  props: Pick<BakedSelectProps<any>, 'control' | 'name'>
): UseControllerReturn | { field: undefined } => {
  if (!props.control) return { field: undefined };
  return useController({
    name: props.name || 'baked-list-box',
    control: props.control,
  });
};

// export function BakedListBox(props: BakedListBoxProps) {
export const BakedListBox = <O extends Option | string>(
  props: BakedSelectProps<O>
) => {
  const id = useId();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [value, onChange] = useState<typeof props.defaultValue>();
  const [resetKey, setResetKey] = useState(
    Math.random().toString().slice(3, 10)
  );

  // Controll for react-hook-form
  const { field } = useOptionalControl({
    name: props.name || `baked-list-box-${id}`,
    control: props.control,
  });

  // Clear value if field reset from react-hook-form
  useEffect(() => {
    if (field?.value === undefined) onChange(undefined);
  }, [field?.value]);

  // Update field value if value changes
  // Also call props.onChange if it exists to keep parent state in sync
  useEffect(() => {
    field?.onChange(value);
    if (props.onChange) props.onChange(value as any);
  }, [value]);

  // Set default value if any
  useEffect(() => {
    if (!value) {
      const defaultOp = props.options?.find((op) => {
        return typeof op !== 'string' ? op.default : false;
      });
      onChange(
        props.defaultValue
          ? Array.isArray(props.defaultValue)
            ? props.defaultValue.map((op) =>
                typeof op === 'string' ? op : op[props.valueKey || 'value']
              )
            : typeof props.defaultValue === 'string'
            ? props.defaultValue
            : props.defaultValue[props.valueKey || 'value']
          : typeof defaultOp === 'string'
          ? defaultOp
          : defaultOp?.[props.valueKey || 'value']
      );
    }
  }, [props.options]);

  const handleChange = (val: typeof props.defaultValue) => {
    if (props.multiple || val !== value) {
      onChange(val);
    } else {
      setResetKey(Math.random().toString().slice(3, 10));
      onChange(undefined);
    }
  };

  return (
    <Listbox
      name={props.name}
      value={value}
      onChange={handleChange}
      as="div"
      className={styles.bakedListBoxContainer}
      multiple={props.multiple}
      key={resetKey}
    >
      {({ open }) => (
        <>
          <Listbox.Button
            ref={buttonRef}
            as={props.as}
            style={props.style}
            className={`${props.as ? 'custom' : ''} ${open ? 'active' : ''}`}
          >
            {({ value: val }) => {
              let labels: string[] = [];
              const isActive = Array.isArray(val) ? val.length : Boolean(val);

              for (const op of props.options || []) {
                const opValue =
                  typeof op === 'string' ? op : op[props.valueKey || 'value'];
                const valValue =
                  typeof val === 'string'
                    ? val
                    : val?.[props.valueKey || 'value'];

                if (
                  (props.multiple && val.includes(opValue)) ||
                  valValue === opValue
                ) {
                  typeof op === 'string'
                    ? labels.push(op)
                    : labels.push(op[props.labelKey || 'label']);
                }
              }
              const label =
                labels?.length && props.showLabel
                  ? labels.join(', ')
                  : props.placeholder || 'Select';

              return (
                <>
                  <div
                    className={styles.buttonContainer}
                    data-filled={Boolean(value)}
                  >
                    <span>{`${props.labelPrefix + ' '}${label}`}</span>
                    {val && props.withCheckMarkIndicator && (
                      <Check size={'1.25em'} />
                    )}
                    {(!val || !props.withCheckMarkIndicator) &&
                      props.withChevron && <ChevronDown size={'1.25em'} />}
                  </div>
                  <FormErrorTip error={props.error} />
                </>
              );
            }}
          </Listbox.Button>
          <DropdownDiv
            className={styles.dropdown}
            placement={props.placement}
            visible={open}
            style={{
              minWidth: `${buttonRef?.current?.offsetWidth}px`,
              maxWidth: props.buttonMaxWidth
                ? `${buttonRef?.current?.offsetWidth}px`
                : 'none',
              ...props.dropdownStyle,
            }}
          >
            {props.options?.length ? (
              <Listbox.Options className={styles.bakedListOptions} static>
                {props.options.map((op, index) => {
                  const isDisabled =
                    typeof op === 'string'
                      ? props.disabled?.includes(op)
                      : props.disabled?.includes(
                          op[props.valueKey || 'value']
                        ) || op.disabled;
                  const label =
                    typeof op === 'string' ? op : op[props.labelKey || 'label'];
                  const value =
                    typeof op !== 'string' ? op[props.valueKey || 'value'] : op;

                  const hasDivider =
                    props.dividerKey &&
                    typeof op === 'object' &&
                    index !== 0 &&
                    op[props.dividerKey] !==
                      (props.options as any)[index - 1]?.[props.dividerKey];

                  return (
                    <>
                      {hasDivider && <hr />}
                      <Listbox.Option
                        key={`${id}${index}`}
                        value={value}
                        disabled={isDisabled}
                      >
                        {({ active, selected }) => {
                          return (
                            <DropdownItem
                              active={active}
                              selected={selected}
                              className={styles.bakedDropdownItem}
                            >
                              <span>
                                {label.slice(0, props.maxLength)}
                                {`${
                                  (props.maxLength || label.length) <
                                  label.length
                                    ? '...'
                                    : ''
                                }`}
                              </span>
                              {props.subLabelKey && (
                                <span className={styles.subLabel}>
                                  {typeof op !== 'string' &&
                                    `${props.subLabelPrefix + ' '}${
                                      op[props.subLabelKey]
                                    }`}
                                </span>
                              )}
                              <Check
                                className="icon"
                                color={selected ? 'curentColor' : 'transparent'}
                              />
                            </DropdownItem>
                          );
                        }}
                      </Listbox.Option>
                    </>
                  );
                })}
              </Listbox.Options>
            ) : (
              <div className={styles.bakedSelectLoading}>
                <LoadingRingDiv loading={true} />
              </div>
            )}
          </DropdownDiv>
        </>
      )}
    </Listbox>
  );
};

BakedListBox.defaultProps = {
  withCheckMarkIndicator: false,
  showLabel: true,
  as: FormInputButton,
  labelPrefix: '',
  labelKey: 'label',
  valueKey: 'value',
  withChevron: true,
};

export default BakedListBox;
