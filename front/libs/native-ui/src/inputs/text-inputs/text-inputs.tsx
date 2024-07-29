import { useState, forwardRef } from 'react';
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

export const TextInput = forwardRef<ReactNativeTextInput, TextInputProps & { label?: string, error?: Error }>((props, ref) => {
  const { children, style, label, onBlur, error, ...rest } = props
  const [focused, setFocused] = useState(false)
  const theme = useTheme()

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
        </Box>
      </Box>
    </Box>
  )
})

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
        style={!showPassword && props.value && Platform.OS === 'android' ? styles.passwordMask : undefined}
        {...rest}
      >
        <TouchableHighlight
          onPress={() => setShowPassword(!showPassword)}
          underlayColor='transparent'
          style={styles.visibilityButton}
        >
          {showPassword
            ? <Icon icon={EyeOff} color='quaternaryText' size={26} />
            : <Icon icon={Eye} color='quaternaryText' size={26} />}
        </TouchableHighlight>
      </TextInput>
    </Box>
  )
}
