import { useState } from 'react'

import './styles/Header.scss'
import { Funnel } from '@ledget/media'
import { IconButton, Tooltip, SlimInputButton } from '@ledget/ui'

const FilterWindow = ({ expanded = false, setShowFilter }:
    { expanded: boolean, setShowFilter: (show: boolean) => void }) => {

    // Filters to include
    // 1. By amount
    // 2. By merchant
    // 3. By date
    // 4. By category
    // 5. By account
    // 6. By bill

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
                <div>
                    <h2>History</h2>
                </div>
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
