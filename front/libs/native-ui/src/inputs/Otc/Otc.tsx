import { useState, useRef, useEffect } from 'react'

import { View, TextInput, Keyboard } from 'react-native'

import styles from './styles';
import { Box } from '../../restyled/Box';
import { useTheme } from '@shopify/restyle';

type Props = {
  codeLength: number;
  onCodeChange: (code: string) => void;
  error?: string;
  autoFocus?: boolean;
}

export const Otc = (props: Props) => {
  const { codeLength, onCodeChange, autoFocus, error } = props
  const theme = useTheme()

  const [inputStates, setInputStates] = useState<Array<string>>(Array(codeLength).fill(''))
  const [focused, setFocused] = useState<number>()
  const inputRefs = useRef<Array<TextInput | null>>(Array(codeLength).fill(''))

  useEffect(() => {
    const code = inputStates.join('')
    onCodeChange(code)
  }, [inputStates, onCodeChange])

  useEffect(() => {
    if (autoFocus) {
      const timeout = setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 400)
      return () => clearTimeout(timeout)
    }
  }, [autoFocus])

  // Control the input of the digits
  const handleChange = (s: string, index: number) => {

    // Only allow single digit
    if (s.length <= 1) {
      setInputStates(prev => {
        const updatedStates = [...prev]
        updatedStates[index] = s
        return updatedStates
      })

      if (s.length === 1 && index < codeLength - 1) {
        inputRefs.current[index + 1]?.focus()
      } else if (s.length === 0 && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    } else {
      setInputStates(s.split(''))
    }

    if (index === (codeLength - 1) || s.length === codeLength) {
      Keyboard.dismiss()
    }
  }

  const handleBackspace = (index: number) => {
    setInputStates(prev => {
      const updatedStates = [...prev]
      updatedStates[index] = ''
      return updatedStates
    })
    if (index > 0)
      inputRefs.current[index - 1]?.focus()
  }

  return (
    <View style={styles.otcContainer}>
      {
        Array(codeLength).fill('').map((_, index) => (
          <>
            <Box
              key={`otc-${index}`}
              borderColor={focused === index ? 'focusedInputBorderSecondary' : 'transparent'}
              borderWidth={1.5}
              style={styles.otcInputContainer2}
            >
              <Box
                backgroundColor='inputBackground'
                borderColor={focused === index ? 'focusedInputBorderMain' : 'inputBorder'}
                borderWidth={1.25}
                style={styles.otcInputContainer1}
              >
                <TextInput
                  keyboardAppearance={theme.colors.mode === 'dark' ? 'dark' : 'light'}
                  keyboardType='numeric'
                  style={{
                    ...styles.otcInput,
                    color: theme.colors.mainText,
                  }}
                  ref={el => inputRefs.current[index] = el}
                  onFocus={() => setFocused(index)}
                  onBlur={() => setFocused(undefined)}
                  value={inputStates[index]}
                  onChangeText={(s) => handleChange(s, index)}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Backspace') {
                      handleBackspace(index)
                    }
                  }}
                />
              </Box>
            </Box>
            {codeLength / 2 === (index + 1) &&
              <Box key={`otc-dash-${index}`} backgroundColor='authScreenSeperator' style={styles.dash} />}
          </>
        ))
      }
    </View>
  )
}
