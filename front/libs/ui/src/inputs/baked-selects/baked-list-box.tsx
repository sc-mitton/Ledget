import { useRef, useEffect, useState, useId, ComponentProps, forwardRef } from 'react'

import { Listbox } from '@headlessui/react'
import { Control, useController, UseControllerReturn } from 'react-hook-form'

import './baked-selects.scss'
import { DropDownDiv } from '../../animations/animations'
import { InputButton } from '../../buttons/buttons'
import { ArrowIcon, CheckMark } from '@ledget/media'
import { DropdownItem } from "../../pieces/containers/containers"
import { LoadingRingDiv } from '../../pieces/loading-indicators/loading-indicators'

export interface BakedSelectPropsBase<T> {
  name?: string
  options?: T[]
  labelKey?: string
  subLabelKey?: string
  valueKey?: string
  labelPrefix?: string
  subLabelPrefix?: string
  placement?: ComponentProps<typeof DropDownDiv>['placement']
  placeholder?: string
  withCheckMarkIndicator?: boolean
  as?: React.ElementType
  style?: React.CSSProperties
  control?: Control<any>
  maxLength?: number
  buttonMaxWidth?: boolean
  dividerKey?: string
  showLabel?: boolean
}

interface BakedSelectProps1<T> extends BakedSelectPropsBase<T> {
  multiple?: true
  value?: T[]
  defaultValue?: T[]
  disabled?: T[]
  onChange?: (val: T[]) => void
}

interface BakedSelectProps2<T> extends BakedSelectPropsBase<T> {
  multiple?: false
  value?: T
  defaultValue?: T
  disabled?: T | T[]
  onChange?: (val: T) => void
}

export type BakedSelectProps<T> = BakedSelectProps1<T> | BakedSelectProps2<T>

export type Option = {
  label?: string
  value?: string
  default?: boolean
  disabled?: boolean
  [key: string]: any
}

const useOptionalControl = (props: Pick<BakedSelectProps<any>, 'control' | 'name'>): UseControllerReturn | { field: undefined } => {
  if (!props.control) return { field: undefined }
  return useController({
    name: props.name || 'baked-list-box',
    control: props.control,
  })
}

// export function BakedListBox(props: BakedListBoxProps) {
export const BakedListBox = <T extends Option | string>(props: BakedSelectProps<T>) => {
  const id = useId()
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const [value, onChange] = useState<any>()

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
  useEffect(() => {
    if (field?.value !== value) field?.onChange(value)
  }, [value])

  // Set initial default value
  useEffect(() => {
    const defaultValue = props.options?.find((op) => typeof op !== 'string' && op.default)

    onChange(
      typeof defaultValue === 'string'
        ? defaultValue
        : defaultValue?.[props.valueKey || 'value'])
  }, [])

  useEffect(() => {
    if (!value) {
      const defaultOp = props.options?.find((op) => {
        return typeof op !== 'string'
          ? op.default
          : false
      })
      onChange(
        typeof defaultOp === 'string'
          ? defaultOp
          : defaultOp?.[props.valueKey || 'value'])
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
                <div className={`${(isActive
                  ? props.showLabel ? 'active' : 'semi-active'
                  : ''
                )} baked-listbox--button`}>
                  <span>{`${props.labelPrefix + ' '}${label}`}</span>
                  {val
                    ? props.withCheckMarkIndicator
                      ? <CheckMark size={'.8em'} stroke={'currentColor'} />
                      : <ArrowIcon size={'.8em'} stroke={'currentColor'} />
                    : <ArrowIcon size={'.8em'} stroke={'currentColor'} />}
                </div>
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
                ...props.style,
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
                      typeof op === 'object' &&
                      op[props.dividerKey] !== (props.options as any)[index - 1]?.[props.dividerKey]

                    return (
                      <>
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
                        {hasDivider && <hr />}
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
