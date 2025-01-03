import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown } from 'geist-native-icons';
import { TouchableOpacity, View } from 'react-native';

import styles from './styles';
import { TextInputbase } from '../text-inputs/text-inputs';
import type { ModalPickerProps, PickerOption } from './types';
import { Icon } from '../../restyled/Icon';
import { useModalPicker } from './context';
import { useLoaded } from '@ledget/helpers';
import ModalPopUp from './ModalPopUp';
import Selected from './Selected';

export function ModalPicker<O extends PickerOption, TMultiple extends boolean>(
  props: ModalPickerProps<O, TMultiple>
) {
  const { defaultValue, ...rest } = props;
  const loaded = useLoaded(2000);

  const [value, setValue] = useState<O | O[]>();
  const { setShowModalOverlay } = useModalPicker();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (props.onChange) {
      props.onChange(
        Array.isArray(value)
          ? value.map((item) =>
              typeof item === 'object' ? item[props.valueKey || 'value'] : item
            )
          : typeof value === 'object'
          ? value[(props.valueKey as any) || 'value']
          : value
      );
    }
  }, [value, defaultValue]);

  useEffect(() => {
    if (props.closeOnSelect && loaded) {
      setOpenModal(false);
      setShowModalOverlay(false);
    }
  }, [value]);

  return (
    <>
      {props.isFormInput ? (
        <TextInputbase
          label={props.label}
          error={props.error}
          focused={openModal}
        >
          <TouchableOpacity
            style={styles.placeholderButton}
            activeOpacity={0.6}
            onPress={() => {
              setOpenModal(true);
              setShowModalOverlay(true);
            }}
          >
            <Selected
              value={value}
              renderSelected={props.renderSelected}
              labelKey={props.labelKey}
            />
            <View style={styles.chevronIconContainer}>
              <View style={styles.chevronIcon}>
                <Icon
                  icon={
                    props.chevronDirection === 'down'
                      ? ChevronDown
                      : ChevronRight
                  }
                  strokeWidth={2}
                  color={
                    Array.isArray(value)
                      ? value.length > 0
                        ? 'mainText'
                        : 'placeholderText'
                      : value
                      ? 'mainText'
                      : 'placeholderText'
                  }
                />
              </View>
            </View>
          </TouchableOpacity>
        </TextInputbase>
      ) : (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            setOpenModal(true);
            setShowModalOverlay(true);
          }}
        >
          <Selected
            placeholder={props.placeholder}
            value={value}
            renderSelected={props.renderSelected}
            labelKey={props.labelKey}
          />
        </TouchableOpacity>
      )}
      <ModalPopUp
        {...rest}
        open={openModal}
        value={value}
        setValue={setValue}
        onClose={() => {
          setOpenModal(false);
          setShowModalOverlay(false);
        }}
      />
    </>
  );
}
