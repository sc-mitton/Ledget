import { useRef, useEffect, useState, useId } from 'react';

import { Listbox } from '@headlessui/react';
import { useController, UseControllerReturn } from 'react-hook-form';
import { ChevronDown, Check, Plus } from '@geist-ui/icons';

import styles from './baked-selects.module.scss';
import { DropdownDiv } from '../../animations/dropdowndiv/dropdowndiv';
import { FormInputButton } from '../../buttons/styled-buttons';
import { DropdownItem } from '../../containers/specialty';
import { LoadingRingDiv } from '../../pieces/loading-indicators/loading-indicators';
import { FormErrorTip } from '../../pieces/form-errors/form-errors';
import type { BakedSelectProps, Option } from './types';

const useOptionalControl = (
  props: Pick<BakedSelectProps<any, any, any>, 'control' | 'name'>
): UseControllerReturn | { field: undefined } => {
  if (!props.control) return { field: undefined };
  return useController({
    name: props.name || 'baked-list-box',
    control: props.control,
  });
};

// export function BakedListBox(props: BakedListBoxProps) {
export const BakedListBox = <
  O extends Option[] | readonly string[] | string[],
  AN extends boolean = false,
  VK extends string = 'value'
>(
  props: BakedSelectProps<O, AN, VK>
) => {
  const id = useId();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [value, onChange] = useState<typeof props.defaultValue>(
    props.defaultValue
  );
  const [resetKey, setResetKey] = useState(
    Math.random().toString().slice(3, 10)
  );
  const [skipFieldReset, setSkipFieldReset] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setSkipFieldReset(false);
    }, 200);
    return clearTimeout(t);
  }, []);

  // Controll for react-hook-form
  const { field } = useOptionalControl({
    name: props.name || `baked-list-box-${id}`,
    control: props.control,
  });

  // Clear value if field reset from react-hook-form
  useEffect(() => {
    if (field && field.value === undefined && !skipFieldReset)
      onChange(undefined);
  }, [field?.value]);

  // Update field value if value changes
  // Also call props.onChange if it exists to keep parent state in sync
  useEffect(() => {
    field?.onChange(value);
    if (props.onChange) props.onChange(value as any);
  }, [value]);

  useEffect(() => {
    if (Array.isArray(value) && value.length === 0) {
      onChange(undefined);
    }
  }, [value]);

  const handleChange = (val: typeof props.defaultValue) => {
    if (props.multiple || val !== value) {
      onChange(val);
    } else if (!props.allowNoneSelected) {
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
                    : labels.push(op[props.labelKey || 'label'] || '');
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
                    {value && props.renderSelected ? (
                      props.renderSelected(value as any)
                    ) : (
                      <span>{`${props.labelPrefix + ' '}${label}`}</span>
                    )}
                    {props.renderSelected ? (
                      value ? null : (
                        <ChevronDown size={'1.25em'} />
                      )
                    ) : (
                      <ChevronDown size={'1.25em'} />
                    )}
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
                    (typeof op === 'string'
                      ? op
                      : op[props.labelKey || 'label']) || '';
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
                              {props.renderLabel ? (
                                props.renderLabel(label, active, selected)
                              ) : (
                                <>
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
                                    color={
                                      selected ? 'curentColor' : 'transparent'
                                    }
                                  />
                                </>
                              )}
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
