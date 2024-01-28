import { HTMLProps, useState, useRef } from 'react'

import { Bell } from '@geist-ui/icons'

import { DropDownDiv, useAccessEsc } from '@ledget/ui'
import { useGetTransactionsCountQuery } from '@features/transactionsSlice'
import { useGetStartEndQueryParams } from '@hooks/utilHooks'
import { NeedsConfirmationStack } from './needs-confirmation/Stack'
import { SpendingViewContextProvider } from './context'

const NotificationsDropdownMenu = (props: HTMLProps<HTMLDivElement>) => {
    const { start, end } = useGetStartEndQueryParams()
    const { data: tCountData } = useGetTransactionsCountQuery({ confirmed: false, start, end }, { skip: !start || !end })
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    useAccessEsc({
        refs: [dropdownRef, buttonRef],
        visible: showDropdown,
        setVisible: setShowDropdown,
    })

    return (
        <SpendingViewContextProvider>
            <div style={{ position: 'relative' }} {...props}>
                <button
                    ref={buttonRef}
                    className={`${tCountData?.count || 0 > 0 ? 'active' : ''}`}
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    <Bell className='icon' />
                </button>
                <DropDownDiv
                    ref={dropdownRef}
                    placement='right'
                    arrow='right'
                    className='profile-dropdown'
                    visible={showDropdown}
                    transformOrigin='center'
                    style={{
                        borderRadius: '.75rem',
                    }}
                >
                    <NeedsConfirmationStack />
                </DropDownDiv>
            </div>
        </SpendingViewContextProvider>
    )
}

export default NotificationsDropdownMenu
