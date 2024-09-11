import { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, View, TextInput as NativeTextInput, Modal as NativeModal, ScrollView } from 'react-native';
import { Search } from 'geist-native-icons';
import { Check } from 'geist-native-icons';
import { EmptyBox } from '@ledget/media/native';
import { dequal } from 'dequal';
import { useTheme } from '@shopify/restyle';

import styles from './styles';
import { TextInput } from '../text-inputs/text-inputs';
import type { ModalPopUpProps, PickerOption } from './types';
import { Icon } from '../../restyled/Icon';
import { Text } from '../../restyled/Text';
import { Modal } from '../../containers/modal/Modal';
import { Button } from '../../restyled/Button';
import { Seperator } from '../../restyled/Seperator';
import { CustomScrollView } from '../../containers/custom-scroll-view/CustomScrollView';
import OutsidePressHandler from 'react-native-outside-press';

function ModalPopUp<O extends PickerOption, TMultiple extends boolean>(
  props: ModalPopUpProps<O, TMultiple>) {

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
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [localOptions, setLocalOptions] = useState(options);
  const theme = useTheme();

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

  const handleClose = () => {
    onClose && value && onClose(value as any);
  }

  // Scroll to position of first selected option if any
  useEffect(() => {
    let t: NodeJS.Timeout;
    if (value && scrollViewRef.current) {
      t = setTimeout(() => {
        const index = localOptions?.findIndex(option => dequal(option, value)) || 0;
        const totalOptions = localOptions?.length || 0;
        if (index !== -1) {
          scrollViewRef.current?.scrollTo({
            y: (index / totalOptions) * scrollHeight,
            animated: false
          });
        }
      }, 100);
    }
    return () => clearTimeout(t)
  }, [value, localOptions, scrollHeight, open]);


  return (
    <>
      <NativeModal
        presentationStyle='overFullScreen'
        visible={open}
        transparent={true}
        animationType='slide'
      >
        <Modal onClose={handleClose} position='bottomFloat'>
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
              <EmptyBox size={64} dark={theme.colors.mode === 'dark'} />
            </View>
            :
            <CustomScrollView
              ref={scrollViewRef}
              onContentSizeChange={(_, height) => setScrollHeight(height)}
              style={styles.scrollView}>
              {localOptions?.map((option, index) => {
                const label = typeof option === 'object' ? option['label' || labelKey] : option;
                const selected = Array.isArray(value) ? value.some(v => dequal(v, option)) : dequal(value, option);

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
                          {selected && <Icon icon={Check} color='blueText' strokeWidth={2} />}
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
          {((Array.isArray(value) && value.length > 0) || value) && multiple &&
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

export default ModalPopUp;
