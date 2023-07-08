import React, { useEffect, useState, useRef } from "react"
import "./style/Otc.css"

function Otc({ codeLength }) {
    const [inputStates, setInputStates] = useState([])
    const inputRefs = useRef([])
    const [code, setCode] = useState(null)

    // Create list of refs and states
    useEffect(() => {
        const states = []
        for (let i = 0; i < codeLength; i++) {
            states.push({ digit: "" })
        }
        setInputStates(states)
        inputRefs.current = Array(codeLength).fill(null)
    }, [codeLength])

    // Update the code when all inputs are filled
    useEffect(() => {
        const finalCode = inputStates
            .map((input) => input.digit)
            .join("")

        // provide the complete code only if it is complete
        finalCode.length === codeLength ? setCode(finalCode) : setCode(null)
    }, [inputStates, codeLength])

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

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            e.preventDefault()
            if (inputStates[index].digit == "") {
                inputRefs.current[index - 1]?.focus()
            } else {
                const updatedStates = [...inputStates]
                updatedStates[index] = { digit: "" }
                setInputStates(updatedStates)
                inputRefs.current[index - 1]?.focus()
            }
        }
    }

    const handlePaste = (e) => {
        console.log(e)
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

    return (
        <div className="otc">
            <fieldset>
                <div>
                    {inputStates.map((input, index) => (
                        <input
                            key={index}
                            type="text"
                            value={input.digit}
                            autoComplete="one-time-code"
                            id={`otc-${index}`}
                            onPaste={(e) => handlePaste(e)}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            ref={(el) => (inputRefs.current[index] = el)}
                            required
                        />
                    ))}
                </div>
            </fieldset>
        </div>
    )
}

export default Otc
