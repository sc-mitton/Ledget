import { useState, useEffect, useRef, useContext, createContext } from 'react';
import { ChevronRight } from 'geist-native-icons';
import { TouchableOpacity, View, TextInput as NativeTextInput, Modal as NativeModal, StyleSheet } from 'react-native';
import { Search } from 'geist-native-icons';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { Check } from 'geist-native-icons';
import { EmptyBox } from '@ledget/media/native';

import styles from './styles';
import { TextInputbase } from '../text-inputs/text-inputs';
import { TextInput } from '../text-inputs/text-inputs';
import type { ModalPickerProps, PickerOption, TContext } from './types';
import { Icon } from '../../restyled/Icon';
import { Text } from '../../restyled/Text';
import { Modal } from '../../containers/modal/Modal';
import { Box } from '../../restyled/Box';
import { Button } from '../../restyled/Button';
import { Seperator } from '../../restyled/Seperator';
import { CustomScrollView } from '../../containers/custom-scroll-view/CustomScrollView';
import OutsidePressHandler from 'react-native-outside-press';

const ModalPickerContext = createContext<TContext | undefined>(undefined);

export function useModalPicker() {
  const context = useContext(ModalPickerContext);
  if (context === undefined) {
    throw new Error('useModalPicker must be used within a ModalPickerProvider');
  }
  return context;
}

export function ModalPickerProvider({ children }: { children: React.ReactNode }) {
  const [showModalOverlay, setShowModalOverlay] = useState(false);
  const [modalKey, setModalKey] = useState(Math.random().toString().slice(2, 6));
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (showModalOverlay) {
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      setModalKey(Math.random().toString().slice(2, 6));
    }
  }, [showModalOverlay]);

  return (
    <ModalPickerContext.Provider value={{ setShowModalOverlay }}>
      {showModalOverlay &&
        <Animated.View style={[{ opacity }, styles.modalOverlayContainer]} key={modalKey}>
          <Box backgroundColor='modalOverlay' style={[StyleSheet.absoluteFillObject, styles.modalOverlay]} />
        </Animated.View>}
      {children}
    </ModalPickerContext.Provider>
  );
}

