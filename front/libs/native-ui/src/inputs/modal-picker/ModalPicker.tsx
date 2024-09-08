import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown } from 'geist-native-icons';
import { TouchableOpacity, View } from 'react-native';

import styles from './styles';
import { TextInputbase } from '../text-inputs/text-inputs';
import type { ModalPickerProps, PickerOption } from './types';
import { Icon } from '../../restyled/Icon';
import { useModalPicker } from './context';
import ModalPopUp from './ModalPopUp';
import Selected from './Selected';

export function ModalPicker<O extends PickerOption, TMultiple extends boolean>(props: ModalPickerProps<O, TMultiple>) {
  const { defaultValue, ...rest } = props;

  const [value, setValue] = useState<O[] | O | undefined>(defaultValue);
  const { setShowModalOverlay } = useModalPicker();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (props.onChange) {
      props.onChange(
        Array.isArray(value)
          ? value.map(item => typeof item === 'object' ? item[props.valueKey || 'value'] : item)
          : typeof value === 'object' ? value[(props.valueKey as any) || 'value'] : value
      )
    }
  }, [value]);

  return (
    <>
      {props.isFormInput
        ?
        <TextInputbase
          label={props.label}
          error={props.error}
          focused={openModal}>
          <TouchableOpacity
            style={styles.placeholderButton}
            activeOpacity={.6}
            onPress={() => {
              setOpenModal(true);
              setShowModalOverlay(true);
            }}
          >
            <Selected value={value} renderSelected={props.renderSelected} labelKey={props.labelKey} />
            <View style={styles.chevronIconContainer}>
              <Icon
                icon={props.chevronDirection === 'down' ? ChevronDown : ChevronRight}
                strokeWidth={2}
                color={Array.isArray(value)
                  ? value.length > 0 ? 'mainText' : 'placeholderText'
                  : value ? 'mainText' : 'placeholderText'}
              />
            </View>
          </TouchableOpacity>
        </TextInputbase>
        :
        <TouchableOpacity
          activeOpacity={.6}
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
        </TouchableOpacity>
      }
      <ModalPopUp
        {...rest}
        open={openModal}
        value={value}
        setValue={setValue}
        onClose={() => {
          setOpenModal(false)
          setShowModalOverlay(false)
        }}
      />
    </>
  );
}

