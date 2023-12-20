import { useState, useRef, useEffect } from 'react'

import Big from 'big.js'
import { Control, useController } from 'react-hook-form'

import './styles/Dropdowns.css'
import { Plus, Return, ArrowIcon, CheckMark } from '@ledget/media'
import ComboSelect from './ComboSelect'
import { formatCurrency } from '@ledget/ui'
import { SlimmestInputButton, MenuTextInput, DropDownDiv } from '@ledget/ui'

const formatDollar = (value?: string | number, percentage?: number) => {
    if (!value) return ''
    !percentage && (percentage = 0)
    const val = Number(`${value}`.replace(/[^0-9.]/g, ''))

    return formatCurrency({ val: Big(val).times(percentage).toNumber(), withCents: false })
}

const baseAlertOptions = [
    { id: 1, value: { percent_amount: 25 }, disabled: false },
    { id: 2, value: { percent_amount: 50 }, disabled: false },
    { id: 3, value: { percent_amount: 75 }, disabled: false },
    { id: 4, value: { percent_amount: 100 }, disabled: false },
]

const AddAlert = (props: { limitAmount?: string | number, defaultValues?: typeof baseAlertOptions[0]['value'][], control: Control<any> }) => {
    const { limitAmount, defaultValues } = props
    const [selectedAlerts, setSelectedAlerts] = useState(defaultValues)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const [alertOptions, setAlertOptions] = useState(baseAlertOptions)

    const CustomOption = () => {
        const ref = useRef<HTMLInputElement>(null)
        const [pct, setPct] = useState('')

        useEffect(() => {
            if (ref.current) {
                ref.current.selectionEnd = pct.indexOf('%')
                ref.current.selectionStart = pct.indexOf('%')
            }
        }, [pct])

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 2)
            setPct(`${newValue}%`)
        }

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (pct.length > 2 && e.key !== 'Backspace') {
                e.preventDefault()
            }
        }

        const handleFocus = () => {
            if (!ref.current) return
            ref.current.selectionEnd = pct.indexOf('%')
            ref.current.selectionStart = pct.indexOf('%')
        }

        const DollarFormat = ({ visible, value, style }: { visible: boolean, value: number, style?: React.CSSProperties }) => {
            return (
                <>
                    {visible &&
                        <span style={style}>
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
                        value={{ percent_amount: pct }}
                        size={7}
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
                                        stroke={"var(--m-text-secondary)"}
                                    />
                                </div>
                            </>
                        )}
                    </ComboSelect.Custom>
                </MenuTextInput>
            </div>
        )
    }

    const Option = ({ value, active, selected }: { value: number, active: boolean, selected?: boolean }) => (
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
                option={option}
                disabled={option.disabled}
                key={option.id}
            >
                {({ active, selected }) => (
                    <Option
                        value={option.value.percent_amount}
                        active={active}
                        selected={selected}
                    />
                )}
            </ComboSelect.Option>
        ))
    )

    const ButtonText = () => (
        <>
            {(selectedAlerts?.length && selectedAlerts?.length > 0)
                &&
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <span
                        style={{
                            backgroundColor: 'var(--m-text)',
                            color: 'var(--m-invert-text)',
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
            {(selectedAlerts?.length && selectedAlerts.length === 0 || selectedAlerts == undefined) &&
                <span>
                    Add Alert
                </span>}
            {(selectedAlerts?.length && selectedAlerts.length > 0)
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

    const { field } = useController({
        name: 'alerts',
        control: props.control,
        defaultValue: selectedAlerts
    })

    // Update form value
    useEffect(() => {
        field.onChange(selectedAlerts)
    }, [selectedAlerts])

    return (
        <ComboSelect
            name="alert"
            value={selectedAlerts}
            onChange={setSelectedAlerts}
            setSelections={setAlertOptions}
            limit={7}
            multiple={true}
        >
            {({ open }) => (
                <>
                    <ComboSelect.Button
                        tabIndex={0}
                        as={SlimmestInputButton}
                        id="add-alert-btn"
                        ref={buttonRef}
                    >
                        <ButtonText />
                    </ComboSelect.Button>
                    <ComboSelect.Options
                        className="select-container"
                        static
                    >
                        <DropDownDiv
                            placement='left'
                            className="select"
                            visible={open}
                            style={{
                                minWidth: buttonRef.current?.offsetWidth,
                            }}
                        >
                            <Options />
                            <CustomOption />
                        </DropDownDiv>
                    </ComboSelect.Options>
                </>
            )}
        </ComboSelect>
    )
}

export default AddAlert
