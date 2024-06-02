import { useEffect, useState, useRef } from "react"
import styles from "./otc.module.scss"


export function Otc({ codeLength = 6, required = true, colorful = false }) {
  const [inputStates, setInputStates] = useState<Array<{ digit: string }>>([])
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const [code, setCode] = useState('')

  // Default props
  codeLength = codeLength || 6
  required = required || true

  // Create list of refs and states
  useEffect(() => {
    const states: Array<{ digit: string }> = []
    for (let i = 0; i < codeLength; i++) {
      states.push({ digit: "" })
    }
    setInputStates(states)
    inputRefs.current = Array(codeLength).fill('')
  }, [])

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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (inputStates[index].digit === "") {
        inputRefs.current[index - 1]?.focus();
      } else {
        const updatedStates = [...inputStates];
        updatedStates[index] = { digit: "" };
        setInputStates(updatedStates);
      }
    }
  };

  // Handle pasting in the whole code
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
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
  const ControlledCodeInput = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => (
    <input
      type="hidden"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      name="code"
    />
  )

  return (
    <div className={styles.otc}>
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
              size={1}
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
