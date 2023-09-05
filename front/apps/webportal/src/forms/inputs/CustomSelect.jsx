import React, { useState } from 'react'

import Select from 'react-select'

const CustomSelect = ({ field, ...props }) => {
    const [open, setOpen] = useState(false)

    const selectStyles = (open) => ({
        container: (baseStyles, state) => ({
            ...baseStyles,
        }),
        valueContainer: (baseStyles, state) => ({
            ...baseStyles,
            appearance: "none",
        }),
        control: (baseStyles, state) => ({
            ...baseStyles,
            borderRadius: "var(--border-radius2)",
            paddingLeft: "16px",
            paddingRight: "12px",
            paddingTop: "14px",
            paddingBottom: "36px",
            backgroundColor: "#ededed",
            font: "inherit",
            height: "0",
            border: "none",
            border: state.isFocused ? 0 : 0,
            // This line disable the blue border
            boxShadow: state.isFocused ? "var(--input-focus-drop-shadow)" : 0,
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
            color: state.isFocused ? "#60d39c" : "var(--input-placeholder2)",
        }),
        menu: (baseStyles, state) => ({
            ...baseStyles,
            marginTop: "var(--border-radius2)",
            backgroundColor: "var(--window)",
            boxShadow: "0px 0px 4px 2px rgba(0, 0, 0, 0.3)",
            webkitBoxShadow: "0px 0px 4px 2px rgba(0, 0, 0, 0.3)",
            mozBoxShadow: "0px 0px 4px 2px rgba(0, 0, 0, 0.3)",
            borderRadius: "8px",
        }),
        menuList: (baseStyles, state) => ({
            ...baseStyles,
            borderRadius: "6px",
            paddingLeft: "6px",
            paddingRight: "6px",
        }),
        dropdownIndicator: (baseStyles, state) => ({
            ...baseStyles,
            color: state.isFocused ? "#80CFA3" : "#767676",
        }),
        option: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: (state.isFocused ? "var(--social-button-hover)" : "var(--input)"),
            borderRadius: "4px",
            padding: "2px 0px 2px 12px",
            margin: "6px 0",
            width: "100%",
            textAlign: "left",
            cursor: "pointer",
            color: state.isSelected ? "var(--green-text)" : "#767676",
        }),
        singleValue: (baseStyles, state) => ({
            ...baseStyles,
            color: props.isDisabled ? "var(--input-placeholder)" : "var(--input-placeholder)",
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
                autoFill={true}
                {...field}
                {...props}
            />
        </div>
    )
}

export default CustomSelect
