import { createContext, useContext, useState, useMemo, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  SectionList,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Search } from 'geist-native-icons';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { groupBy } from 'lodash-es';

import styles from './styles/modal';
import { charFromEmojiObject, emojis } from '../helpers';
import { Box } from '../../../restyled/Box';
import { Text } from '../../../restyled/Text';
import { Icon } from '../../../restyled/Icon';
import { TextInput } from '../../../inputs/text-inputs/text-inputs';
import { CustomSectionList } from '../../../containers/custom-section-list/CustomSectionList';
import type { NativeEmojiPickerProps, Context } from './types';
import type { Emoji } from '../types';
import { categories } from '../constants';
import Header from './Header';
import EmojiCell from './EmojiCell';
import CategoryPicker from './CategoryPicker';

const pickerModalContext = createContext<Context | undefined>(undefined);

const EmojiPicker = (props: NativeEmojiPickerProps) => {
  const [visible, setVisible] = useState(false);
  const { as = 'modal' } = props;

  return (
    <pickerModalContext.Provider value={{ visible, setVisible }}>
      {as === 'modal' ? (
        <EmojiPickerModal {...props}>{props.children}</EmojiPickerModal>
      ) : (
        <>
          {props.children}
          {visible && (
            <Animated.View
              entering={SlideInDown.withInitialValues({ opacity: 0 }).duration(
                500
              )}
              exiting={SlideOutDown.duration(500).withInitialValues({
                opacity: 1,
              })}
              style={[StyleSheet.absoluteFill, styles.modal]}
            >
              <EmojiPickerContent {...props} />
            </Animated.View>
          )}
        </>
      )}
    </pickerModalContext.Provider>
  );
};

function Trigger({ children }: { children: React.ReactNode }) {
  const { setVisible } = useEmojiPickerContext();

  return (
    <TouchableOpacity onPress={() => setVisible(true)}>
      {children}
    </TouchableOpacity>
  );
}

export function useEmojiPickerContext() {
  const context = useContext(pickerModalContext);
  if (!context) {
    throw new Error(
      'useEmojiPickerContext must be used within a PickerModalProvider'
    );
  }
  return context;
}

function EmojiPickerContent(props: NativeEmojiPickerProps) {
  const { numColumns = Platform.OS === 'ios' ? 8 : 7 } = props;

  const ref = useRef<SectionList>(null);
  const { setVisible } = useEmojiPickerContext();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [searchValue, setSearchValue] = useState('');
  const theme = useTheme();

  const sections = useMemo(() => {
    const groupedEmojis = groupBy(emojis, 'category');
    return categories
      .map((category) => ({
        category,
        data: groupedEmojis[category] || [],
      }))
      .map((section) => ({
        ...section,
        data: section.data.reduce(
          (acc, emoji) => {
            if (acc[acc.length - 1].length === numColumns) {
              acc.push([]);
            }
            acc[acc.length - 1].push(emoji);
            return acc;
          },
          [[]] as Emoji[][]
        ),
      }));
  }, [emojis]);

  return (
    <Box
      style={styles.main}
      backgroundColor="modalBox"
      paddingHorizontal="pagePadding"
    >
      <View
        style={[
          styles.main,
          { paddingTop: props.as === 'modal' ? theme.spacing.statusBar : 16 },
        ]}
      >
        <Header
          onRemove={() => {
            props.onChange && props.onChange('');
            setVisible(false);
          }}
          onClose={() => {
            setVisible(false);
            props.onClose && props.onClose();
          }}
          title={props.title}
        />
        <TextInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Search..."
          style={styles.searchInput}
        >
          <View style={styles.searchIcon}>
            <Icon icon={Search} color="placeholderText" />
          </View>
        </TextInput>
        {searchValue ? (
          <FlatList
            data={emojis
              .filter((item) =>
                item.name
                  .split(' ')
                  .some((word) =>
                    word.toLowerCase().startsWith(searchValue.toLowerCase())
                  )
              )
              .reduce(
                (acc, emoji) => {
                  if (acc[acc.length - 1].length === numColumns) {
                    acc.push([]);
                  }
                  acc[acc.length - 1].push(emoji);
                  return acc;
                },
                [[]] as Emoji[][]
              )}
            renderItem={({ item }) => (
              <View style={styles.row}>
                {item.map((emoji) => (
                  <EmojiCell
                    key={charFromEmojiObject(emoji)}
                    emoji={emoji}
                    onPress={() => {
                      props.onChange &&
                        props.onChange(charFromEmojiObject(emoji));
                      setVisible(false);
                    }}
                  />
                ))}
              </View>
            )}
            keyExtractor={(_, index) => index.toString()}
          />
        ) : (
          <>
            <CategoryPicker
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <CustomSectionList
              ref={ref}
              contentContainerStyle={styles.sectionListContent}
              showsVerticalScrollIndicator={false}
              style={styles.sectionList}
              sections={sections}
              stickySectionHeadersEnabled={true}
              bounces={true}
              overScrollMode="always"
              renderSectionHeader={({ section: { category } }) => (
                <Box backgroundColor="modalBox" style={styles.sectionHeader}>
                  <Text variant="label" color="secondaryText">
                    {category}
                  </Text>
                </Box>
              )}
              onViewableItemsChanged={({ viewableItems, changed }) => {
                if (changed.length > 1 && viewableItems.length > 0) {
                  setSelectedCategory(viewableItems[0].section.category);
                }
              }}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  {item.map((emoji: any) => (
                    <EmojiCell
                      key={charFromEmojiObject(emoji)}
                      emoji={emoji}
                      onPress={() => {
                        props.onChange &&
                          props.onChange(charFromEmojiObject(emoji));
                        setVisible(false);
                      }}
                    />
                  ))}
                </View>
              )}
              keyExtractor={(_, index) => index.toString()}
            />
          </>
        )}
      </View>
    </Box>
  );
}

function EmojiPickerModal(props: NativeEmojiPickerProps) {
  const { visible } = useEmojiPickerContext();

  return (
    <>
      {props.children}
      {visible && (
        <Modal
          presentationStyle="fullScreen"
          animationType="slide"
          visible={visible}
          style={styles.modal}
        >
          <EmojiPickerContent {...props} />
        </Modal>
      )}
    </>
  );
}

EmojiPicker.Trigger = Trigger;
EmojiPicker.Content = EmojiPickerContent;

export default EmojiPicker;
