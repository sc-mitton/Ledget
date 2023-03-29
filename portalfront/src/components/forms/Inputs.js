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
        container: (baseStyles, state) => ({
            ...baseStyles,
            width: "100%",
            maxHeight: "35px",
            backgroundColor: "#ededed",
            border: (state.isFocused) ? "1px solid #6b9bf6" : null,
            borderRadius: "4px",
            boxShadow: "0 1px 0px 0 rgba(0, 0, 0, 0.05)",
        }),
        control: (baseStyles, state) => ({
            ...baseStyles,
            paddingLeft: "12px",
            paddingRight: "8px",
            paddingBottom: "2px",
            font: "inherit",
            fontWeight: "400",
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
