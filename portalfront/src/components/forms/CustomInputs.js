import React, { forwardRef, useEffect, } from "react"
import { useState } from 'react'

import Select from 'react-select'
import hidePassword from "../../assets/icons/hidePassword.svg"
import showPassword from "../../assets/icons/showPassword.svg"

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

const CustomSelect = ({ onChange, onBlur, value, ...props }) => {

    let dropDownStyles = {
        container: (baseStyles, state) => ({
            ...baseStyles,
        }),
        valueContainer: (baseStyles, state) => ({
            ...baseStyles,
            appearace: "none",
        }),
        control: (baseStyles, state) => ({
            ...baseStyles,
            borderRadius: "4px",
            paddingLeft: "12px",
            paddingRight: "8px",
            backgroundColor: "#ededed",
            font: "inherit",
            height: "0",
            border: "none",
            border: state.isFocused ? 0 : 0,
            // This line disable the blue border
            boxShadow: state.isFocused ? "0 0 1px 1px var(--light-blue)" : 0,
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
            paddingRight: "0", // get the padding
        }),
        placeholder: (baseStyles, state) => ({
            ...baseStyles,
            color: state.isFocused ? "var(--main-blue)" : "#848484",
        }),
        menu: (baseStyles, state) => ({
            ...baseStyles,
            marginTop: "4px",
            backgroundColor: "var(--button-gray)",
            boxShadow: "0 4px 6px -5px rgba(0, 0, 0, 0.5)",
            borderRadius: "4px",
        }),
        menuList: (baseStyles, state) => ({
            ...baseStyles,
            borderRadius: "4px",
        }),
        dropdownIndicator: (baseStyles, state) => ({
            ...baseStyles,
            color: state.isFocused ? "var(--main-blue)" : "#848484",
        }),
        option: (baseStyles, state) => ({
            ...baseStyles,
            textAlign: "left",
            backgroundColor: state.isSelected
                ? "var(--main-blue)"
                : (state.isFocused ? "#717070" : "var(--button-gray)"),
            borderRadius: "2px",
            padding: "4px",
            width: "100%",
            textAlign: "center",
            cursor: "pointer",
            color: "#f8f8f8"
        }),
        singleValue: (baseStyles, state) => ({
            ...baseStyles,
            color: props.isDisabled ? "var(--input-placeholder)" : "var(--main-text-gray)",
        })
    }

    const handleChange = (selectedOption) => {
        onChange(selectedOption.value)
    }

    const findSelectedOption = (value) => {
        return props.options.find((option) => option.value === value)
    }

    return (
        <Select
            unstyled={true}
            styles={dropDownStyles}
            className='CustomSelect'
            onChange={handleChange}
            onBlur={onBlur}
            value={findSelectedOption(value)}
            {...props}
        />
    )
}


const VisibilityIcon = (props) => {
    // Needs to be set outside the PasswordInput component
    // to prevent rerendering of the icon
    return (
        <img
            src={props.visible ? hidePassword : showPassword}
            alt="toggle visibility"
            className="hide-password-icon"
            onClick={() => props.setVisible(!props.visible)}
        />
    )
}

const PasswordInput = (props) => {
    const [pwdInput, setPwdInput] = useState(false)

    return (
        <div className="password-container">
            <div className="password-input">
                <input
                    type={props.visible ? 'text' : 'password'}
                    name={props.name}
                    placeholder={props.placeholder}
                    {...props.register(props.name, {
                        onChange: (e) => {
                            if (e.target.value == "" && pwdInput) {
                                setPwdInput(false)
                            } else if (e.target.value.length == 1) {
                                setPwdInput(true)
                            }
                        }
                    })}
                    onKeyDown={props.onKeyDown}
                />
                {pwdInput && props.visIcon &&
                    <VisibilityIcon
                        visible={props.visible}
                        setVisible={props.setVisible}
                    />
                }
            </div>
        </div>
    )
}

PasswordInput.defaultProps = {
    visIcon: true
}

export { Checkbox, CustomSelect, PasswordInput }
