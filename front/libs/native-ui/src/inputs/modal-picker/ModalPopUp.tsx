import { useState, useEffect, useRef, Fragment } from 'react';
import {
  TouchableOpacity,
  View,
  TextInput as NativeTextInput,
  Modal as NativeModal,
  ScrollView,
} from 'react-native';
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
  props: ModalPopUpProps<O, TMultiple>
) {
  const { showVerticalScrollIndicator = false } = props;

  const searchRef = useRef<NativeTextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [localOptions, setLocalOptions] = useState(props.options);
  const theme = useTheme();

  useEffect(() => {
    if (!searchValue) {
      setLocalOptions(props.options);
      return;
    }

    setLocalOptions(
      props.options?.filter((option) => {
        if (typeof option === 'string') {
          return option.toLowerCase().includes(searchValue.toLowerCase());
        } else {
          return option[(props.labelKey as string) || 'label']
            .toLowerCase()
            .includes(searchValue.toLowerCase());
        }
      })
    );
  }, [searchValue, props.options]);

  const handleClose = () => {
    props.onClose && props.value && props.onClose(props.value as any);
  };

  // Scroll to position of first selected option if any
  useEffect(() => {
    let t: NodeJS.Timeout;
    if (props.value && scrollViewRef.current) {
      t = setTimeout(() => {
        const index =
          localOptions?.findIndex((option) => dequal(option, props.value)) || 0;
        const totalOptions = localOptions?.length || 0;
        if (index !== -1) {
          scrollViewRef.current?.scrollTo({
            y: (index / totalOptions) * scrollHeight,
            animated: false,
          });
        }
      }, 100);
    }
    return () => clearTimeout(t);
  }, [props.value, localOptions, scrollHeight, props.open]);

  return (
    <>
      <NativeModal
        presentationStyle="overFullScreen"
        visible={props.open}
        transparent={true}
        animationType="slide"
      >
        <Modal onClose={handleClose} position="centerFloat" hasOverlay={false}>
          {props.header && (
            <View style={styles.header}>
              <Text variant="bold" fontSize={18}>
                {props.header}
              </Text>
              <Seperator variant="s" backgroundColor="modalSeperator" />
            </View>
          )}
          {props.searchable && (
            <OutsidePressHandler
              onOutsidePress={() => searchRef.current?.blur()}
            >
              <View style={styles.searchContainer}>
                <TextInput
                  value={searchValue}
                  onChangeText={setSearchValue}
                  placeholder="Search..."
                  style={styles.searchInput}
                  ref={searchRef}
                >
                  <View style={styles.searchIconContainer}>
                    <View style={styles.searchIcon}>
                      <Icon
                        icon={Search}
                        color={searchValue ? 'mainText' : 'placeholderText'}
                      />
                    </View>
                  </View>
                </TextInput>
              </View>
            </OutsidePressHandler>
          )}
          {!localOptions?.length ? (
            <View style={styles.emptyScrollView}>
              <EmptyBox size={64} dark={theme.colors.mode === 'dark'} />
            </View>
          ) : (
            <CustomScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={showVerticalScrollIndicator}
              onContentSizeChange={(_, height) => setScrollHeight(height)}
              style={styles.scrollView}
            >
              {localOptions?.map((option, index) => {
                const labelKey = (props.labelKey as string) || 'label';
                const label =
                  typeof option === 'object' ? option[labelKey] : option;
                const selected = Array.isArray(props.value)
                  ? props.value.some((v) => dequal(v, option))
                  : dequal(props.value, option);

                if (props.renderOption) {
                  return (
                    <TouchableOpacity
                      key={`${label}-${Math.random().toString().slice(2, 6)}`}
                      activeOpacity={0.6}
                      onPress={() => {
                        const inCluded = Array.isArray(props.value)
                          ? props.value.includes(option)
                          : props.value === option;
                        if (inCluded) {
                          props.setValue(
                            Array.isArray(props.value)
                              ? props.value.filter((item) => item !== option)
                              : undefined
                          );
                        } else {
                          props.multiple
                            ? Array.isArray(props.value)
                              ? props.setValue([...props.value, option])
                              : props.setValue([option])
                            : props.setValue(option as any);
                        }
                      }}
                    >
                      <View style={styles.option}>
                        {props.renderOption(option, index, selected)}
                        <View style={styles.selectedIcon}>
                          {selected && (
                            <Icon
                              icon={Check}
                              color="blueText"
                              strokeWidth={2}
                            />
                          )}
                        </View>
                      </View>
                      {index !== (props.options?.length || 0) - 1 && (
                        <Seperator
                          variant="bare"
                          backgroundColor="modalSeperator"
                        />
                      )}
                    </TouchableOpacity>
                  );
                }
                return (
                  <Fragment
                    key={`${label}-${Math.random().toString().slice(2, 6)}`}
                  >
                    <TouchableOpacity
                      activeOpacity={0.6}
                      style={styles.option}
                      onPress={() => {
                        const inCluded = Array.isArray(props.value)
                          ? props.value.includes(option)
                          : props.value === option;
                        if (inCluded) {
                          props.setValue(
                            Array.isArray(props.value)
                              ? props.value.filter((item) => item !== option)
                              : undefined
                          );
                        } else {
                          props.multiple
                            ? Array.isArray(props.value)
                              ? props.setValue([...props.value, option])
                              : props.setValue([option])
                            : props.setValue(option as any);
                        }
                      }}
                    >
                      <Text>{label}</Text>
                      <View style={styles.selectedIcon}>
                        {selected && (
                          <Icon icon={Check} color="blueText" strokeWidth={2} />
                        )}
                      </View>
                    </TouchableOpacity>
                    {index !== (props.options?.length || 0) - 1 && (
                      <Seperator
                        variant="bare"
                        backgroundColor="modalSeperator"
                      />
                    )}
                  </Fragment>
                );
              })}
            </CustomScrollView>
          )}
          {((Array.isArray(props.value) && props.value.length > 0) ||
            props.value) &&
            props.multiple && (
              <View style={styles.clearButton}>
                <Button
                  onPress={() => {
                    props.setValue(undefined);
                  }}
                  textColor="blueText"
                  label="Clear"
                />
              </View>
            )}
        </Modal>
      </NativeModal>
    </>
  );
}

export default ModalPopUp;
