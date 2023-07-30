import React, { useState } from 'react'

import { Listbox } from '@headlessui/react'

import './styles/AddAlert.css'
import Plus from '@assets/icons/Plus'
import Checkmark from '@assets/icons/Checkmark'
import { DropAnimation } from '@utils'


const defaultAlertOptions = [
    { id: 1, value: 25, unavailable: false },
    { id: 2, value: 50, unavailable: false },
    { id: 3, value: 75, unavailable: false },
    { id: 4, value: 100, unavailable: false },
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

    const ListOption = ({ option }) => (
        <Listbox.Option
            key={option.id}
            value={option.value}
            disabled={option.unavailable}
        >
            {({ active, selected }) => (
                <div className={
                    `slct-item ${active && "a-slct-item"} ${selected && "s-slct-item"}`
                }>
                    <span>
                        {option.value}%&nbsp;&nbsp;
                        <span
                            style={{
                                opacity: `${active ? .5 : 0}`,
                                fontSize: '.8em',
                                display: 'inline'
                            }}
                        >
                            {limit
                                ? `(${formatDollar(limit, option.value)})`
                                : ('of limit')
                            }
                        </span>
                    </span>
                    <span>
                        <Checkmark stroke={`${selected ? 'var(--green-dark)' : 'transparent'}`} />
                    </span>
                </div>
            )}
        </Listbox.Option>
    )

    const CustomOption = () => {

        return (
            <Listbox.Button>
                <div>Hello World</div>
            </Listbox.Button>
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
                            <Listbox.Options static style={{ position: 'absolute' }}>
                                <div className="dropdown" >
                                    {alertOptions.map((option) => (<ListOption option={option} />))}
                                </div>
                                <CustomOption />
                            </Listbox.Options>
                        </DropAnimation>
                    </>
                )}
            </Listbox>
        </div>
    )
}

export default AddAlert
