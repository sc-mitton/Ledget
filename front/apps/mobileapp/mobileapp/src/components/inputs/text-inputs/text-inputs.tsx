import { useState } from 'react';
import {
  TextInputProps,
  TextInput as ReactNativeTextInput,
  TouchableHighlight,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from "react-native";
import { Eye, EyeOff } from 'geist-icons-native';
import { useTheme } from '@shopify/restyle';

import { ErrorTip, Box, Icon, InputLabel } from '@components'
import styles from './styles';

type Error = {
  message?: string,
  type?: string
}

export const TextInput = (props: TextInputProps & { label?: string, error?: Error }) => {
  const { children, style, label, onBlur, error, ...rest } = props
  const [focused, setFocused] = useState(false)
  const theme = useTheme()

  return (
    <Box style={styles.textInputLabelContainer}>
      {label && <InputLabel>{label}</InputLabel>}
      <Box
        borderColor={focused ? 'focusedInputBorder2' : 'transparent'}
        borderWidth={2}
        style={styles.textInputContainer2}
      >
        <Box
          backgroundColor='inputBackground'
          borderColor={focused ? 'focusedInputBorder1' : 'inputBorder'}
          borderWidth={1.5}
          style={styles.textInputContainer1}
        >
          <ReactNativeTextInput
            onFocus={() => setFocused(true)}
            onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
              onBlur && onBlur(e);
              setFocused(false);
            }}
            style={{
              ...styles.textInput,
              color: theme.colors.mainText,
            }}
            {...rest} />
          {children}
        </Box>
        {error && <ErrorTip />}
      </Box>
    </Box>
  )
}

export const PasswordInput = (props: TextInputProps & { label?: boolean, error?: Error }) => {
  const [showPassword, setShowPassword] = useState(false)
  const { label, ...rest } = props

  return (
    <Box style={styles.textInputLabelContainer}>
      {label && <InputLabel>Password</InputLabel>}
      <TextInput
        textContentType='password'
        placeholder='Password'
        autoCapitalize='none'
        autoCorrect={false}
        returnKeyType='go'
        secureTextEntry={!showPassword}
        {...rest}
      >
        <TouchableHighlight
          onPress={() => setShowPassword(!showPassword)}
          underlayColor='transparent'
          style={styles.visibilityButton}
        >
          {showPassword ? (
            <Icon icon={EyeOff} color='placeholderText' />
          ) : (
            <Icon icon={Eye} color='placeholderText' />
          )}
        </TouchableHighlight>
      </TextInput>
    </Box>
  )
}
