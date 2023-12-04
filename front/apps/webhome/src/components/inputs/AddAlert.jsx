import { useState, useRef, useEffect } from 'react'

import Big from 'big.js'

import './styles/Dropdowns.css'
import { Plus, Return, ArrowIcon, CheckMark } from '@ledget/media'
import ComboSelect from './ComboSelect'
import { formatCurrency } from '@ledget/ui'
import { SlimInputButton, MenuTextInput, DropAnimation } from '@ledget/ui'

const formatDollar = (value, percentage) => {
    if (!value) return ''
    !percentage && (percentage = 0)

    return formatCurrency({ val: Big(value).times(percetnage).times(100).toNumber() })
}

const AddAlert = (props) => {
    const { limitAmount, defaultValues } = props
    const [selectedAlerts, setSelectedAlerts] = useState([])
    const buttonRef = useRef(null)

    const [alertOptions, setAlertOptions] = useState([
        { id: 1, value: 25, disabled: false },
        { id: 2, value: 50, disabled: false },
        { id: 3, value: 75, disabled: false },
        { id: 4, value: 100, disabled: false },
    ])

    // Set Default Values
    useEffect(() => {
        if (defaultValues) {
            setSelectedAlerts([...defaultValues.map((op) => op.percent_amount)])
        }
    }, [defaultValues])

    const CustomOption = () => {
        const ref = useRef('')
        const [pct, setPct] = useState('')

        useEffect(() => {
            ref.current.selectionEnd = pct.indexOf('%')
            ref.current.selectionStart = pct.indexOf('%')
        }, [pct])

        const handleChange = (e) => {
            const newValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 2)
            setPct(`${newValue}%`)
        }

        const handleKeyDown = (e) => {
            if (pct.length > 2 && e.key !== 'Backspace') {
                e.preventDefault()
            }
        }

        const handleFocus = () => {
            ref.current.selectionEnd = pct.indexOf('%')
            ref.current.selectionStart = pct.indexOf('%')
        }

        const DollarFormat = ({ visible, value, ...rest }) => {
            return (
                <>
                    {visible &&
                        <span {...rest}>
                            &#40;{formatDollar(limitAmount, value)}&#41;
                        </span>}
                </>
            )
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
                                <DollarFormat
                                    visible={Boolean(limitAmount)}
                                    value={parseInt(pct.replace(/[^0-9]/g, ''), 10)}
                                    style={{
                                        opacity: focused ? ".5" : "0",
                                        marginRight: '.5em'
                                    }}
                                />
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

    const Option = ({ value, active, selected }) => (
        <div className={`slct-item ${active && "a-slct-item"} ${selected && "s-slct-item"}`}>
            <div>{value}%</div>
            <div>
                <span className={`${active ? 'active' : ''}`} style={{ fontWeight: '400' }}>
                    {limitAmount
                        ? `(${formatDollar(limitAmount, value)})`
                        : ('of limit')
                    }
                </span>
                <CheckMark
                    stroke={`${selected ? 'var(--main-dark)' : 'transparent'}`}
                />
            </div>
        </div>
    )

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

    const ButtonText = () => (
        <>
            {selectedAlerts.length > 0
                &&
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <span
                        style={{
                            backgroundColor: 'var(--m-text)',
                            color: 'var(--white-text)',
                            borderRadius: '50%',
                            padding: '.375em',
                            width: '.5em',
                            height: '.5em',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontWeight: '500',
                            marginRight: '.5em',
                            fontSize: '.75em'
                        }}
                    >
                        {`${selectedAlerts.length}`}
                    </span>
                    <span style={{ color: 'var(--m-text)' }}>
                        {`${selectedAlerts.length == 1 ? 'Alert' : 'Alerts'}`}
                    </span>
                </div>
            }
            {selectedAlerts.length === 0 &&
                <span>
                    Add Alert
                </span>}
            {selectedAlerts.length > 0
                ?
                <ArrowIcon
                    stroke={'var(--m-text)'}
                    strokeWidth={'18'}
                    size={'.9em'}
                />
                :
                <Plus strokeWidth={'18'} size={'.8em'} />
            }
        </>
    )

    return (
        <ComboSelect
            name="alert"
            value={selectedAlerts}
            onChange={setSelectedAlerts}
            setSelections={setAlertOptions}
            limit={7}
            multiple
        >
            {({ open }) => (
                <>
                    <ComboSelect.Button
                        tabIndex={0}
                        as={SlimInputButton}
                        id="add-alert-btn"
                        ref={buttonRef}
                    >
                        <ButtonText />
                    </ComboSelect.Button>
                    <ComboSelect.Options
                        className="select-container"
                        static
                    >
                        <DropAnimation
                            placement='left'
                            className="dropdown select"
                            visible={open}
                            style={{
                                minWidth: buttonRef.current?.offsetWidth,
                            }}
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
