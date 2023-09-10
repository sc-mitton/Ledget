import React, { useState } from 'react'

import { Listbox } from '@headlessui/react'
import { DropAnimation, SlimInputButton } from '@ledget/shared-ui'
import { ArrowIcon, CheckMark } from '@ledget/shared-assets'

const BakedSelect = ({ value, onChange, options, children }) => {
    const [sel, setSel] = useState(value)
    const setSelected = onChange || setSel
    const selected = value || sel

    const Check = () => (
        <div
            style={{
                marginLeft: '8px',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <CheckMark width={'.8em'} height={'.8em'} />
        </div>
    )

    const Arrow = () => (
        <div
            style={{
                marginLeft: '8px',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <ArrowIcon width={'.8em'} height={'.8em'} />
        </div>
    )

    return (
        <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
                <div className="baked-select--container">
                    <Listbox.Button as={React.Fragment}>
                        <SlimInputButton>
                            {children}
                            {selected ? <Check /> : <Arrow />}
                        </SlimInputButton>
                    </Listbox.Button>
                    <DropAnimation visible={open} className="dropdown" id="select--container">
                        <Listbox.Options static>
                            {options.map((option) => (
                                <Listbox.Option
                                    key={option}
                                    value={option}
                                    as={React.Fragment}
                                >
                                    {({ active, selected }) => (
                                        <div className={`dropdown-item
                                            ${active && "active"}
                                            ${selected && "selected"}`}
                                        >
                                            {option}
                                            {selected && <Check />}
                                        </div>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </DropAnimation>
                </div>
            )}
        </Listbox>
    )
}

export default BakedSelect
