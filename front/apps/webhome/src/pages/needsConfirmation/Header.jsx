import './styles/Header.css'
import { CheckAll } from '@ledget/shared-assets'
import { IconButton, RefreshButton, Tooltip } from '@ledget/shared-ui'


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
                    <h4>Need Confirmation</h4>
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
