import { useState } from 'react'

import { Listbox, Combobox } from '@headlessui/react'

import './styles/Header.scss'
import { Funnel } from '@ledget/media'
import { FullSelectCategoryBill } from '@components/dropdowns'
import { LimitAmountInput } from '@components/inputs'
import {
    IconButton,
    Tooltip,
    SlimInputButton
} from '@ledget/ui'

const FilterWindow = ({ expanded = false, setShowFilter }:
    { expanded: boolean, setShowFilter: (show: boolean) => void }) => {

    // Filters to include
    // By date
    // By amount
    // By merchant
    // By category/bill
    // By account

    return (
        <div className={`filter-window ${expanded ? 'expanded' : ''}`}>
            <div>

            </div>
            <div>
                <SlimInputButton onClick={() => setShowFilter(false)}>
                    Apply
                </SlimInputButton>
            </div>
        </div>
    )
}

const HistoryHeader = () => {
    const [showFilter, setShowFilter] = useState<boolean>(false)

    return (
        <>
            <div className="window-header" id="history-header">
                <div><h2>History</h2></div>
                <div className="header-btns">
                    <Tooltip
                        msg="Filter"
                        ariaLabel="Filter"
                        type="top"
                        style={{ left: '-.4rem' }}
                    >
                        <IconButton
                            id="funnel-icon"
                            aria-label="Filter"
                            onClick={() => setShowFilter(!showFilter)}
                        >
                            <Funnel />
                        </IconButton>
                    </Tooltip>
                </div>
                <FilterWindow
                    expanded={showFilter}
                    setShowFilter={setShowFilter}
                />
            </div>

        </>
    )
}

export default HistoryHeader
