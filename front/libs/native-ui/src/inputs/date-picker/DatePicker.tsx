
import React, { useEffect } from 'react';
import NativeDatePicker from 'react-native-date-picker'
import { View, TextInput as ReactNativeTextInput, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { useTheme } from '@shopify/restyle';
import dayjs, { Dayjs } from 'dayjs';

import styles from './styles';
import { HalfArrow } from '@ledget/media';
import { InputLabel } from '../../restyled/Text';
import { Box } from '../../restyled/Box';
import { Icon } from '../../restyled/Icon';

// Types
type Error = {
  message?: string,
  type?: string
}

type TPicker = 'date' | 'range';

type BaseDatePickerProps<T extends TPicker> = {
  name?: string
  mode: 'datetime' | 'date' | 'time'
  format?: 'MM/DD/YYYY' | 'M/D/YYYY' | 'MM/DD/YY' | 'DD/MM/YYYY' | 'DD/MM/YY'
  disabled?: [Dayjs | undefined, Dayjs | undefined][]
  hidden?: [Dayjs | undefined, Dayjs | undefined][]
  theme?: 'light' | 'dark'
  label?: string
  error?: Error
}

type DatePickerProps<T extends TPicker> =
  T extends 'range'
  ? {
    placeholder?: [string, string]
    pickerType: T
    defaultValue?: [Dayjs | undefined, Dayjs | undefined]
    onChange?: (value?: [Dayjs, Dayjs]) => void
  } & BaseDatePickerProps<T>
  : {
    placeholder?: string
    pickerType: T
    defaultValue?: Dayjs
    onChange?: (value?: Dayjs) => void
  } & BaseDatePickerProps<T>

export function DatePicker<PT extends TPicker = 'date'>(props: DatePickerProps<PT>) {
  const [value, setValue] = React.useState<typeof props.defaultValue>(
    props.pickerType === 'range' ?
      props.defaultValue || [undefined, undefined] :
      props.defaultValue || undefined
  );
  const [index, setIndex] = React.useState<number>();
  const theme = useTheme();

  useEffect(() => {
    if (props.pickerType === 'range') {
      props.onChange && props.onChange(value as [Dayjs, Dayjs]);
    } else {
      props.onChange && props.onChange(value as Dayjs);
    }
  }, [value]);

  return (
    <View>
      {props.label && <InputLabel>{props.label}</InputLabel>}
      <View>
        <Box
          borderColor={props.error
            ? 'inputBorderErrorSecondary' : index === 0 ? 'focusedInputBorderSecondary'
              : 'transparent'}
          borderWidth={1.75}
          style={styles.textInputContainer2}
        >
          <Box
            backgroundColor='inputBackground'
            borderColor={index === 0
              ? props.error ? 'inputBorderErrorMain' : 'focusedInputBorderMain'
              : 'inputBorder'}
            borderWidth={1.5}
            style={styles.textInputContainer1}
          >
            <ReactNativeTextInput
              onFocus={() => setIndex(0)}
              onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
                setIndex(undefined);
              }}
              placeholder={props.pickerType === 'range' ? props.placeholder?.[0] : props.placeholder}
              placeholderTextColor={theme.colors.placeholderText}
              style={[{ ...styles.textInput, color: theme.colors.mainText }]}
            />
            {props.pickerType === 'range' &&
              <>
                <Icon icon={HalfArrow} />
                <ReactNativeTextInput
                  onFocus={() => setIndex(1)}
                  onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
                    setIndex(undefined);
                  }}
                  placeholder={props.placeholder?.[1]}
                  placeholderTextColor={theme.colors.placeholderText}
                  style={[{ ...styles.textInput, color: theme.colors.mainText }]}
                />
              </>
            }
          </Box>
        </Box>
      </View>
      <NativeDatePicker
        modal
        theme={props.theme}
        open={index !== undefined}
        mode={props.mode}
        date={
          Array.isArray(value)
            ? value[index || 0]?.toDate() || new Date()
            : value?.toDate() || new Date()
        }
        onConfirm={(date) => {
          const d = dayjs(date.toISOString());
          if (Array.isArray(value)) {
            index === 0 ? setValue([d, value[1]]) : setValue([value[0], d]);
          } else {
            setValue(d);
          }
        }}
        onCancel={() => setIndex(undefined)}
      />
    </View>
  );
}

export default DatePicker;
