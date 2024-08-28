import { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  TextInput as ReactNativeTextInput,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  Keyboard
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import OutsidePressHandler from 'react-native-outside-press';

import styles from './styles';
import type { TInput, MoneyInputProps } from './types';
import { InputLabel } from '../../restyled/Text';
import { Text } from '../../restyled/Text';
import { Box } from '../../restyled/Box';


export function MoneyInput<T extends TInput>(props: MoneyInputProps<T>) {
  const {
    onBlur,
    onChange,
    style,
    inputType,
    defaultValue,
    disabled,
    name,
    label,
    error,
    accuracy,
    ...rest
  } = props;

  const formatter = useMemo(() => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: accuracy || 0,
    maximumFractionDigits: accuracy || 0
  }), [accuracy]);

  const [index, setIndex] = useState<number>();
  const [value, setValue] = useState<[number, number] | number>(
    defaultValue
      ? defaultValue
      : inputType === 'range' ? [0, 0] : 0
  );
  const [formatedValue, setFormatedValue] = useState<[string, string] | string>();
  const theme = useTheme();
  const input1Ref = useRef<ReactNativeTextInput>(null);
  const input2Ref = useRef<ReactNativeTextInput>(null);

  const handleChange = (v: string) => {
    console.log('v', v);
    const vp = parseFloat(v.replace(/[^0-9]/g, '')) / Math.pow(10, accuracy || 0);

    if (props.inputType === 'range' && onChange) {
      const newValue = index === 0 ? [vp, (value as any)[1]] : [(value as any)[0], v];
      onChange(newValue as any);
      setValue(newValue as any);
      if (Array.isArray(newValue)) {
        setFormatedValue([
          newValue[0] > 0 ? formatter.format(newValue[0]) : '',
          newValue[0] > 0 ? formatter.format(newValue[1]) : ''
        ]);
      }
    } else if (onChange) {
      onChange(vp as any);
      setValue(vp);
      if (!Array.isArray(vp)) {
        setFormatedValue(formatter.format(vp));
      }
    }
  };

  return (
    <OutsidePressHandler onOutsidePress={() => {
      input1Ref.current?.blur();
      input2Ref.current?.blur();
    }}>
      <View>
        <Box style={styles.textInputLabelContainer}>
          {label && <InputLabel>{label}</InputLabel>}
          <Box
            borderColor={error ? 'inputBorderErrorSecondary' : index === 0 ? 'focusedInputBorderSecondary' : 'transparent'}
            borderWidth={1.75}
            style={styles.textInputContainer2}
          >
            <Box
              backgroundColor='inputBackground'
              borderColor={index === 0 ? error ? 'inputBorderErrorMain' : 'focusedInputBorderMain' : 'inputBorder'}
              borderWidth={1.5}
              style={styles.textInputContainer1}
            >
              <ReactNativeTextInput
                {...rest}
                ref={input1Ref}
                inputMode={'numeric'}
                value={Array.isArray(formatedValue) ? formatedValue?.[0] : formatedValue}
                onFocus={() => setIndex(0)}
                onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
                  onBlur && onBlur(e);
                  setIndex(undefined);
                }}
                onChangeText={(v) => handleChange(v)}
                placeholder={`$0${accuracy ? '.' + '0'.repeat(accuracy) : ''}`}
                placeholderTextColor={theme.colors.placeholderText}
                style={[
                  {
                    ...styles.textInput,
                    color: theme.colors.mainText
                  },
                  style
                ]}
              />
              {props.inputType === 'range' &&
                <Text
                  style={styles.dash}
                  color={Array.isArray(formatedValue)
                    ? formatedValue?.some(i => i) ? 'mainText' : 'placeholderText'
                    : value ? 'placeholderText' : 'mainText'}
                >
                  &ndash;
                </Text>}
              {props.inputType === 'range' && (
                <ReactNativeTextInput
                  {...rest}
                  ref={input2Ref}
                  value={Array.isArray(formatedValue) ? formatedValue?.[1] : formatedValue}
                  inputMode={'numeric'}
                  onFocus={() => setIndex(0)}
                  onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
                    onBlur && onBlur(e);
                    setIndex(undefined);
                  }}
                  onChangeText={(v) => handleChange(v)}
                  placeholder={`$0${props.accuracy ? '.' + '0'.repeat(props.accuracy) : ''}`}
                  placeholderTextColor={theme.colors.placeholderText}
                  style={[
                    {
                      ...styles.textInput,
                      color: theme.colors.mainText
                    },
                    style
                  ]}
                />
              )}
            </Box>
          </Box>
        </Box>
      </View>
    </OutsidePressHandler>
  );
}


export default MoneyInput;
