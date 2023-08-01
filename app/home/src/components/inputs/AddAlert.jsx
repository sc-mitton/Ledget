import React, { useState, useRef, useEffect } from 'react'


import './styles/AddAlert.css'
import Plus from '@assets/icons/Plus'
import Return from '@assets/icons/Return'
import Checkmark from '@assets/icons/Checkmark'
import { MenuTextInput } from '@components/inputs'
import { DropAnimation } from '@utils'
import ComboSelect from './ComboSelect'

const formatDollar = (value, percentage) => {
    !percentage && (percentage = 0)

    let dollar = parseInt(value.replace(/[^0-9.]/g, '')) * percentage / 100
    dollar = dollar.toFixed(0)
    // convert to string and add commas
    dollar = dollar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return `$${dollar}`
}

const AddAlert = ({ defaultOptions, limit }) => {
    const [selectedAlerts, setSelectedAlerts] = useState([])
    const [alertOptions, setAlertOptions] = useState(defaultOptions)

    const Option = ({ value, active, selected }) => {
        return (
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
    }

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

        return (
            <div className='slct-item custom-input'>
                <MenuTextInput>
                    <ComboSelect.Custom
                        ref={ref}
                        placeholder="Custom..."
                        onChange={handleChange}
                        onKeyDown={(e) => {
                            if (pct.length > 2 && e.key !== 'Backspace') {
                                e.preventDefault()
                            }
                        }}
                        getValue={() => {
                            return ({
                                id: alertOptions.length + 1,
                                value: parseInt(pct.replace(/[^0-9]/g, ''), 10),
                                disabled: false
                            })
                        }}
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
                                    className="btn btn-chcl"
                                    role="button"
                                    aria-label="Add custom alert"
                                    style={{
                                        opacity: focused ? ".5" : "0",
                                        borderRadius: '6px',
                                        padding: '2px',
                                        margin: '2px'
                                    }}
                                >
                                    <Return width={'.6em'} height={'.6em'} stroke={"var(--white-text)"} />
                                </div>
                            </>
                        )}
                    </ComboSelect.Custom>
                </MenuTextInput>
            </div>
        )
    }

    const Options = () => {
        return (
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
    }

    return (
        <div id="alert-select">
            <ComboSelect
                name="alerts"
                value={selectedAlerts}
                onChange={setSelectedAlerts}
                addSelection={setAlertOptions}
                multiple
            >
                {({ open }) => (
                    <>
                        <ComboSelect.Button className="btn-gr btn3" id="add-alert-btn">
                            Spending Alert
                            <Plus
                                strokeWidth={'20'}
                                width={'.8em'}
                                height={'.8em'}
                            />
                        </ComboSelect.Button>
                        <DropAnimation visible={open} >
                            <ComboSelect.Options style={{ position: 'absolute' }} static>
                                <div className="dropdown" >
                                    <Options />
                                    <CustomOption />
                                </div>
                            </ComboSelect.Options>
                        </DropAnimation>
                    </>
                )}
            </ComboSelect>
        </div>
    )
}

export default AddAlert
