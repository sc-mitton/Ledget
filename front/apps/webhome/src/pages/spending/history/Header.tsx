import { useState } from 'react'

import './styles/Header.scss'
import { Funnel } from '@ledget/media'
import { IconButton, Tooltip } from '@ledget/ui'

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
            </div>
            <div className={`filter-window ${showFilter ? 'expanded' : ''}`}>

            </div>
        </>
    )
}

export default HistoryHeader
