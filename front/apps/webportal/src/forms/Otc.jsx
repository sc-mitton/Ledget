import React, { useEffect, useState, useRef } from "react"
import "./style/Otc.css"

function Otc({ codeLength, required, reset, setReset }) {
    const [inputStates, setInputStates] = useState([])
    const inputRefs = useRef([])
    const [code, setCode] = useState('')

    // Default props
    codeLength = codeLength || 6
    required = required || true
    reset = reset || false
    setReset = setReset || (() => { })

    // Create list of refs and states
    useEffect(() => {
        const states = []
        for (let i = 0; i < codeLength; i++) {
            states.push({ digit: "" })
        }
        setInputStates(states)
        inputRefs.current = Array(codeLength).fill('')
    }, [])

    // Reset the code when reset is set to true
    useEffect(() => {
        if (reset) {
            const states = []
            for (let i = 0; i < codeLength; i++) {
                states.push({ digit: "" })
            }
            setInputStates(states)
            inputRefs.current[0]?.focus()
        }
        return () => {
            setReset(false)
        }
    }, [reset])

    // Focus the first input on mount
    // Timeout is needed to allow rendering of componenet
    // before focusing
    useEffect(() => {
        const firstInputRef = inputRefs.current[0]
        if (firstInputRef instanceof HTMLInputElement) {
            const timer = setTimeout(() => {
                firstInputRef.focus()
            }, 0)
            return () => clearTimeout(timer)
        }
    }, [inputRefs.current])

    // Update the code when all inputs are filled
    useEffect(() => {
        const finalCode = inputStates
            .map((input) => input.digit)
            .join("")

        // provide the complete code only if it is complete
        finalCode.length === codeLength ? setCode(finalCode) : setCode('')
    }, [inputStates, codeLength])

    // Control the input of the digits
    const handleChange = (e, index) => {
        const entry = e.target.value

        // Only allow single digit
        if (entry.length <= 1) {
            const updatedStates = [...inputStates]
            updatedStates[index] = { digit: e.target.value }
            setInputStates(updatedStates)

            if (entry.length === 1 && index < codeLength - 1) {
                inputRefs.current[index + 1]?.focus()
            } else if (entry.length === 0 && index > 0) {
                inputRefs.current[index - 1]?.focus()
            }
        } else {
            return
        }
    }

    // Handle backspace
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            e.preventDefault()
            if (inputStates[index].digit == "") {
                inputRefs.current[index - 1]?.focus()
            } else {
                const updatedStates = [...inputStates]
                updatedStates[index] = { digit: "" }
                setInputStates(updatedStates)
            }
        }
    }

    // Handle pasting in the whole code
    const handlePaste = (e) => {
        e.preventDefault()
        const paste = e.clipboardData.getData("text")

        const updatedStates = [...inputStates]
        for (let i = 0; i < paste.length; i++) {
            if (i < codeLength) {
                updatedStates[i] = { digit: paste[i] }
            }
        }
        setInputStates(updatedStates)

        inputRefs.current[codeLength - 1]?.focus()
    }

    // Function for turning the code input into a controlled component
    const ControlledCodeInput = ({ value, onChange }) => (
        <input
            type="hidden"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            name="code"
        />
    )

    return (
        <div className="otc">
            <fieldset>
                <div>
                    {inputStates.map((input, index) => (
                        <input
                            required={required}
                            key={index}
                            type="text"
                            id={`otc-${index}`}
                            value={input.digit}
                            autoComplete="one-time-code"
                            onPaste={(e) => handlePaste(e)}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            ref={(el) => (inputRefs.current[index] = el)}
                        />
                    ))}
                </div>
                <ControlledCodeInput
                    value={code}
                    onChange={setCode}
                />
            </fieldset>
        </div>
    )
}

export default Otc
