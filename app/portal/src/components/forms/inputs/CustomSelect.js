import React, { useState } from 'react'

import Select from 'react-select'
import './styles/CustomSelect.css'

const CustomSelect = ({ field, ...props }) => {
    const [open, setOpen] = useState(false)

    const selectStyles = (open) => ({
        container: (baseStyles, state) => ({
            ...baseStyles,
        }),
        valueContainer: (baseStyles, state) => ({
            ...baseStyles,
            appearace: "none",
        }),
        control: (baseStyles, state) => ({
            ...baseStyles,
            borderRadius: "6px",
            paddingLeft: "16px",
            paddingRight: "12px",
            paddingTop: "14px",
            paddingBottom: "36px",
            backgroundColor: "#ebebeb",
            font: "inherit",
            height: "0",
            border: "none",
            border: state.isFocused ? 0 : 0,
            // This line disable the blue border
            boxShadow: state.isFocused ? "0 0 .5px 1.5px var(--light-blue)" : 0,
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
            color: state.isFocused ? "#6b9bf6" : "#767676",
        }),
        menu: (baseStyles, state) => ({
            ...baseStyles,
            marginTop: "4px",
            backgroundColor: "var(--button-hover-gray)",
            boxShadow: "0 4px 6px -5px rgba(0, 0, 0, 0.5)",
            borderRadius: "4px",
        }),
        menuList: (baseStyles, state) => ({
            ...baseStyles,
            borderRadius: "4px",
        }),
        dropdownIndicator: (baseStyles, state) => ({
            ...baseStyles,
            color: state.isFocused ? "#6b9bf6" : "#767676",
        }),
        option: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: (state.isFocused ? "rgba(248, 248, 248, .2)" : "var(--button-gray)"),
            borderRadius: "2px",
            padding: "4px 4px 4px 16px",
            width: "100%",
            textAlign: "left",
            cursor: "pointer",
            color: state.isSelected ? "var(--light-blue)" : "#f8f8f8"
        }),
        singleValue: (baseStyles, state) => ({
            ...baseStyles,
            color: props.isDisabled ? "var(--input-placeholder)" : "var(--main-text-gray)",
        })
    })

    const handleStateChange = (selectedOption) => {
        // Set the selected value to the field
        field.onChange(selectedOption)
    }

    return (
        <div onClick={() => { setOpen(!open) }}>
            <Select
                unstyled={true}
                styles={selectStyles(open)}
                className='CustomSelect'
                onChange={handleStateChange}
                {...field}
                {...props}
            />
        </div>
    )
}

export default CustomSelect
