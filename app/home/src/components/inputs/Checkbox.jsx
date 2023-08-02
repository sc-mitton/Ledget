import React, { useRef, forwardRef } from 'react'

import './styles/Checkbox.css'

const Checkbox = forwardRef((props, ref) => {
    const localRef = useRef(null)
    const inputRef = ref || localRef

    const handleLabelKeyDown = (event) => {
        if (event.key === 'Enter') {
            const inputEl = document.getElementById(event.target.htmlFor)
            if (inputEl) {
                inputEl.click()
            }
        }
    }

    const { id, label, ...rest } = props

    return (
        <div className="checkbox-container">
            <svg className="checkbox-symbol">
                <symbol id="check" viewBox="0 0 12 10">
                    <polyline
                        points="1.5 6 4.5 9 10.5 1"
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                    />
                </symbol>
            </svg>
            <input
                className="checkbox-input"
                type="checkbox"
                id={props.id}
                ref={inputRef}
                aria-label={props.label}
                {...rest}
            />
            <label
                className="checkbox"
                htmlFor={props.id}
                onKeyDown={handleLabelKeyDown}
                tabIndex="0"
                role="checkbox"
                aria-checked={inputRef.current?.checked}
            >
                <span>
                    <svg>
                        <use xlinkHref="#check"></use>
                    </svg>
                </span>
                <span>{props.label}</span>
            </label>
        </ div>
    )
})

export default Checkbox
