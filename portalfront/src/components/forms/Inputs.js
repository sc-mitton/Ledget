import React, { forwardRef } from "react";
import Select from 'react-select';

const Checkbox = (props) => {
    let id = props.id
    let text = props.text
    let checkRef = props.checkRef

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
                id={id}
                ref={checkRef}
                type="checkbox"
            />
            <label
                className="checkbox"
                htmlFor={id}
                onSubmit={props.onSubmit}
            >
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

const CustomSelect = forwardRef(({ ...Props }, ref) => {

    let dropDownStyles = {
        control: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: "#ededed",
            paddingLeft: "12px",
            paddingRight: "8px",
            borderRadius: "4px",
            font: "inherit",
            fontWeight: "400",
            border: (state.isFocused) ? "1px solid #6b9bf6" : null,
        }),
        placeholder: (baseStyles, state) => ({
            ...baseStyles,
            color: "#848484",
        }),
        menu: (baseStyles, state) => ({
            ...baseStyles,
            borderRadius: "0 0 4px 4px",
            backgroundColor: "#ededed",
            boxShadow: "0 4px 6px -5px rgba(0, 0, 0, 0.5)",
        }),
        dropdownIndicator: (baseStyles, state) => ({
            ...baseStyles,
            color: state.isSelected ? "#242424" : "#848484",
        }),
        option: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: state.isSelected || state.isFocused ? "#c3d7fc" : "#ededed",
            padding: "4px",
            width: "100%",
            textAlign: "center",
            cursor: "pointer",
        }),
        input: (baseStyles, state) => ({
            ...baseStyles,
            inputMode: "text",
        }),
    }

    return (
        <Select
            unstyled={true}
            styles={dropDownStyles}
            ref={ref}
            {...Props}
            className="CustomSelect"
        />
    )
})

export { Checkbox, CustomSelect };
