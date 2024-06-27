import { useState } from 'react';
import {
  TextInputProps,
  TextInput as ReactNativeTextInput,
  TouchableHighlight
} from "react-native";
import { Eye, EyeOff } from 'geist-icons-native';
import { useTheme } from '@shopify/restyle';

import { Box, Icon, InputLabel } from '../../index';
import styles from './styles';

export const TextInput = (props: TextInputProps & { label?: string }) => {
  const { children, style, label, ...rest } = props
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
            onBlur={() => setFocused(false)}
            style={{
              ...styles.textInput,
              color: theme.colors.mainText,
            }}
            {...rest} />
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export const PasswordInput = (props: TextInputProps & { label?: boolean }) => {
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
