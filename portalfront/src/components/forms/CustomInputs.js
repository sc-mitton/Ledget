import React, { forwardRef, } from "react";
import { useState } from 'react'

import Select from 'react-select';
import hidePassword from "../../assets/icons/hidePassword.svg"
import showPassword from "../../assets/icons/showPassword.svg"
import { FormErrorTip } from "./Widgets"

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
            borderRadius: "4px",
        }),
        valueContainer: (baseStyles, state) => ({
            ...baseStyles,
            appearace: "none",
        }),
        control: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: "#ededed",
            font: "inherit",
            fontWeight: "400",
            height: "0",
            border: "none",
            border: state.isFocused ? 0 : 0,
            // This line disable the blue border
            boxShadow: state.isFocused ? "inset 0 0 0 1px var(--main-blue)" : 0,
            '&:hover': {
                border: state.isFocused ? 0 : 0
            }
        }),
        indicatorSeparator: (baseStyles, state) => ({
            ...baseStyles,
            display: "none",
        }),
        indicatorsContainer: (baseStyles, state) => ({
            ...baseStyles,
            paddingLeft: "0",
            paddingRight: "0", // trying to get the padding right still
        }),
        placeholder: (baseStyles, state) => ({
            ...baseStyles,
            color: state.isFocused ? "#6b9bf6" : "#848484"
        }),
        menu: (baseStyles, state) => ({
            ...baseStyles,
            marginTop: "2px",
            borderRadius: "4px",
            backgroundColor: "#ededed",
            boxShadow: "0 4px 6px -5px rgba(0, 0, 0, 0.5)",
        }),
        dropdownIndicator: (baseStyles, state) => ({
            ...baseStyles,
            color: state.isSelected ? "#242424" : "#848484",
        }),
        option: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: state.isFocused ? "#c3d7fc" : "#ededed",
            borderRadius: "2px",
            padding: "4px",
            width: "100%",
            textAlign: "center",
            cursor: "pointer",
            color: state.isSelected ? "#5c90f9" : "#242424"
        })
    }

    return (
        <Select
            unstyled={false}
            styles={dropDownStyles}
            className='CustomSelect'
            ref={ref}
            {...Props}
        />
    )
})

const PasswordInput = (props) => {
    const [input, setInput] = useState('')

    const VisibilityIcon = () => {
        return (
            <img
                src={props.visible ? hidePassword : showPassword}
                alt="toggle visibility"
                className="hide-password-icon"
                onClick={() => props.setVisible(!props.visible)}
            />
        )
    }

    return (
        <div className="password-container">
            <div className="password-input">
                <input
                    type={props.visible ? 'text' : 'password'}
                    name={props.name}
                    placeholder={props.placeholder}
                    {...props.register(props.name, {
                        onChange: (e) => {
                            e.target.value != '' ?
                                setInput(true)
                                : setInput(false)
                        }
                    })}
                />
                {input && props.visIcon && <VisibilityIcon />}
            </div>
        </div>
    )
}

PasswordInput.defaultProps = {
    visIcon: true
}

export { Checkbox, CustomSelect, PasswordInput };
