import { Plus, Funnel } from '@ledget/media'
import { IconButton, Tooltip } from '@ledget/ui'

const HistoryHeader = () => {
    return (
        <div className="window-header">
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
                    >
                        <Funnel />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    )
}

export default HistoryHeader
