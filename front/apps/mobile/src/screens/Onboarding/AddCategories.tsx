import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useForm, Controller, useController, useWatch } from 'react-hook-form';
import ReAnimated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient, Canvas, Rect, vec } from '@shopify/react-native-skia';
import { z } from 'zod';
import { Emoji, Edit } from 'geist-native-icons';
import { BlurView } from 'expo-blur';
import { useTheme } from '@shopify/restyle';
import Big from 'big.js';

import sharedStyles from './styles/shared';
import styles from './styles/add-categories';
import { OnboardingScreenProps } from '@/types';
import {
  Button,
  Box,
  Text,
  EmojiPicker,
  TextInput,
  TextInputbase,
  ModalPicker,
  Icon,
  MoneyInput,
  BillCatLabel,
  InputLabel,
} from '@ledget/native-ui';
import {
  Category,
  useAddNewCategoryMutation,
  useGetCategoriesQuery,
  selectBudgetMonthYear,
  isCategory,
} from '@ledget/shared-features';
import { categorySchema } from '@ledget/form-schemas';
import { useAppSelector } from '@hooks';
import {
  yearRecommendations,
  monthRecommendations,
} from './suggestedCategories';
import { useAppearance } from '@/features/appearanceSlice';

const GAP = 10;

const AddCategories = (props: OnboardingScreenProps<'AddCategories'>) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const { mode } = useAppearance();
  const theme = useTheme();

  const { data: categoriesData } = useGetCategoriesQuery(
    { month, year, spending: false },
    { skip: !month || !year }
  );
  const [addNewCategory] = useAddNewCategoryMutation();
  const { control, handleSubmit, setValue, reset } = useForm<
    z.infer<typeof categorySchema>
  >({
    resolver: zodResolver(categorySchema),
  });
  const emoji = useWatch({ control, name: 'emoji' });
  const name = useWatch({ control, name: 'name' });
  const {
    field: { onChange: onEmojiChange },
    formState: { errors },
  } = useController({ control, name: 'emoji' });

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollHeight = useRef(0);
  const touchablePagePositions = useRef<number[]>([]);
  const [, setRowsMeasured] = useState(Math.random());
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategories, setCurrentCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showFloatingAmountInput, setShowFloatingAmountInput] = useState(false);

  const handleFinalSubmit = () => {
    const addedCategories = [
      ...categories.filter(
        (c) => !categoriesData?.some((cd) => cd.id === c.id)
      ),
    ];
    if (addedCategories.length > 0) {
      addNewCategory(addedCategories);
    }
  };

  const handlePress = (
    item: Category | { name: string; emoji: string; period: Category['period'] }
  ) => {
    if (
      categories.some((c) =>
        isCategory(item) ? c.id === item.id : c.name === item.name
      )
    ) {
      setCategories(
        categories.filter((c) =>
          isCategory(item) ? c.id !== item.id : c.name !== item.name
        )
      );
    } else {
      setValue('name', item.name);
      setValue('emoji', item.emoji);
      setValue('period', item.period);
      setShowFloatingAmountInput(true);
    }
  };

  const clearForm = () => {
    handleSubmit((data) => {
      setCategories([...categories, data as Category]);
    })();
  };

  useEffect(() => {
    if (categoriesData) {
      setCurrentCategories(categoriesData);
      setTimeout(() => {
        setRowsMeasured(Math.random());
      }, 1000);
    }
  }, [categoriesData]);

  return (
    <Box variant="screen">
      <View style={[sharedStyles.mainContainer]}>
        <View style={sharedStyles.header}>
          <Text fontSize={28} lineHeight={32} variant="bold">
            Add Categories
          </Text>
          <Text color="secondaryText">
            Add a few categories to get started. You can always add more later.
          </Text>
        </View>
        <Box variant="nestedContainer" style={styles.form}>
          {showFloatingAmountInput && (
            <ReAnimated.View
              entering={FadeIn}
              exiting={FadeOut}
              style={[StyleSheet.absoluteFill, styles.blurViewContainer]}
            >
              <BlurView
                intensity={70}
                style={[StyleSheet.absoluteFill, styles.blurView]}
                tint={mode === 'dark' ? 'dark' : 'light'}
              >
                <Controller
                  name="limit_amount"
                  render={({ field }) => (
                    <ReAnimated.View
                      style={styles.floatingAmountInput}
                      entering={SlideInDown.withInitialValues({ originY: 300 })
                        .springify()
                        .damping(21)
                        .stiffness(200)}
                      exiting={SlideOutDown.withInitialValues({ originY: 300 })}
                    >
                      <Box
                        style={styles.floatingAmountInput}
                        shadowColor="mainBackground"
                        shadowOpacity={0.7}
                        shadowRadius={8}
                        shadowOffset={{ width: 0, height: 4 }}
                      >
                        <MoneyInput
                          autoFocus
                          label={`${emoji}  ${name} Limit`}
                          defaultValue={field.value}
                          onChange={(v) => {
                            field.onChange(
                              Big(v || 0)
                                .times(100)
                                .toNumber()
                            );
                          }}
                          onBlur={(e) => {
                            if (e.nativeEvent.text !== '') {
                              clearForm();
                            } else {
                              reset();
                            }
                            setShowFloatingAmountInput(false);
                          }}
                          inputType="single"
                          error={errors.limit_amount}
                          accuracy={2}
                        />
                      </Box>
                    </ReAnimated.View>
                  )}
                  control={control}
                />
              </BlurView>
            </ReAnimated.View>
          )}
          <View style={[styles.suggestionsGrid]}>
            <View style={styles.legend}>
              <Box backgroundColor="monthColor" style={styles.dot} />
              <Text color="tertiaryText" fontSize={15}>
                Monthly
              </Text>
              <Box backgroundColor="yearColor" style={styles.dot} />
              <Text color="tertiaryText" fontSize={15}>
                Yearly
              </Text>
            </View>
            <View
              onLayout={(e) => {
                scrollHeight.current = e.nativeEvent.layout.height;
              }}
              style={styles.suggestionsFlatListContainer}
            >
              <Canvas style={[sharedStyles.topMask, sharedStyles.mask]}>
                <Rect
                  x={0}
                  y={0}
                  width={Dimensions.get('window').width}
                  height={38}
                >
                  <LinearGradient
                    colors={[
                      theme.colors.blueChartGradientEnd,
                      theme.colors.nestedContainer,
                      theme.colors.nestedContainer,
                    ]}
                    start={vec(0, 38)}
                    end={vec(0, 0)}
                  />
                </Rect>
              </Canvas>
              <Animated.FlatList
                style={[styles.flatList]}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                  sharedStyles.suggestionsFlatListContent,
                  { gap: GAP },
                ]}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                  { useNativeDriver: true }
                )}
                data={(
                  currentCategories as (
                    | Category
                    | {
                        name: string;
                        emoji: string;
                        period: Category['period'];
                      }
                  )[]
                ).concat(
                  monthRecommendations
                    .map((c) => ({ ...c, period: 'month' }))
                    .concat(
                      yearRecommendations.map((c) => ({ ...c, period: 'year' }))
                    )
                    .filter(
                      (c) =>
                        !currentCategories.some((cat) => cat.name === c.name)
                    )
                    .map(
                      (c) =>
                        c as {
                          name: string;
                          emoji: string;
                          period: Category['period'];
                        }
                    )
                )}
                renderItem={({ item, index }) => {
                  const row =
                    touchablePagePositions.current.length === 0
                      ? null
                      : touchablePagePositions.current.reduce(
                          (acc, pos, i) => {
                            if (i > index) return acc;
                            return acc[1] !== pos ? [acc[0] + 1, pos] : acc;
                          },
                          [-1, 0]
                        )[0];

                  const rows =
                    touchablePagePositions.current.length === 0
                      ? 0
                      : new Set(touchablePagePositions.current).size;
                  const itemHeight = scrollHeight.current / rows;

                  const inputRange =
                    row !== null
                      ? [
                          row * itemHeight - scrollHeight.current,
                          (row + 1) * itemHeight - scrollHeight.current,
                          row * itemHeight,
                          (row + 1) * itemHeight,
                        ]
                      : [-1, 0, 100, 100];
                  const scale = scrollY.interpolate({
                    inputRange,
                    outputRange: [0.5, 1, 1, 0.5],
                  });
                  const opacity = scrollY.interpolate({
                    inputRange,
                    outputRange: [0, 1, 1, 0],
                  });

                  return (
                    <Animated.View
                      style={[
                        styles.suggestionOption,
                        { transform: [{ scale }], opacity },
                      ]}
                      onLayout={(e) => {
                        e.target.measure(
                          (x, y, width, height, pageX, pageY) => {
                            touchablePagePositions.current[index] = pageY;
                          }
                        );
                      }}
                    >
                      <TouchableOpacity onPress={() => handlePress(item)}>
                        <BillCatLabel
                          selected={
                            currentCategories.some(
                              (c) => c.name === item.name
                            ) || categories.some((c) => c.name === item.name)
                          }
                          emoji={item.emoji}
                          name={item.name}
                          period={item.period}
                        />
                      </TouchableOpacity>
                    </Animated.View>
                  );
                }}
                keyExtractor={(c) => (isCategory(c) ? c.id : c.name)}
              />
              <Canvas style={[sharedStyles.bottomMask, sharedStyles.mask]}>
                <Rect
                  x={0}
                  y={0}
                  width={Dimensions.get('window').width}
                  height={38}
                >
                  <LinearGradient
                    colors={[
                      theme.colors.blueChartGradientEnd,
                      theme.colors.nestedContainer,
                      theme.colors.nestedContainer,
                    ]}
                    start={vec(0, 0)}
                    end={vec(0, 38)}
                  />
                </Rect>
              </Canvas>
            </View>
            <Button
              style={styles.customButton}
              label="Custom"
              backgroundColor="transparent"
              textColor="blueText"
              labelPlacement="left"
              icon={
                <Icon icon={Edit} color="blueText" strokeWidth={2} size={16} />
              }
              onPress={() => setShowModal(true)}
            />
          </View>
        </Box>
      </View>
      <Modal
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        animationType="slide"
        presentationStyle="pageSheet"
        transparent={true}
        style={sharedStyles.modal}
      >
        <Box
          backgroundColor="modalBox"
          paddingHorizontal="pagePadding"
          style={sharedStyles.modal}
        >
          <EmojiPicker
            value={emoji}
            onChange={onEmojiChange}
            title="Emoji"
            as="inline"
          >
            <View style={sharedStyles.dragBarContainer}>
              <View style={sharedStyles.dragBar}>
                <Box variant="dragBar" />
              </View>
            </View>
            <Text
              fontSize={24}
              lineHeight={28}
              marginTop="xxxl"
              marginBottom="l"
            >
              New Category
            </Text>
            <View>
              <InputLabel>Name</InputLabel>
              <View style={sharedStyles.emojiButton}>
                <EmojiPicker.Trigger>
                  <TextInputbase>
                    {emoji ? (
                      <Text>{emoji}</Text>
                    ) : (
                      <Icon icon={Emoji} color="placeholderText" size={24} />
                    )}
                  </TextInputbase>
                </EmojiPicker.Trigger>
              </View>
              <View style={sharedStyles.nameInput}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.name}
                    />
                  )}
                  name="name"
                  rules={{ required: 'Category name is required' }}
                />
              </View>
            </View>
            <Controller
              name="period"
              render={({ field }) => (
                <ModalPicker
                  label="Period"
                  chevronDirection="down"
                  isFormInput={true}
                  header="Period"
                  valueKey={'value'}
                  defaultValue={{
                    value: field.value,
                    label: field.value === 'month' ? 'Monthly' : 'Yearly',
                  }}
                  onChange={field.onChange}
                  options={[
                    { label: 'Monthly', value: 'month' },
                    { label: 'Yearly', value: 'year' },
                  ]}
                />
              )}
              control={control}
            />
            <Controller
              name="limit_amount"
              render={({ field }) => (
                <MoneyInput
                  label="Limit"
                  defaultValue={field.value}
                  onChange={(v) => {
                    field.onChange(
                      Big(v || 0)
                        .times(100)
                        .toNumber()
                    );
                  }}
                  inputType="single"
                  error={errors.limit_amount}
                  accuracy={2}
                />
              )}
              control={control}
            />
            <Button variant="main" label="Save" onPress={clearForm} />
          </EmojiPicker>
        </Box>
      </Modal>
      <Box paddingBottom="xxxxl">
        <Button
          label="Done"
          variant="main"
          onPress={() => {
            handleFinalSubmit();
            props.navigation.navigate('AddBills');
          }}
        />
        <Button
          label="Skip"
          backgroundColor="transparent"
          variant="grayMain"
          onPress={() => props.navigation.navigate('AddBills')}
        />
      </Box>
    </Box>
  );
};

export default AddCategories;
