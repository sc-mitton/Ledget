import './styles/Header.scss'
import { CheckAll } from '@ledget/media'
import { IconButton, RefreshButton, Tooltip } from '@ledget/ui'


const CheckAllButton = () => {

    return (
        <Tooltip
            msg={"Confirm all"}
            ariaLabel={"Confirm all items"}
            style={{ left: '-1.3rem' }}
        >
            <IconButton
                id="check-all-icon"
                aria-label="Check all"
            >
                <CheckAll />
            </IconButton>
        </Tooltip>
    )
}

const NewItemsHeader = () => {
    return (
        <div id="needs-confirmation-header-container">
            <div id="needs-confirmation-header">
                <div>
                    <div id="number-of-items">
                        10
                    </div>
                    <span>New budget items</span>
                </div>
                <div>
                    <RefreshButton hasBackground={false} />
                    <CheckAllButton />
                </div>
            </div>
        </div>
    )
}

export default NewItemsHeader
