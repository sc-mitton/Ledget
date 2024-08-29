import { useContext, createContext, useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'geist-native-icons';
import { TouchableOpacity, View, TextInput as NativeTextInput } from 'react-native';
import { Search } from 'geist-native-icons';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';

import styles from './styles';
import { TextInputbase } from '../text-inputs/text-inputs';
import { TextInput } from '../text-inputs/text-inputs';
import type { ModalPickerProps, PickerOption, TContext } from './types';
import { Icon } from '../../restyled/Icon';
import { Text } from '../../restyled/Text';
import { Modal } from '../../containers/modal/Modal';
import { Seperator } from '../../restyled/Seperator';
import { CustomScrollView } from '../../containers/custom-scroll-view/CustomScrollView';
import OutsidePressHandler from 'react-native-outside-press';

const ModalPickerContext = createContext<TContext<PickerOption, boolean> | undefined>(undefined);

export function ModalPickerContextProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<PickerOption[]>([]);
  const [multiple, setMultiple] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [value, setValue] = useState<PickerOption | PickerOption[]>();
  const [searchable, setSearchable] = useState(false);
  const [header, setHeader] = useState<string>();
  const [labelKey, setLabelKey] = useState<string | number>();
  const [renderOption, setRenderOption] = useState<(option: PickerOption) => React.ReactNode>();

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
        setValue,
        searchable,
        setSearchable,
        header,
        setHeader,
        labelKey,
        setLabelKey,
        renderOption,
        setRenderOption
      }}
    >
      {children}
      {openModal &&
        <Animated.View
          exiting={FadeOutDown}
          entering={FadeInUp.withInitialValues({ translateY: 500 }).duration(300)}
          style={styles.modalWrapper}>
          <BakedModal />
        </Animated.View>}
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

function BakedModal() {
  const {
    searchable,
    header,
    options,
    multiple,
    value,
    setValue,
    setOpenModal,
    labelKey
  } = usePickerContext();
  const [searchValue, setSearchValue] = useState('');
  const [localOptions, setLocalOptions] = useState<PickerOption[]>([]);
  const searchRef = useRef<NativeTextInput>(null);

  useEffect(() => {
    if (!searchValue) {
      setLocalOptions(options);
      return;
    };

    setLocalOptions(options.filter(option => {
      if (typeof option === 'string') {
        return option.toLowerCase().includes(searchValue.toLowerCase());
      } else {
        console.log(option[labelKey || 'label'].toLowerCase());
        return option[labelKey || 'label'].toLowerCase().includes(searchValue.toLowerCase());
      }
    }));

  }, [searchValue, options]);

  return (
    <Modal
      onClose={() => setOpenModal(false)}
      position='bottomFloat'
      hasOverlay={true}
    >
      {header &&
        <>
          <Text variant='bold' fontSize={18} style={styles.header}>
            {header}
          </Text>
          <Seperator variant='s' backgroundColor='menuSeperator' />
        </>
      }
      {searchable &&
        <OutsidePressHandler onOutsidePress={() => searchRef.current?.blur()}>
          <View style={styles.searchContainer}>
            <TextInput
              value={searchValue}
              onChangeText={setSearchValue}
              placeholder='Search...'
              style={styles.searchInput}
              ref={searchRef}
            >
              <View style={styles.searchIconContainer}>
                <View style={styles.searchIcon}>
                  <Icon icon={Search} color={searchValue ? 'mainText' : 'placeholderText'} />
                </View>
              </View>
            </TextInput>
          </View>
        </OutsidePressHandler>}
      <CustomScrollView style={styles.scrollView}>
        {localOptions.map((option, index) => {
          const label = typeof option === 'object' ? option['label'] : option;
          return (
            <>
              <TouchableOpacity
                activeOpacity={.6}
                key={`${label}-${index}--selected`}
                style={styles.option}
                onPress={() => {
                  if (multiple) {
                    if (Array.isArray(value)) {
                      setValue([...value, option]);
                    } else {
                      setValue([option]);
                    }
                  } else {
                    setValue(option as any);
                  }
                }}
              >
                <Text>{label}</Text>
              </TouchableOpacity>
              {index !== options.length - 1 && <Seperator variant='bare' backgroundColor='menuSeperator' />}
            </>
          );
        })}
      </CustomScrollView>
    </Modal>
  );
}

export function ModalPicker<O extends PickerOption, TMultiple extends boolean>(props: ModalPickerProps<O, TMultiple>) {
  const {
    onChange,
    multiple = false,
    searchable = false,
    options,
    renderSelected,
    error,
    label,
    header,
    labelKey,
    renderOption
  } = props;

  const {
    setOptions: contextSetOptions,
    value: contextValue,
    openModal,
    setMultiple,
    setOpenModal,
    setHeader,
    setSearchable,
    setLabelKey,
    setRenderOption
  } = usePickerContext();

  const [value, setValue] = useState<O[] | O>();

  useEffect(() => {
    if (contextValue) {
      setValue(contextValue as O[] | O);
    }
  }, [contextValue]);

  useEffect(() => {
    onChange && onChange(value as any);
  }, [value]);

  useEffect(() => {
    if (openModal) {
      contextSetOptions(options);
      setMultiple(multiple);
      setHeader(header);
      setSearchable(searchable);
      setLabelKey(labelKey || '');
      setRenderOption(renderOption);
    } else {
      contextSetOptions([]);
      setMultiple(false);
      setHeader(undefined);
      setSearchable(false);
      setRenderOption(undefined);
    }
  }, [openModal, options, multiple]);

  return (
    <TextInputbase
      label={label}
      error={error}
      focused={openModal}>
      <TouchableOpacity
        style={styles.placeholderButton}
        activeOpacity={.6}
        onPress={() => setOpenModal(true)}
      >
        {value
          ?
          renderSelected
            ? renderSelected(value as any)
            : Array.isArray(value)
              ?
              <View style={styles.defaultSelectedItems}>
                {value.map((item, index) => {
                  const label = typeof item === 'object' ? item[props.labelKey || 'label'] : item;
                  return (
                    <Text key={`${label}-${index}`}>
                      {label}
                    </Text>
                  )
                })}
              </View>
              :
              <Text>
                {typeof value === 'object' ? value[(props.labelKey as any) || 'label'] : value}
              </Text>
          :
          <Text color={
            Array.isArray(value)
              ? value.length > 0 ? 'mainText' : 'placeholderText'
              : value ? 'mainText' : 'placeholderText'}
          >
            {`${props.placeholder || 'Select...'}`}
          </Text>}
        <View style={styles.chevronIconContainer}>
          <Icon
            icon={ChevronRight}
            strokeWidth={2}
            color={Array.isArray(value)
              ? value.length > 0 ? 'mainText' : 'placeholderText'
              : value ? 'mainText' : 'placeholderText'}
          />
        </View>
      </TouchableOpacity>
    </TextInputbase>
  );
}