function ModalPopUp<O extends PickerOption, TMultiple extends boolean>(
  props: ModalPickerProps<O, TMultiple> &
  { value?: O[] | O, setValue: (value?: O[] | O) => void, onClose?: () => void, open: boolean }
) {

  const {
    options,
    multiple,
    searchable,
    header,
    labelKey,
    value,
    setValue,
    onClose,
    open,
    renderOption
  } = props;

  const searchRef = useRef<NativeTextInput>(null);
  const [searchValue, setSearchValue] = useState('');
  const [localOptions, setLocalOptions] = useState(options);

  useEffect(() => {
    if (!searchValue) {
      setLocalOptions(options);
      return;
    };

    setLocalOptions(options?.filter(option => {
      if (typeof option === 'string') {
        return option.toLowerCase().includes(searchValue.toLowerCase());
      } else {
        return option[(labelKey as string) || 'label'].toLowerCase().includes(searchValue.toLowerCase());
      }
    }));
  }, [searchValue, options]);

  return (
    <>
      <NativeModal
        presentationStyle='overFullScreen'
        visible={open}
        transparent={true}
        animationType='slide'
      >
        <Modal onClose={onClose} position='bottomFloat'>
          <></>
          {header &&
            <>
              <Text variant='bold' fontSize={18} style={styles.header}>{header}</Text>
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
          {!localOptions?.length
            ?
            <View style={styles.emptyScrollView}>
              <EmptyBox size={64} />
            </View>
            :
            <CustomScrollView style={styles.scrollView}>
              {localOptions?.map((option, index) => {
                const label = typeof option === 'object' ? option['label' || labelKey] : option;
                const selected = Array.isArray(value) ? value.includes(option) : value === option;
                if (renderOption) {
                  return (
                    <TouchableOpacity
                      key={`${label}-${Math.random().toString().slice(2, 6)}`}
                      activeOpacity={.6}
                      onPress={() => {
                        const inCluded = Array.isArray(value) ? value.includes(option) : value === option;
                        if (inCluded) {
                          setValue(Array.isArray(value) ? value.filter(item => item !== option) : undefined);
                        } else {
                          multiple
                            ? Array.isArray(value) ? setValue([...value, option]) : setValue([option])
                            : setValue(option as any);
                        }
                      }}
                    >
                      <View style={styles.option}>
                        {renderOption(option, index, selected)}
                        <View style={styles.selectedIcon}>
                          {selected && <Icon icon={Check} color='blueButton' strokeWidth={2} />}
                        </View>
                      </View>
                      {index !== (options?.length || 0) - 1 &&
                        <Seperator variant='bare' backgroundColor='menuSeperator' />}
                    </TouchableOpacity>
                  )
                }
                return (
                  <>
                    <TouchableOpacity
                      activeOpacity={.6}
                      key={`${label}-${Math.random().toString().slice(2, 6)}`}
                      style={styles.option}
                      onPress={() => {
                        const inCluded = Array.isArray(value) ? value.includes(option) : value === option;
                        if (inCluded) {
                          setValue(Array.isArray(value) ? value.filter(item => item !== option) : undefined);
                        } else {
                          multiple
                            ? Array.isArray(value) ? setValue([...value, option]) : setValue([option])
                            : setValue(option as any);
                        }
                      }}
                    >
                      <Text>{label}</Text>
                      <View style={styles.selectedIcon}>
                        {selected && <Icon icon={Check} color='blueButton' strokeWidth={2} />}
                      </View>
                    </TouchableOpacity>
                    {index !== (options?.length || 0) - 1 && <Seperator variant='bare' backgroundColor='menuSeperator' />}
                  </>
                );
              })}
            </CustomScrollView>
          }
          {((Array.isArray(value) && value.length > 0) || value) &&
            <View style={styles.clearButton}>
              <Button
                onPress={() => { setValue(undefined) }}
                textColor='blueText'
                label='Clear'
              />
            </View>}
        </Modal>
      </NativeModal>
    </>
  );
};

function Selected({
  value,
  renderSelected,
  labelKey,
  placeholder
}: {
  value: any,
  renderSelected?: (item: any, index: number) => React.ReactNode,
  labelKey?: string | number
  placeholder?: string
}) {

  return (
    <>
      {value
        ?
        renderSelected
          ? Array.isArray(value)
            ? <View style={styles.defaultSelectedItems}>
              {value.map((item, index) => renderSelected(item, index))}
            </View>
            : renderSelected(value, 0)
          : Array.isArray(value)
            ?
            <View style={styles.defaultSelectedItems}>
              {value.map((item, index) => {
                const label = typeof item === 'object' ? item[labelKey || 'label'] : item;
                return (
                  <Text key={`${label}-${Math.random().toString().slice(2, 6)}`}>
                    {label}
                  </Text>
                )
              })}
            </View>
            :
            <Text>
              {typeof value === 'object' ? value[(labelKey as any) || 'label'] : value}
            </Text>
        :
        <Text color={
          Array.isArray(value)
            ? value.length > 0 ? 'mainText' : 'placeholderText'
            : value ? 'mainText' : 'placeholderText'}
        >
          {`${placeholder || 'Select...'}`}
        </Text>}
    </>
  )
}

export function ModalPicker<O extends PickerOption, TMultiple extends boolean>(props: ModalPickerProps<O, TMultiple>) {
  const {
    onChange,
    renderSelected,
    error,
    label,
    labelKey,
    valueKey
  } = props;
  const [value, setValue] = useState<O[] | O>();
  const { setShowModalOverlay } = useModalPicker();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (onChange) {
      onChange(
        Array.isArray(value)
          ? value.map(item => typeof item === 'object' ? item[valueKey || 'value'] : item)
          : typeof value === 'object' ? value[(valueKey as any) || 'value'] : value
      )
    }
  }, [value]);

  return (
    <TextInputbase
      label={label}
      error={error}
      focused={openModal}>
      <TouchableOpacity
        style={styles.placeholderButton}
        activeOpacity={.6}
        onPress={() => {
          setOpenModal(true);
          setShowModalOverlay(true);
        }}
      >
        <Selected value={value} renderSelected={renderSelected} labelKey={labelKey} />
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
      <ModalPopUp
        {...props}
        open={openModal}
        value={value}
        setValue={setValue}
        onClose={() => {
          setOpenModal(false)
          setShowModalOverlay(false)
        }}
      />
    </TextInputbase>
  );
}

