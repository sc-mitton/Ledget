import { useContext, createContext, useState, useEffect, useCallback } from 'react';
import { ChevronDown } from 'geist-native-icons';
import { TouchableOpacity } from 'react-native';

import styles from './styles';
import { TextInputbase } from '../text-inputs/text-inputs';
import type { ModalPickerProps, PickerOption, TContext } from './types';
import { Icon } from '../../restyled/Icon';
import { Text } from '../../restyled/Text';

const ModalPickerContext = createContext<TContext<PickerOption, boolean> | undefined>(undefined);

export function ModalPickerContextProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<PickerOption[]>([]);
  const [multiple, setMultiple] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [value, setValue] = useState<PickerOption | PickerOption[]>();

  return (
    <ModalPickerContext.Provider
      value={{
        options,
        setOptions,
        multiple,
        setMultiple,
        openModal,
        setOpenModal,
        value,
        setValue
      }}
    >
      {children}
    </ModalPickerContext.Provider>
  );
}

const usePickerContext = () => {
  const context = useContext(ModalPickerContext);
  if (!context) {
    throw new Error('usePickerContext must be used within a ModalPickerContextProvider');
  }
  return context;
}

export function ModalPicker<O extends PickerOption, TMultiple extends boolean>(props: ModalPickerProps<O, TMultiple>) {
  const {
    onChange,
    multiple = false,
    options,
    renderSelected,
    error,
    label
  } = props;

  const {
    setOptions: contextSetOptions,
    value: contextValue,
    openModal,
    setMultiple,
    setOpenModal,
  } = usePickerContext();

  const [value, setValue] = useState<O[] | O>();

  useEffect(() => {
    if (openModal) {
      contextSetOptions(options);
      setMultiple(multiple);
    } else {
      contextSetOptions([]);
      setMultiple(false);
    }
  }, [openModal, options, multiple]);

  return (
    <TextInputbase
      label={label}
      error={error}
      focused={openModal}>
      {value
        ? renderSelected
          ? renderSelected(value as any)
          : Array.isArray(value)
            ? value.map((item, index) => {
              const label = typeof item === 'object' ? item[props.labelKey || 'label'] : item;
              return (
                <Text key={index}>{label}</Text>
              )
            })
            : <Text>
              {typeof value === 'object' ? value[(props.labelKey as any) || 'label'] : value}
            </Text>
        :
        <TouchableOpacity
          style={styles.placeholderButton}
          activeOpacity={.7} onPress={() => setOpenModal(true)}
        >
          <Text color={
            Array.isArray(value)
              ? value.length > 0 ? 'mainText' : 'placeholderText'
              : value ? 'mainText' : 'placeholderText'}
          >
            {`${props.placeholder || 'Select...'}`}
          </Text>
          <Icon
            icon={ChevronDown}
            strokeWidth={2}
            color={Array.isArray(value)
              ? value.length > 0 ? 'mainText' : 'placeholderText'
              : value ? 'mainText' : 'placeholderText'}
          />
        </TouchableOpacity>}
    </TextInputbase>
  );
}

