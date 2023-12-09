import { useRef, useEffect, useState, useId, ComponentProps, forwardRef } from 'react';

import { Combobox } from '@headlessui/react';
import { useController } from 'react-hook-form';
import { BakedSelectProps } from './baked-list-box';

import './baked-selects.scss';
import { DropAnimation } from '../../animations/animations';
import { TextInputWrapper } from '../text/text';
import { ArrowIcon } from '@ledget/media';
import { DropdownItem } from "../../pieces/containers/containers";
import { LoadingRingDiv } from '../../pieces/loading-indicators/loading-indicators';


export const BakedComboBox = (props: Omit<BakedSelectProps, 'as'> & { WrapperComponent: React.ElementType }) => {
  const id = useId()
  const [value, onChange] = useState<any>()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [focused, setFocused] = useState(false)
  const [query, setQuery] = useState('')
  const [filterOptions, setFilterOptions] = useState<any[]>()

  // Controll for react-hook-form
  const { field } = useController({
    name: props.name || `baked-combo-box-${id}`,
    control: props.control,
  })

  // Update controller on value change
  useEffect(() => {
    field.onChange(value)
  }, [value])

  useEffect(() => {
    setFilterOptions(
      props.options?.filter((op) => {
        const label = typeof op === 'string' ? op : op[props.labelKey || 'label']
        return label.toLowerCase().includes(query.toLowerCase())
      })
    )
  }, [query, props.options])

  return (
    <Combobox
      name={props.name}
      value={value}
      onChange={(val) => {
        onChange(val)
        if (props.onChange) props.onChange(val)
      }}
      as='div'
      className="baked-listbox--container"
      defaultValue={props.options?.find((op) => typeof op !== 'string' && op.default)?.value}
      multiple={props.multiple as any}
    >
      {({ open }) => (
        <>
          <props.WrapperComponent ref={inputRef} className="baked-combo-list-wrapper">
            <Combobox.Input
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              name={props.name || `baked-combo-box-${id}`}
              placeholder={props.placeholder || 'Search'}
            />
            <Combobox.Button
              style={{
                opacity: (value || focused) ? 1 : .5,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <ArrowIcon
                size={'.8em'}
                stroke={(focused && !value) ? 'var(--input-focus)' : 'var(--m-text)'}
              />
            </Combobox.Button>
          </props.WrapperComponent>
          <div className="provence-options--container">
            <DropAnimation
              placement="left"
              visible={open}
              className="dropdown"
              style={{
                minWidth: `${inputRef?.current?.offsetWidth}px`,
                maxWidth: props.buttonMaxWidth ? `${inputRef?.current?.offsetWidth}px` : 'none',
              }}
            >
              {props.options?.length
                ?
                <Combobox.Options className="baked-list-options" static>
                  {filterOptions?.map((op, index) => {
                    const isDisabled = props.disabled?.includes(op) || op.disabled
                    const value = typeof op === 'string' ? op : op[props.valueKey || 'value']
                    const label = typeof op === 'string' ? op : op[props.labelKey || 'label']
                    const hasDivider =
                      props.dividerKey &&
                      index > 0 &&
                      typeof op === 'object' &&
                      op[props.dividerKey || 'label'] !== props.options?.[index - 1][props.dividerKey || 'label']

                    return (
                      <>
                        <Combobox.Option
                          key={`${id}${index}`}
                          value={value}
                          disabled={isDisabled}
                        >
                          {({ active, selected }) => (
                            <DropdownItem active={active} selected={selected}>
                              <span>
                                {label.slice(0, props.maxLength)}
                                {`${(props.maxLength || label.length) < label.length ? '...' : ''}`}
                              </span>
                            </DropdownItem>
                          )}
                        </Combobox.Option>
                        {hasDivider && <hr />}
                      </>
                    )
                  })}
                </Combobox.Options>
                : <div className='baked-select-loading'>
                  <LoadingRingDiv loading={true} />
                </div>
              }
            </DropAnimation>
          </div>
        </>
      )}
    </Combobox>
  )
}

BakedComboBox.defaultProps = {
  withCheckMarkIndicator: false,
  WrapperComponent: TextInputWrapper,
  labelPrefix: '',
  labelKey: 'label',
  valueKey: 'value',
}

export default BakedComboBox;
