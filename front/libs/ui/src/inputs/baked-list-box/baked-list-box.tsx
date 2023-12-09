import { useState, useEffect, useRef, useId, ComponentProps, forwardRef } from 'react';

import { Listbox } from '@headlessui/react';

import './baked-list-box.scss';
import { DropAnimation } from '../../animations/animations';
import { InputButton } from '../../buttons/buttons';
import { ArrowIcon, CheckMark } from '@ledget/media';
import { DropdownItem } from "../../pieces/containers/containers";
import { LoadingRingDiv } from '../../pieces/loading-indicators/loading-indicators';

export interface BakedListBoxProps {
  // options?: ReadOnlyArray<string>;
  options?: readonly any[];
  name?: string;
  disabled?: any[]
  value?: string;
  onChange?: (val?: any) => void;
  labelPrefix?: string;
  placement?: ComponentProps<typeof DropAnimation>['placement']
  placeholder?: string;
  withCheckMarkIndicator?: boolean;
  as?: React.ElementType;
  style?: React.CSSProperties;
}

// export function BakedListBox(props: BakedListBoxProps) {
export const BakedListBox = forwardRef<HTMLButtonElement, BakedListBoxProps>((props, ref) => {
  const id = useId()
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Listbox
      name={props.name}
      as='div'
      className="baked-listbox--container"
      defaultValue={props.options?.find((op) => typeof op === 'object' && op.default)?.value}
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
              const label = props.options?.find((op) => typeof op === 'object' && op.value === val)?.label

              return (
                <div className={`${val ? 'active' : ''}`}>
                  <span>
                    {val ? `${props.labelPrefix + ' '}${label}` : props.placeholder}
                  </span>
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
              style={{ minWidth: `${buttonRef?.current?.offsetWidth}px` }}
            >
              {props.options?.length
                ?
                <Listbox.Options className="baked-list-options">
                  {props.options.map((op, index) => (
                    <Listbox.Option
                      key={`${id}${index}`}
                      value={typeof op === 'object' ? op.value : op}
                      disabled={typeof op === 'object' ? op.disabled : false}
                    >
                      {({ active, selected }) => (
                        <DropdownItem active={active} selected={selected}>
                          <span>
                            {typeof props.options === 'object'
                              ? `${op.label}`
                              : `${op}`
                            }
                          </span>
                        </DropdownItem>
                      )}
                    </Listbox.Option>
                  ))}
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
}

export default BakedListBox;
