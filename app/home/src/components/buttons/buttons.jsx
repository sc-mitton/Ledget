import Delete from '@assets/icons/Delete'

export const DeleteButton = ({ onClick }) => (
    <div>
        <button
            className={`btn delete-button-show`}
            aria-label="Remove"
            onClick={onClick}
        >
            <Delete width={'1.1em'} height={'1.1em'} />
        </button>
    </div>
)
