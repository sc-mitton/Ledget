import React, { useRef } from 'react'

import Delete from '@assets/icons/Delete'
import Close from '@assets/icons/Close'
import { LoadingRing } from '@components/pieces'

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

export const SubmitButton = (props) => {
    const {
        children,
        submitting,
        ...rest
    } = props

    return (
        <button
            className='btn-grn btn3'
            type="submit"
            aria-label="Save"
            tabIndex={0}
            disabled={submitting}
            {...rest}
        >
            <LoadingRing visible={submitting}>
                <div
                    style={{
                        color: submitting ? 'transparent' : 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {children}
                </div>
            </LoadingRing>
        </button>
    )
}

export const CloseButton = React.forwardRef((props, ref) => {
    const localRef = useRef(null)
    const r = ref || localRef
    const { style, ...rest } = props

    return (
        <button
            className="btn-clr btn"
            ref={r}
            style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                ...style,
            }}
            {...rest}
        >
            <Close />
        </button>
    )
})
