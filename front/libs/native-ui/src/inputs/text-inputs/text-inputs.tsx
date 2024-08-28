import { useState, forwardRef, useEffect } from 'react';
import {
  TextInputProps,
  Platform,
  TextInput as ReactNativeTextInput,
  TouchableHighlight,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from "react-native";
import { Eye, EyeOff } from 'geist-native-icons';
import { useTheme } from '@shopify/restyle';

import { Box } from '../../restyled/Box';
import { Icon } from '../../restyled/Icon';
import { InputLabel } from '../../restyled/Text';
import styles from './styles';

type Error = {
  message?: string,
  type?: string
}

interface TextInputBaseProps {
  label?: string,
  error?: Error,
  focused?: boolean,
  children: React.ReactNode,
}

export const TextInputbase = (props: TextInputBaseProps) => {
  const { label, error, focused, children } = props

  return (
    <Box style={styles.textInputLabelContainer}>
      {label && <InputLabel>{label}</InputLabel>}
      <Box
        borderColor={error ? 'inputBorderErrorSecondary' : focused ? 'focusedInputBorderSecondary' : 'transparent'}
        borderWidth={1.75}
        style={styles.textInputContainer2}
      >
        <Box
          backgroundColor='inputBackground'
          borderColor={focused ? error ? 'inputBorderErrorMain' : 'focusedInputBorderMain' : 'inputBorder'}
          borderWidth={1.5}
          style={styles.textInputContainer1}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export const TextInput = forwardRef<ReactNativeTextInput, TextInputProps & { label?: string, error?: Error }>((props, ref) => {
  const { children, style, label, onBlur, error, ...rest } = props
  const [focused, setFocused] = useState(false)
  const theme = useTheme()

  return (
    <TextInputbase label={label} error={error} focused={focused}>
      <ReactNativeTextInput
        onFocus={() => setFocused(true)}
        onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
          onBlur && onBlur(e);
          setFocused(false);
        }}
        placeholderTextColor={theme.colors.placeholderText}
        style={[
          {
            ...styles.textInput,
            color: theme.colors.mainText
          },
          style
        ]}
        {...rest} />
      {children}
    </TextInputbase>
  )
})

type PasswordInputProps = TextInputProps & {
  label?: boolean | string,
  error?: Error,
  showPassword?: boolean,
  confirmer?: boolean,
  setShowPassword?: (showPassword: boolean) => void
}

export const PasswordInput = (props: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const {
    label,
    setShowPassword: setShowPasswordProp,
    showPassword: showPasswordProp,
    confirmer,
    ...rest
  } = props

  useEffect(() => {
    if (setShowPasswordProp) setShowPasswordProp(showPassword)
  }, [showPassword])

  useEffect(() => {
    if (showPasswordProp) setShowPassword(showPasswordProp)
  }, [showPasswordProp])

  return (
    <Box style={styles.textInputLabelContainer}>
      {typeof label === 'string'
        ? <InputLabel>{label}</InputLabel>
        : label && <InputLabel>Password</InputLabel>}
      <TextInput
        textContentType='password'
        placeholder='Password'
        autoCapitalize='none'
        autoCorrect={false}
        returnKeyType='go'
        secureTextEntry={!showPassword}
        style={!showPassword && props.value && Platform.OS === 'android' ? styles.passwordMask : undefined}
        {...rest}
      >
        {!confirmer && <TouchableHighlight
          onPress={() => setShowPassword(!showPassword)}
          underlayColor='transparent'
          style={styles.visibilityButton}
        >
          {showPassword
            ? <Icon icon={EyeOff} color='quaternaryText' size={26} />
            : <Icon icon={Eye} color='quaternaryText' size={26} />}
        </TouchableHighlight>}
      </TextInput>
    </Box>
  )
}
