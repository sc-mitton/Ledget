import './buttons.css'
import { Delete, Grip, CornerGrip } from '@ledget/media'

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

export const GripButton = (props) => (
    <button
        className="btn grip-btn"
        aria-label="Move"
        draggable-item="true"
        {...props}
    >
        <Grip />
    </button>
)

export const CornerGripButton = (props) => (
    <button
        className="btn corner-grip-btn"
        aria-label="Move"
        draggable-item="true"
        {...props}
    >
        <CornerGrip />
    </button>
)
