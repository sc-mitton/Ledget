import React from "react";

const Checkbox = (props) => {
    const { id, text, } = props;

    return (
        <div className="checkbox-container">
            <svg className="checkbox-symbol">
                <symbol id="check" viewBox="0 0 12 10">
                    <polyline points="1.5 6 4.5 9 10.5 1" strokeLinecap='round' strokeLineJoin='round' strokeWidth='2' />
                </symbol>
            </svg>
            <input className="checkbox-input" id={id} type="checkbox" />
            <label className="checkbox" htmlFor={id}>
                <span>
                    <svg>
                        <use xlinkHref="#check"></use>
                    </svg>
                </span>
                <span>{text}</span>
            </label>
        </div >
    )
}

export default Checkbox;
