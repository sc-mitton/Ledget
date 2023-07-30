import React, { useState, useRef, useEffect } from 'react'

import { Listbox } from '@headlessui/react'

import './styles/AddAlert.css'
import Plus from '@assets/icons/Plus'
import Checkmark from '@assets/icons/Checkmark'
import { MenuTextInput } from '@components/inputs'
import { DropAnimation } from '@utils'


const defaultAlertOptions = [
    { id: 1, value: 25, disabled: false },
    { id: 2, value: 50, disabled: false },
    { id: 3, value: 75, disabled: false },
    { id: 4, value: 100, disabled: false },
]

const formatDollar = (value, percentage) => {
    let dollar = parseInt(value.replace(/[^0-9.]/g, '')) * percentage / 100
    dollar = dollar.toFixed(0)
    // convert to string and add commas
    dollar = dollar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return `$${dollar}`
}

const AddAlert = ({ limit }) => {
    const [selectedAlerts, setSelectedAlerts] = useState([defaultAlertOptions[0]])
    const [alertOptions, setAlertOptions] = useState(defaultAlertOptions)
    const customInputRef = useRef(null)

    const CustomOption = () => {
        const [value, setValue] = useState('')
        const addRef = useRef(null)

        const handleChange = (e) => {
            // only allow numbers and make sure it's only a 2 digit number
            const newValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 2)
            setValue(`${newValue}%`)
        }

        useEffect(() => {
            customInputRef.current.selectionEnd = value.indexOf('%')
            customInputRef.current.selectionStart = value.indexOf('%')
        }, [value, customInputRef.current?.selectionEnd, customInputRef.current?.selectionStart])

        const handleClick = (e) => {
            console.log(e)
        }

        return (
            <li key='custom'>
                <div className='slct-item custom-input'>
                    <MenuTextInput>
                        <input
                            type="text"
                            name="custom"
                            placeholder='Custom...'
                            onFocus={() => setValue('%')}
                            onBlur={() => !value && setPlaceholder('Custom...')}
                            value={value}
                            onChange={handleChange}
                            size='10'
                            ref={customInputRef}
                            onKeyDown={(e) => {
                                e.key === 'Enter' && handleClick(e)
                                e.key === 'Escape' && setValue('') && customInputRef.current.blur()
                                e.key === 'Tab' && addRef.current.focus()
                            }}
                        />
                        {value &&
                            <button
                                className="btn-gr"
                                onClick={handleClick}
                                ref={addRef}
                                onKeyDown={(e) =>
                                    e.shiftKey && e.key === 'Tab'
                                    && customInputRef.current.focus()
                                }
                            >
                                <Plus width={'.8em'} height={'.8em'} />
                            </button>
                        }
                    </MenuTextInput>
                </div>
            </li>
        )
    }

    const Options = () => {
        return (
            alertOptions.map((option) => (
                <Listbox.Option key={option.id} value={option.value} disabled={option.disabled}>
                    {({ active, selected }) => (
                        <div className={`slct-item ${active && "a-slct-item"} ${selected && "s-slct-item"}`}>
                            <div>
                                {option.value}%&nbsp;&nbsp;
                                <span className={`${active ? 'active' : ''}`}>
                                    {limit
                                        ? `(${formatDollar(limit, option.value)})`
                                        : ('of limit')
                                    }
                                </span>
                            </div>
                            <div>
                                <Checkmark
                                    stroke={`${selected ? 'var(--green-dark)' : 'transparent'}`}
                                />
                            </div>
                        </div>
                    )}
                </Listbox.Option>
            ))
        )
    }

    return (
        <div id="alert-select">
            <Listbox
                value={selectedAlerts}
                onChange={setSelectedAlerts}
                multiple={true}
            >
                {({ open }) => (
                    <>
                        <Listbox.Button id='add-alert-btn' style={{ marginBottom: '4px' }}>
                            Spending Alert
                            <Plus
                                stroke={'var(--white-text)'}
                                strokeWidth={'18'}
                                width={'.9em'}
                                height={'.9em'}
                            />
                        </Listbox.Button>
                        <DropAnimation visible={open} >
                            <Listbox.Options
                                style={{ position: 'absolute' }}
                                onKeyDown={(e) => console.log(e)}
                                static
                            >
                                <div className="dropdown" >
                                    <Options />
                                    <CustomOption />
                                </div>
                            </Listbox.Options>
                        </DropAnimation>
                    </>
                )}
            </Listbox>
        </div>
    )
}

export default AddAlert
