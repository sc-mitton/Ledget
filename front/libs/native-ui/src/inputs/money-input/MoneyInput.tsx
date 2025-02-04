import { useState, useRef, useMemo } from 'react';
import {
  TextInput as ReactNativeTextInput,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { clamp } from 'lodash';
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
    name,
    label,
    error,
    accuracy,
    ...rest
  } = props;

  const {
    limits = inputType === 'range'
      ? [
          [0, null],
          [0, null],
        ]
      : [0, null],
  } = props;

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: accuracy || 0,
        maximumFractionDigits: accuracy || 0,
      }),
    [accuracy]
  );

  const [index, setIndex] = useState<number>();
  const [value, setValue] = useState<[number, number] | number>(
    defaultValue ? defaultValue : inputType === 'range' ? [0, 0] : 0
  );
  const [formatedValue, setFormatedValue] = useState<[string, string] | string>(
    defaultValue
      ? Array.isArray(defaultValue)
        ? [
            formatter.format(defaultValue[0] / 100),
            formatter.format(defaultValue[1] / 100),
          ]
        : formatter.format(defaultValue / 100)
      : inputType === 'range'
      ? ['', '']
      : ''
  );
  const theme = useTheme();
  const input1Ref = useRef<ReactNativeTextInput>(null);
  const input2Ref = useRef<ReactNativeTextInput>(null);

  const handleChange = (v: string) => {
    const bounded = clamp(
      parseFloat(v.replace(/[^0-9]/g, '')),
      Array.isArray(limits[0])
        ? limits[0][0] === null
          ? Number.MIN_VALUE
          : limits[0][0]
        : limits[0] === null
        ? Number.MIN_VALUE
        : limits[0],
      Array.isArray(limits[1])
        ? limits[1][1] === null
          ? Number.MAX_VALUE
          : limits[1][1]
        : limits[1] === null
        ? Number.MAX_VALUE
        : limits[1]
    );
    const newVal = bounded / Math.pow(10, accuracy || 0);

    if (props.inputType === 'range' && onChange) {
      const newValue =
        index === 0
          ? [newVal, (value as any)[1] || 0]
          : [(value as any)[0] || 0, newVal];
      onChange(newValue as any);
      setValue(newValue as any);
      if (Array.isArray(newValue)) {
        setFormatedValue([
          newValue[0] > 0 ? formatter.format(newValue[0]) : formatter.format(0),
          newValue[0] > 0 ? formatter.format(newValue[1]) : formatter.format(0),
        ]);
      }
    } else if (onChange) {
      onChange(newVal as any);
      setValue(newVal);
      if (!Array.isArray(newVal)) {
        setFormatedValue(newVal > 0 ? formatter.format(newVal) : '');
      }
    }
  };

  return (
    <OutsidePressHandler
      style={styles.container}
      onOutsidePress={() => {
        input1Ref.current?.blur();
        input2Ref.current?.blur();
      }}
    >
      <Box style={styles.textInputLabelContainer}>
        {label && <InputLabel>{label}</InputLabel>}
        <Box
          borderColor={
            error
              ? 'inputBorderErrorSecondary'
              : index === 0
              ? 'focusedInputBorderSecondary'
              : 'transparent'
          }
          borderWidth={1.75}
          style={styles.textInputContainer2}
        >
          <Box
            backgroundColor="inputBackground"
            borderColor={
              index === 0
                ? error
                  ? 'inputBorderErrorMain'
                  : 'focusedInputBorderMain'
                : 'inputBorder'
            }
            borderWidth={1.5}
            style={styles.textInputContainer1}
          >
            <ReactNativeTextInput
              {...rest}
              ref={input1Ref}
              inputMode={'numeric'}
              keyboardAppearance={
                theme.colors.mode === 'dark' ? 'dark' : 'light'
              }
              value={
                Array.isArray(formatedValue)
                  ? formatedValue?.[0]
                  : formatedValue
              }
              onFocus={() => setIndex(0)}
              onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
                onBlur && onBlur(e);
                setIndex(undefined);
              }}
              onChangeText={(v) => handleChange(v)}
              placeholder={`$0${accuracy ? '.' + '0'.repeat(accuracy) : ''}`}
              placeholderTextColor={theme.colors.placeholderText}
              style={[
                { ...styles.textInput, color: theme.colors.mainText },
                style,
              ]}
            />
            {props.inputType === 'range' && (
              <Text
                style={styles.dash}
                variant="bold"
                color={
                  Array.isArray(formatedValue)
                    ? formatedValue?.some((i) => i)
                      ? 'mainText'
                      : 'placeholderText'
                    : value
                    ? 'mainText'
                    : 'placeholderText'
                }
              >
                &ndash;
              </Text>
            )}
            {props.inputType === 'range' && (
              <ReactNativeTextInput
                {...rest}
                ref={input2Ref}
                value={
                  Array.isArray(formatedValue)
                    ? formatedValue?.[1] || ''
                    : formatedValue
                }
                inputMode={'numeric'}
                onFocus={() => setIndex(1)}
                onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
                  onBlur && onBlur(e);
                  setIndex(undefined);
                }}
                onChangeText={(v) => handleChange(v)}
                placeholder={`$0${
                  props.accuracy ? '.' + '0'.repeat(props.accuracy) : ''
                }`}
                placeholderTextColor={theme.colors.placeholderText}
                style={[
                  { ...styles.textInput, color: theme.colors.mainText },
                  style,
                ]}
              />
            )}
          </Box>
        </Box>
      </Box>
    </OutsidePressHandler>
  );
}

export default MoneyInput;
