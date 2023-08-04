import React, { useState, useRef, useEffect } from 'react'


import './styles/Dropdowns.css'
import Plus from '@assets/icons/Plus'
import Return from '@assets/icons/Return'
import Checkmark from '@assets/icons/Checkmark'
import { MenuTextInput } from '@components/inputs'
import { DropAnimation } from '@utils'
import ComboSelect from './ComboSelect'

const formatDollar = (value, percentage) => {
    !percentage && (percentage = 0)

    let dollar = parseInt(value.replace(/[^0-9.]/g, '')) * percentage / 100
    dollar = dollar
        .toFixed(0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    return `$${dollar}`
}

const AddAlert = ({ limit }) => {
    const [selectedAlerts, setSelectedAlerts] = useState([])
    const [alertOptions, setAlertOptions] = useState([
        { id: 1, value: 25, disabled: false },
        { id: 2, value: 50, disabled: false },
        { id: 3, value: 75, disabled: false },
        { id: 4, value: 100, disabled: false },
    ])

    const Option = ({ value, active, selected }) => (
        <div className={`slct-item ${active && "a-slct-item"} ${selected && "s-slct-item"}`}>
            <div>{value}%</div>
            <div>
                <span className={`${active ? 'active' : ''}`}>
                    {limit
                        ? `(${formatDollar(limit, value)})`
                        : ('of limit')
                    }
                </span>
                <Checkmark
                    stroke={`${selected ? 'var(--green-dark)' : 'transparent'}`}
                />
            </div>
        </div>
    )

    const CustomOption = () => {
        const ref = useRef('')
        const [pct, setPct] = useState('')

        const handleChange = (e) => {
            const newValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 2)
            setPct(`${newValue}%`)
        }

        useEffect(() => {
            ref.current.selectionEnd = pct.indexOf('%')
            ref.current.selectionStart = pct.indexOf('%')
        }, [pct])

        const handleFocus = () => {
            ref.current.selectionEnd = pct.indexOf('%')
            ref.current.selectionStart = pct.indexOf('%')
        }

        const DollarFormat = ({ value, ...rest }) => {
            return (
                <span {...rest}>
                    &#40;{formatDollar(limit, value)}&#41;
                </span>
            )
        }

        const handleKeyDown = (e) => {
            if (pct.length > 2 && e.key !== 'Backspace') {
                e.preventDefault()
            }
        }

        const getValue = () => {
            return {
                id: alertOptions.length + 1,
                value: parseInt(pct.replace(/[^0-9]/g, ''), 10),
                disabled: false
            }
        }

        return (
            <div className='slct-item custom-input'>
                <MenuTextInput>
                    <ComboSelect.Custom
                        ref={ref}
                        placeholder="Custom..."
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        getValue={() => getValue()}
                        onFocus={() => handleFocus()}
                        onBlur={() => { setPct('') }}
                        value={pct}
                        size="7"
                    >
                        {({ focused }) => (
                            <>
                                {limit &&
                                    <DollarFormat
                                        value={parseInt(pct.replace(/[^0-9]/g, ''), 10)}
                                        style={{
                                            opacity: focused ? ".5" : "0",
                                            marginRight: '8px'
                                        }}
                                    />}
                                <div
                                    id={`return-btn${focused ? '-focused' : ''}`}
                                    role="button"
                                    aria-label="Add custom alert"
                                >
                                    <Return
                                        width={'.6em'}
                                        height={'.6em'}
                                        stroke={"var(--white-text)"}
                                    />
                                </div>
                            </>
                        )}
                    </ComboSelect.Custom>
                </MenuTextInput>
            </div>
        )
    }

    const Options = () => (
        alertOptions.map((option) => (
            <ComboSelect.Option
                value={option.value}
                disabled={option.disabled}
                key={option.id}
            >
                {({ active, selected }) => (
                    <Option
                        value={option.value}
                        active={active}
                        selected={selected}
                    />
                )}
            </ComboSelect.Option>
        ))
    )

    return (
        <ComboSelect
            name="alert"
            value={selectedAlerts}
            onChange={setSelectedAlerts}
            setSelections={setAlertOptions}
            multiple
        >
            {({ open }) => (
                <>
                    <ComboSelect.Button className="btn-chcl btn-2slim" id="add-alert-btn">
                        Spending Alert
                        {selectedAlerts.length > 0
                            ?
                            <Checkmark
                                stroke={'var(--white-text)'}
                                width={'.7em'}
                                height={'.7em'}
                            /> :
                            <Plus
                                stroke={'var(--white-text)'}
                                strokeWidth={'20'}
                                width={'.8em'}
                                height={'.8em'}
                            />}
                    </ComboSelect.Button>
                    <ComboSelect.Options
                        className="select-container"
                        static
                    >
                        <DropAnimation
                            className="dropdown select"
                            visible={open}
                        >
                            <Options />
                            <CustomOption />
                        </DropAnimation>
                    </ComboSelect.Options>
                </>
            )}
        </ComboSelect>
    )
}

export default AddAlert
