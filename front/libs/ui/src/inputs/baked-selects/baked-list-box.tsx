import { useRef, useEffect, useState, useId, ComponentProps, forwardRef } from 'react'

import { Listbox } from '@headlessui/react'
import { Control, useController, UseControllerReturn } from 'react-hook-form'

import './baked-selects.scss'
import { DropAnimation } from '../../animations/animations'
import { InputButton } from '../../buttons/buttons'
import { ArrowIcon, CheckMark } from '@ledget/media'
import { DropdownItem } from "../../pieces/containers/containers"
import { LoadingRingDiv } from '../../pieces/loading-indicators/loading-indicators'

export interface BakedSelectProps {
  options?: readonly any[];
  name?: string;
  disabled?: any[]
  value?: string;
  onChange?: (val?: any) => void;
  labelKey?: string;
  subLabelKey?: string;
  valueKey?: string;
  labelPrefix?: string;
  subLabelPrefix?: string;
  placement?: ComponentProps<typeof DropAnimation>['placement']
  placeholder?: string;
  withCheckMarkIndicator?: boolean;
  as?: React.ElementType;
  style?: React.CSSProperties;
  control?: Control<any>;
  multiple?: boolean;
  maxLength?: number;
  buttonMaxWidth?: boolean;
  dividerKey?: string;
}

const useOptionalControl = (props: Pick<BakedSelectProps, 'control' | 'name'>): UseControllerReturn | { field: undefined } => {
  if (!props.control) return { field: undefined }
  return useController({
    name: props.name || 'baked-list-box',
    control: props.control,
  })
}

// export function BakedListBox(props: BakedListBoxProps) {
export const BakedListBox = forwardRef<HTMLButtonElement, BakedSelectProps>((props, ref) => {
  const id = useId()
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const [value, onChange] = useState<any>()

  // Controll for react-hook-form
  const { field } = useOptionalControl({
    name: props.name || `baked-list-box-${id}`,
    control: props.control,
  })

  // Update controller on value change
  useEffect(() => {
    field?.onChange(value)
  }, [value])

  return (
    <Listbox
      name={props.name}
      value={value}
      onChange={(val) => {
        onChange(val)
        if (props.onChange) props.onChange(val)
      }}
      as='div'
      className="baked-listbox--container"
      defaultValue={props.options?.find((op) => typeof op !== 'string' && op.default)}
      multiple={props.multiple}
    >
      {({ open }) => (
        <>
          <Listbox.Button
            ref={(el) => {
              buttonRef.current = el
              if (typeof ref === 'function') ref(el)
              else if (ref) ref.current = el
            }}
            as={props.as}
            style={props.style}
            className={`${props.as ? 'custom' : ''} ${open ? 'active' : ''}`}
          >
            {({ value: val }) => {
              let labels: string[] = []
              const isActive = Array.isArray(val) ? val.length : Boolean(val)

              for (const op of props.options || []) {
                const opValue = typeof op === 'string' ? op : op[props.valueKey || 'value']
                const valValue = typeof val === 'string' ? val : val[props.valueKey || 'value']

                if (Array.isArray(val) && val.includes(op) || valValue === opValue) {
                  if (typeof op === 'string') {
                    labels.push(op)
                  } else {
                    labels.push(op[props.labelKey || 'label'])
                  }
                }
              }
              const label = labels.join(', ')

              return (
                <div className={`${isActive ? 'active' : ''}`}>
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
            <DropAnimation
              placement={props.placement}
              visible={open}
              className="dropdown"
              style={{
                minWidth: `${buttonRef?.current?.offsetWidth}px`,
                maxWidth: props.buttonMaxWidth ? `${buttonRef?.current?.offsetWidth}px` : 'none',
              }}
            >
              {props.options?.length
                ?
                <Listbox.Options className="baked-list-options" static>
                  {props.options.map((op, index) => {
                    const isDisabled = props.disabled?.includes(op) || op.disabled
                    const label = typeof op === 'string' ? op : op[props.labelKey || 'label']

                    const hasDivider =
                      props.dividerKey &&
                      index > 0 &&
                      typeof op === 'object' &&
                      op[props.dividerKey || 'label'] !== props.options?.[index - 1][props.dividerKey || 'label']

                    return (
                      <>
                        <Listbox.Option
                          key={`${id}${index}`}
                          value={op}
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
            </DropAnimation>
          </div>
        </>
      )}
    </Listbox>
  )
})

BakedListBox.defaultProps = {
  withCheckMarkIndicator: false,
  as: InputButton,
  labelPrefix: '',
  labelKey: 'label',
  valueKey: 'value',
}

export default BakedListBox;
