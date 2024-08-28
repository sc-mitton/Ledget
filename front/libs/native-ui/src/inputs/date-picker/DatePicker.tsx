
import React, { useEffect, useRef } from 'react';
import NativeDatePicker from 'react-native-date-picker'
import { View, NativeSyntheticEvent, TextInputFocusEventData, TouchableOpacity } from 'react-native';
import { useTheme } from '@shopify/restyle';
import dayjs, { Dayjs } from 'dayjs';
import Animated, { withSpring, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

import styles from './styles';
import { HalfArrow } from '@ledget/media/native';
import { InputLabel } from '../../restyled/Text';
import { Box } from '../../restyled/Box';
import { Icon } from '../../restyled/Icon';
import { Text } from '../../restyled/Text';
import { TPicker, DatePickerProps } from './types';
import { defaultSpringConfig } from '../../animated/configs/configs';

export function DatePicker<PT extends TPicker = 'date'>(props: DatePickerProps<PT>) {
  const [value, setValue] = React.useState<typeof props.defaultValue>(
    props.pickerType === 'range' ?
      props.defaultValue || [undefined, undefined] :
      props.defaultValue || undefined
  );
  const [pickerWidth, setPickerWidth] = React.useState(0);
  const [index, setIndex] = React.useState<number>();
  const bottomIndicatorOpacity = useSharedValue(0);
  const bottomIndicatorX = useSharedValue(0);

  const bottomIndicatorStyle = useAnimatedStyle(() => {
    return {
      opacity: bottomIndicatorOpacity.value,
      transform: [{ translateX: bottomIndicatorX.value }]
    }
  });

  useEffect(() => {
    if (props.pickerType === 'range') {
      props.onChange && props.onChange(value as [Dayjs, Dayjs]);
    } else {
      props.onChange && props.onChange(value as Dayjs);
    }
  }, [value]);

  useEffect(() => {
    if (index === 0) {
      bottomIndicatorOpacity.value = withSpring(1, defaultSpringConfig);
      bottomIndicatorX.value = withSpring(12, defaultSpringConfig);
    } else if (index === 1) {
      bottomIndicatorOpacity.value = withSpring(1, defaultSpringConfig);
      bottomIndicatorX.value = withSpring(pickerWidth / 2, defaultSpringConfig);
    } else {
      bottomIndicatorOpacity.value = withSpring(0, defaultSpringConfig);
    }
  }, [index]);

  return (
    <>
      {props.label &&
        <InputLabel>{props.label}</InputLabel>}
      <View
        style={styles.mainContainer}
        onLayout={(e) => setPickerWidth(e.nativeEvent.layout.width)}
      >
        <Box
          borderColor={props.error
            ? 'inputBorderErrorSecondary' : index !== undefined ? 'focusedInputBorderSecondary'
              : 'transparent'}
          borderWidth={1.75}
          style={styles.textInputContainer2}
        >
          <Box
            backgroundColor='inputBackground'
            borderColor={index !== undefined
              ? props.error ? 'inputBorderErrorMain' : 'focusedInputBorderMain'
              : 'inputBorder'}
            borderWidth={1.5}
            style={styles.textInputContainer1}
          >
            <TouchableOpacity
              onPress={() => setIndex(0)}
              style={styles.textInput}
              activeOpacity={.7}
            >
              <Text
                selectable={false}
                color={Array.isArray(value) ? value[0] ? 'mainText' : 'placeholderText' : value ? 'mainText' : 'placeholderText'}
              >
                {Array.isArray(value)
                  ? value[0]?.format(props.format) || `${props.placeholder?.[0]}`
                  : value?.format(props.format) || `${props.placeholder}`}
              </Text>
            </TouchableOpacity>
            {props.pickerType === 'range' &&
              <>
                <View style={styles.middleIconContainer}>
                  <View style={styles.middleIcon}>
                    <Icon
                      icon={HalfArrow}
                      size={14}
                      strokeWidth={2}
                      color={
                        Array.isArray(value)
                          ? value.every(i => i === undefined) ? 'placeholderText' : 'mainText'
                          : value === undefined ? 'placeholderText' : 'mainText'
                      }
                    />
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setIndex(1)}
                  style={styles.textInput}
                  activeOpacity={.7}
                >
                  <Text
                    selectable={false}
                    color={Array.isArray(value) ? value[1] ? 'mainText' : 'placeholderText' : value ? 'mainText' : 'placeholderText'}
                  >
                    {Array.isArray(value)
                      ? value[1]?.format(props.format) || `${props.placeholder?.[1]}`
                      : value?.format(props.format) || `${props.placeholder}`}
                  </Text>
                </TouchableOpacity>
              </>
            }
            <Animated.View style={[bottomIndicatorStyle, styles.bottomBorderIndicator]}>
              <Box
                backgroundColor='focusedInputBorderMain'
                width={(pickerWidth / 2) - 24}
                style={styles.bottomBorderIndicatorBar}
              />
            </Animated.View>
          </Box>
        </Box>
      </View>
      <NativeDatePicker
        modal
        theme={props.theme}
        open={index === 0}
        mode={props.mode}
        minimumDate={
          props.pickerType === 'range'
            ? props.disabled?.[index || 0]?.[0]?.toDate() || undefined
            : props.disabled?.[0]?.toDate() || undefined
        }
        maximumDate={
          props.pickerType === 'range'
            ? props.disabled?.[0]?.[1]?.toDate() || undefined
            : props.disabled?.[1]?.toDate() || undefined
        }
        date={
          Array.isArray(value)
            ? value[0]?.toDate() || new Date()
            : value?.toDate() || new Date()
        }
        onConfirm={(date) => {
          const d = dayjs(date.toISOString());
          if (Array.isArray(value)) {
            setValue([d, value[0]]);
            value?.[1] ? setIndex(undefined) : setIndex(1);
          } else {
            setValue(d);
          }
        }}
        onCancel={() => {
          setIndex(undefined);
        }}
      />
      {Array.isArray(value) &&
        <NativeDatePicker
          modal
          theme={props.theme}
          open={index === 1}
          mode={props.mode}
          minimumDate={
            props.pickerType === 'range'
              ? props.disabled?.[index || 0]?.[0]?.toDate() || undefined
              : props.disabled?.[0]?.toDate() || undefined
          }
          maximumDate={
            props.pickerType === 'range'
              ? props.disabled?.[1]?.[1]?.toDate() || undefined
              : props.disabled?.[1]?.toDate() || undefined
          }
          date={value[index || 0]?.toDate() || new Date()}
          onConfirm={(date) => {
            const d = dayjs(date.toISOString());
            setValue([value[0], d]);
            value?.[0] ? setIndex(undefined) : setIndex(0);
          }}
          onCancel={() => {
            setIndex(undefined);
          }}
        />

      }
    </>
  );
}

export default DatePicker;
