import { useState, forwardRef, useEffect, useRef } from 'react';
import {
  TextInputProps,
  Platform,
  TextInput as ReactNativeTextInput,
  TouchableHighlight,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  Keyboard,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import LottieView from 'lottie-react-native';
import OutsidePressHandler from 'react-native-outside-press';

import { Box } from '../../restyled/Box';
import { Icon } from '../../restyled/Icon';
import { InputLabel } from '../../restyled/Text';
import styles from './styles';

type Error = {
  message?: string;
  type?: string;
};

interface TextInputBaseProps {
  label?: string;
  error?: Error;
  focused?: boolean;
  children: React.ReactNode;
}

export const TextInputbase = (props: TextInputBaseProps) => {
  const { label, error, focused, children } = props;

  return (
    <OutsidePressHandler
      onOutsidePress={() => Keyboard.dismiss()}
      style={styles.textInputLabelContainer}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <Box
        borderColor={
          error
            ? 'inputBorderErrorSecondary'
            : focused
            ? 'focusedInputBorderSecondary'
            : 'transparent'
        }
        borderWidth={2}
        style={styles.textInputContainer2}
      >
        <Box
          backgroundColor="inputBackground"
          borderColor={
            focused
              ? error
                ? 'inputBorderErrorMain'
                : 'focusedInputBorderMain'
              : 'inputBorder'
          }
          borderWidth={1.75}
          style={styles.textInputContainer1}
        >
          {children}
        </Box>
      </Box>
    </OutsidePressHandler>
  );
};

export const TextInput = forwardRef<
  ReactNativeTextInput,
  TextInputProps & { label?: string; error?: Error }
>((props, ref) => {
  const { children, style, label, onBlur, error, ...rest } = props;
  const [focused, setFocused] = useState(false);
  const theme = useTheme();

  return (
    <TextInputbase label={label} error={error} focused={focused}>
      <ReactNativeTextInput
        keyboardAppearance={theme.colors.mode === 'dark' ? 'dark' : 'light'}
        ref={ref}
        onFocus={() => setFocused(true)}
        onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
          onBlur && onBlur(e);
          setFocused(false);
        }}
        placeholderTextColor={theme.colors.placeholderText}
        style={[
          {
            ...styles.textInput,
            color: theme.colors.mainText,
          },
          style,
        ]}
        {...rest}
      />
      {children}
    </TextInputbase>
  );
});

type PasswordInputProps = TextInputProps & {
  label?: boolean | string;
  error?: Error;
  showPassword?: boolean;
  confirmer?: boolean;
  setShowPassword?: (showPassword: boolean) => void;
};

export const PasswordInput = (props: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    label,
    setShowPassword: setShowPasswordProp,
    showPassword: showPasswordProp,
    confirmer,
    ...rest
  } = props;

  const animation = useRef<LottieView>(null);
  const theme = useTheme();

  useEffect(() => {
    if (setShowPasswordProp) setShowPasswordProp(showPassword);
  }, [showPassword]);

  useEffect(() => {
    if (showPasswordProp) setShowPassword(showPasswordProp);
  }, [showPasswordProp]);

  return (
    <Box style={styles.textInputLabelContainer}>
      {typeof label === 'string' ? (
        <InputLabel>{label}</InputLabel>
      ) : (
        label && <InputLabel>Password</InputLabel>
      )}
      <TextInput
        textContentType="password"
        placeholder="Password"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="go"
        secureTextEntry={!showPassword}
        style={
          !showPassword && props.value && Platform.OS === 'android'
            ? styles.passwordMask
            : undefined
        }
        {...rest}
      >
        {!confirmer && (
          <TouchableHighlight
            onPress={() => {
              setShowPassword(!showPassword);
              if (showPassword) {
                animation.current?.play(25, 0);
                setTimeout(() => animation.current?.reset(), 800);
              } else {
                animation.current?.play();
              }
            }}
            underlayColor="transparent"
            style={styles.visibilityButton}
          >
            <LottieView
              ref={animation}
              style={{ width: 28, height: 28 }}
              colorFilters={[
                {
                  keypath: 'eye',
                  color: theme.colors.placeholderText,
                },
              ]}
              autoPlay={false}
              loop={false}
              source={
                theme.colors.mode === 'light'
                  ? require('../../assets/visibilityV2Light.json')
                  : require('../../assets/visibilityV2Dark.json')
              }
            />
          </TouchableHighlight>
        )}
      </TextInput>
    </Box>
  );
};
