import { useState, useRef, useEffect } from 'react'

import { Dayjs } from 'dayjs'
import { Filter as FilterIcon } from '@geist-ui/icons'

import styles from './styles/Filter.module.scss'
import { DatePicker, DropdownDiv, IconButton3, useAccessEsc } from '@ledget/ui'

const Filter = ({ value, onChange }: { value?: [Dayjs, Dayjs], onChange: React.Dispatch<React.SetStateAction<[Dayjs, Dayjs] | undefined>> }) => {
    const [showDropDown, setShowDropDown] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [active, setActive] = useState(false)

    useAccessEsc({
        refs: [ref, buttonRef],
        visible: showDropDown,
        setVisible: setShowDropDown
    })

    useEffect(() => {
        if (value && value.length && showDropDown) {
            setShowDropDown(false)
        }
    }, [value])

    return (
        <div className={styles.filter} ref={ref}>
            <IconButton3
                onClick={() => setShowDropDown(!showDropDown)}
                aria-label='Filter transactions'
                aria-haspopup='true'
                aria-expanded={showDropDown}
                aria-controls='transactions-filter-dropdown'
                className={active ? styles.activefilterButton : ''}
                ref={buttonRef}
            >
                <FilterIcon
                    className='icon'
                    fill={active ? 'currentColor' : 'transparent'}
                    stroke={active ? 'var(--blue-medium)' : 'currentColor'}
                />
            </IconButton3 >
            <div>
                <DropdownDiv
                    placement='right'
                    id='transactions-filter-dropdown'
                    visible={showDropDown}
                >
                    <DatePicker
                        pickerType='range'
                        aria-label='Filter transactions'
                        placeholder={['Start', 'End']}
                        defaultValue={value}
                        onChange={(date) => {
                            onChange(date);
                            (date && date.length) ? setActive(true) : setActive(false)
                        }}
                    />
                </DropdownDiv>
            </div>
        </div>
    )
}

export default Filter
