import { useRef, useEffect, useState, useId, ComponentProps, ComponentPropsWithoutRef } from 'react'

import { Listbox } from '@headlessui/react'
import { Control, useController, UseControllerReturn, FieldError } from 'react-hook-form'
import { ChevronDown, Check } from '@geist-ui/icons'

import './baked-selects.scss'
import { DropDownDiv } from '../../animations/animations'
import { InputButton } from '../../buttons/buttons'
import { DropdownItem } from "../../pieces/containers/containers"
import { LoadingRingDiv } from '../../pieces/loading-indicators/loading-indicators'
import { FormErrorTip } from '../../pieces/form-errors/form-errors'

export interface BakedSelectPropsBase<O> {
  name?: string
  options?: O[]
  labelKey?: string
  subLabelKey?: string
  valueKey?: string
  labelPrefix?: string
  subLabelPrefix?: string
  placement?: ComponentProps<typeof DropDownDiv>['placement']
  placeholder?: string
  withCheckMarkIndicator?: boolean
  as?: React.FC<ComponentPropsWithoutRef<'button'>>
  error?: FieldError
  style?: React.CSSProperties
  dropdownStyle?: React.CSSProperties
  control?: Control<any>
  maxLength?: number
  buttonMaxWidth?: boolean
  dividerKey?: string
  showLabel?: boolean
}

interface BakedSelectProps1<TVal> {
  multiple?: true
  value?: TVal[]
  defaultValue?: TVal[]
  disabled?: TVal[]
  onChange?: React.Dispatch<React.SetStateAction<TVal[] | undefined>>
}

interface BakedSelectProps2<TVal> {
  multiple?: false
  value?: TVal
  defaultValue?: TVal
  disabled?: TVal | TVal[]
  onChange?: React.Dispatch<React.SetStateAction<TVal | undefined>>
}

export type Option = {
  label?: string
  value?: string | { [key: string]: any }
  default?: boolean
  disabled?: boolean
  [key: string]: any
}

export type BakedSelectProps<Val extends Option['value']> = (BakedSelectProps1<Val> | BakedSelectProps2<Val>)
  & BakedSelectPropsBase<Val extends string ? string | Option : Option>

const useOptionalControl = (props: Pick<BakedSelectProps<any>, 'control' | 'name'>): UseControllerReturn | { field: undefined } => {
  if (!props.control) return { field: undefined }
  return useController({
    name: props.name || 'baked-list-box',
    control: props.control,
  })
}

// export function BakedListBox(props: BakedListBoxProps) {
export const BakedListBox = <O extends Option | string>(props: BakedSelectProps<O>) => {
  const id = useId()
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const [value, onChange] = useState<typeof props.defaultValue>()

  // Controll for react-hook-form
  const { field } = useOptionalControl({
    name: props.name || `baked-list-box-${id}`,
    control: props.control,
  })

  // Clear value if field reset from react-hook-form
  useEffect(() => {
    if (field?.value === undefined) onChange(undefined)
  }, [field?.value])

  // Update field value if value changes
  // Also call props.onChange if it exists to keep parent state in sync
  useEffect(() => {
    if (value) field?.onChange(value)
    if (props.onChange && value) props.onChange(value as any)
  }, [value])

  useEffect(() => {
    if (!value) {
      const defaultOp = props.options?.find((op) => {
        return typeof op !== 'string' ? op.default : false
      })
      onChange(
        props.defaultValue
          ? props.defaultValue
          : typeof defaultOp === 'string'
            ? defaultOp
            : defaultOp?.[props.valueKey || 'value']
      )
    }
  }, [props.options])

  return (
    <Listbox
      name={props.name}
      value={value}
      onChange={onChange}
      as='div'
      className="baked-listbox--container"
      multiple={props.multiple}
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
              let labels: string[] = []
              const isActive = Array.isArray(val) ? val.length : Boolean(val)

              for (const op of props.options || []) {
                const opValue = typeof op === 'string' ? op : op[props.valueKey || 'value']
                const valValue = typeof val === 'string'
                  ? val
                  : val?.[props.valueKey || 'value']

                if (props.multiple && val.includes(opValue) || valValue === opValue) {
                  typeof op === 'string'
                    ? labels.push(op)
                    : labels.push(op[props.labelKey || 'label'])
                }
              }
              const label = labels?.length && props.showLabel
                ? labels.join(', ')
                : props.placeholder || 'Select'

              return (
                <>
                  <div className={`${(isActive
                    ? props.showLabel ? 'active' : 'semi-active'
                    : ''
                  )} baked-listbox--button`}>
                    <span>{`${props.labelPrefix + ' '}${label}`}</span>
                    {val
                      ? props.withCheckMarkIndicator
                        ? <Check size={'1.25em'} />
                        : <ChevronDown size={'1.25em'} />
                      : <ChevronDown size={'1.25em'} />}
                  </div>
                  <FormErrorTip error={props.error} />
                </>
              )
            }}
          </Listbox.Button>
          <div>
            <DropDownDiv
              className='dropdown-div'
              placement={props.placement}
              visible={open}
              style={{
                minWidth: `${buttonRef?.current?.offsetWidth}px`,
                maxWidth: props.buttonMaxWidth ? `${buttonRef?.current?.offsetWidth}px` : 'none',
                ...props.dropdownStyle,
              }}
            >
              {props.options?.length
                ?
                <Listbox.Options className="baked-list-options" static>
                  {props.options.map((op, index) => {
                    const isDisabled = typeof op === 'string'
                      ? props.disabled?.includes(op)
                      : props.disabled?.includes(op[props.valueKey || 'value']) || op.disabled
                    const label = typeof op === 'string'
                      ? op
                      : op[props.labelKey || 'label']
                    const value =
                      typeof op !== 'string'
                        ? op[props.valueKey || 'value']
                        : op

                    const hasDivider =
                      props.dividerKey &&
                      typeof op === 'object' && index !== 0 &&
                      op[props.dividerKey] !== (props.options as any)[index - 1]?.[props.dividerKey]

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
                                className="baked-dropdown-item"
                              >
                                <span>
                                  {label.slice(0, props.maxLength)}
                                  {`${(props.maxLength || label.length) < label.length ? '...' : ''}`}
                                </span>
                                {props.subLabelKey &&
                                  <span className='sub-label'>
                                    {typeof op !== 'string' && `${props.subLabelPrefix + ' '}${op[props.subLabelKey]}`}
                                  </span>}
                              </DropdownItem>
                            )
                          }
                          }
                        </Listbox.Option>
                      </>
                    )
                  })}
                </Listbox.Options>
                : <div className='baked-select-loading'>
                  <LoadingRingDiv loading={true} />
                </div>
              }
            </DropDownDiv>
          </div>
        </>
      )}
    </Listbox>
  )
}

BakedListBox.defaultProps = {
  withCheckMarkIndicator: false,
  showLabel: true,
  as: InputButton,
  labelPrefix: '',
  labelKey: 'label',
  valueKey: 'value',
}

export default BakedListBox;
