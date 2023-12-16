import React, { useState, useEffect } from "react";

import { DropAnimation } from '../../animations/animations'
import { Combobox } from '@headlessui/react'
import { states as provences } from './provences-data'
import { TextInputWrapper } from "../text/text";
import { ArrowIcon } from '@ledget/media'
import { FormErrorTip } from '../../pieces/form-errors/form-errors'
import { DropdownItem } from "../../pieces/containers/containers"

export const SelectProvence = ({ field, errors }) => {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [provence, setProvence] = useState(null)
  const inputRef = React.useRef(null)

  const filterProvence =
    query === ''
      ? provences
      : provences.filter((provence) => {
        return provence.label.toLowerCase().includes(query.toLowerCase()) ||
          provence.abbreviation.toLowerCase().includes(query.toLowerCase())
      })

  useEffect(() => {
    field && field.onChange(provence?.value)
  }, [provence])

  return (
    <Combobox value={provence} onChange={setProvence}>
      {({ open }) => (
        <>
          <TextInputWrapper ref={inputRef}>
            <Combobox.Input
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(provence) => provence?.abbreviation}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              name="state"
              placeholder="State"
            />
            <Combobox.Button
              style={{
                opacity: (provence || focused) ? 1 : .5,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <ArrowIcon
                size={'.9em'}
                stroke={(focused && !provence) ? 'var(--input-focus)' : 'var(--m-text)'}
              />
            </Combobox.Button>
            {errors[field.name] && <FormErrorTip errors={{ type: 'required' }} />}
          </TextInputWrapper>
          <div className="provence-options--container">
            <DropAnimation
              placement="left"
              visible={open}
              className="provence-options"
              style={{ minWidth: `${inputRef.current?.offsetWidth}px` }}
            >
              <Combobox.Options static>
                {filterProvence.map((provence) => (
                  <Combobox.Option key={provence.value} value={provence} as={React.Fragment}>
                    {({ active, selected }) => (
                      <DropdownItem active={active} selected={selected} >
                        {provence.label}
                      </DropdownItem>
                    )}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </DropAnimation>
          </div>
        </>
      )}
    </Combobox>
  )
}
