import { useEffect, useState, useCallback } from 'react';
import { View, Modal, TouchableOpacity } from 'react-native'
import { useForm, Controller, useController, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Emoji, Plus, Edit, Edit3 } from 'geist-native-icons';
import Big from 'big.js';
import { useTransition } from '@react-spring/native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';

import sharedStyles from './styles/shared';
import styles from './styles/add-categories';
import { OnboardingScreenProps } from '@/types'
import {
  Button,
  Box,
  Text,
  TabsTrack,
  EmojiPicker,
  TextInput,
  TextInputbase,
  ModalPicker,
  Icon,
  MoneyInput,
  DollarCents,
  CustomScrollView,
  LoadingDots,
  BillCatEmoji,
  BillCatLabel,
  InputLabel,
  SwipeDelete,
  AnimatedView
} from '@ledget/native-ui';
import { Tags } from '@ledget/media/native';
import { Category, useAddNewCategoryMutation, useGetCategoriesQuery, selectBudgetMonthYear } from '@ledget/shared-features';
import { categorySchema } from '@ledget/form-schemas';
import { useAppSelector } from '@hooks';
import { yearRecommendations, monthRecommendations } from './suggestedCategories';

const Row = (
  { category, index, onDelete }:
    {
      category: Category,
      onDelete: () => void,
      index: number
    }
) => {

  return (
    <SwipeDelete onDeleted={onDelete}>
      <Box
        backgroundColor='nestedContainer'
        borderTopColor='nestedContainerSeperator'
        borderTopWidth={index === 0 ? 0 : 1.5}
        style={styles.row}
      >
        <View><BillCatEmoji emoji={category.emoji} period={category.period} /></View>
        <Text>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</Text>
        {Number.isFinite(category.limit_amount)
          ?
          <View style={styles.amount}>
            <DollarCents value={Big(category.limit_amount || 0).toNumber()} withCents={false} />
          </View>
          :
          <View style={styles.editAmount}>
            <Button
              variant='square'
              backgroundColor='nestedContainerSeperator'
              icon={<Icon icon={Edit3} color='secondaryText' size={24} />}
            />
          </View>
        }
      </Box>
    </SwipeDelete>
  )
}

const AddCategories = (props: OnboardingScreenProps<'AddCategories'>) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear)

  const { data: categoriesData, isLoading } = useGetCategoriesQuery({ month, year, spending: false }, { skip: !month || !year })
  const [addNewCategory] = useAddNewCategoryMutation()
  const { control, handleSubmit, setValue } = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema)
  });
  const emoji = useWatch({ control, name: 'emoji' });
  const { field: { onChange: onEmojiChange }, formState: { errors } } = useController({ control, name: 'emoji' });

  const [categories, setCategories] = useState<Category[]>([])
  const [tabIndex, setTabIndex] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [showSuggestionsGrid, setShowSuggestionsGrid] = useState(true)
  const suggestionsContainerMaxHeight = useSharedValue(1000)
  const suggestionsContainerOpacity = useSharedValue(1)
  const categoriesTableMaxHeight = useSharedValue(0)
  const categoriesTableOpacity = useSharedValue(0)

  const suggestionsContainerStyle = useAnimatedStyle(() => ({
    maxHeight: suggestionsContainerMaxHeight.value,
    opacity: suggestionsContainerOpacity.value
  }));

  const categoriesTableStyle = useAnimatedStyle(() => ({
    maxHeight: categoriesTableMaxHeight.value,
    opacity: categoriesTableOpacity.value
  }));

  const handleFinalSubmit = () => {
    const addedCategories = [...categories.filter(c => !categoriesData?.some(cd => cd.id === c.id))]
    if (addedCategories.length > 0) {
      addNewCategory(addedCategories)
    }
  }

  const [transitions, api] = useTransition(categories, () => ({
    keys: categories.map(c => c.id || c.name),
    from: { maxHeight: 300, opacity: 1 },
    enter: { maxHeight: 300, opacity: 1 },
    update: (item) => {
      const isActive = (tabIndex === 0 && item.period === 'month') || (tabIndex === 1 && item.period === 'year')
      return { maxHeight: isActive ? 300 : 0, opacity: isActive ? 1 : 0 }
    },
    leave: { maxHeight: 0, opacity: 0 }
  }));

  const handeBillCatPress = (category: typeof monthRecommendations[0], period: Category['period']) => {
    setCategories(prev => {
      if (prev.some(c => c.name === category.name)) {
        return prev.filter(c => c.name !== category.name)
      } else {
        return [...prev, { ...category, period } as Category]
      }
    })
  };

  const onDelete = (category: Category) => {
    setCategories(prev => prev.filter(c => c.id ? c.id !== category.id : c.name !== category.name))
    api.start();
  }

  useEffect(() => {
    if (showSuggestionsGrid) {
      categoriesTableOpacity.value = withTiming(0, { duration: 500 })
      categoriesTableMaxHeight.value = withDelay(500, withTiming(0, { duration: 800 }))
      suggestionsContainerMaxHeight.value = withDelay(1000, withTiming(800, { duration: 800 }))
      suggestionsContainerOpacity.value = withDelay(1400, withTiming(1, { duration: 500 }))
    } else {
      suggestionsContainerOpacity.value = withTiming(0, { duration: 500 })
      suggestionsContainerMaxHeight.value = withDelay(500, withTiming(0, { duration: 800 }))
      categoriesTableMaxHeight.value = withDelay(1000, withTiming(800, { duration: 800 }))
      categoriesTableOpacity.value = withDelay(1400, withTiming(1, { duration: 500 }))
    }
  }, [showSuggestionsGrid])

  useEffect(() => {
    if (tabIndex === 0) {
      setValue('period', 'month')
    } else {
      setValue('period', 'year')
    }
  }, [tabIndex])

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData)
      api.start((index, item: any) => {
        if ((tabIndex === 0 && item._item.period === 'month') || (tabIndex === 1 && item._item.period === 'year')) {
          return { maxHeight: 300, opacity: 1, config: { duration: 1000 } }
        } else {
          return ({ maxHeight: 0, opacity: 0, config: { duration: 1000 } })
        }
      })
    }
  }, [categoriesData,])

  useEffect(() => {
    api.start((index, item: any) => {
      if ((tabIndex === 0 && item._item.period === 'month') || (tabIndex === 1 && item._item.period === 'year')) {
        return { maxHeight: 300, opacity: 1, config: { duration: 1000 } }
      } else {
        return { maxHeight: 0, opacity: 0, config: { duration: 1000 } }
      }
    })
  }, [tabIndex, showSuggestionsGrid])

  return (
    <Box variant='screen'>
      <View style={[sharedStyles.mainContainer]}>
        <View>
          <Text fontSize={24} lineHeight={28} variant='geistSemiBold' marginTop='xxxl' marginBottom='s'>
            Add Categories
          </Text>
          <Text color='secondaryText'>
            Add a few categories to get started. You can always add more later.
          </Text>
        </View>
        <Box variant='nestedContainer' style={styles.form}>
          <Animated.View style={[categoriesTableStyle, styles.form]}>
            <Box
              style={styles.tabsBox}
              backgroundColor='nestedContainer'
              shadowColor='nestedContainer'
              shadowOffset={{ width: 0, height: 0 }}
              shadowOpacity={1}
              shadowRadius={16}
            >
              <TabsTrack onIndexChange={setTabIndex} containerStyle={styles.tabs}>
                <TabsTrack.Tab index={0}>
                  {({ selected }) => (
                    <Text color={selected ? 'mainText' : 'secondaryText'}>
                      Monthly
                    </Text>
                  )}
                </TabsTrack.Tab>
                <TabsTrack.Tab index={1}>
                  {({ selected }) => (
                    <Text color={selected ? 'mainText' : 'secondaryText'}>
                      Yearly
                    </Text>
                  )}
                </TabsTrack.Tab>
              </TabsTrack>
            </Box>
            <View style={styles.table}>
              {transitions.length > 0
                ?
                <CustomScrollView style={styles.scrollView} >
                  {transitions((style, category, _, index) => (
                    <AnimatedView style={style}>
                      <Row
                        onDelete={() => onDelete(category)}
                        category={category}
                        index={index}
                      />
                    </AnimatedView>
                  ))}
                </CustomScrollView>
                : isLoading
                  ? <LoadingDots visible={true} />
                  : <Text textAlign='center' color='tertiaryText'>No categories yet</Text>
              }
            </View>
            <View style={styles.bottomFormButtons}>
              <Button
                variant='rectangle'
                label='New Category'
                textColor='blueText'
                labelPlacement='left'
                onPress={() => setShowModal(true)}
                icon={<Icon icon={Plus} color='blueText' strokeWidth={2} size={16} />}
              />
              <Button
                variant='square'
                backgroundColor='nestedContainerSeperator'
                onPress={() => setShowSuggestionsGrid(true)}
                icon={<Icon icon={Tags} color='tertiaryText' borderColor='tertiaryText' strokeWidth={0} size={24} />}
              />
            </View>
          </Animated.View>
          <Animated.View style={[suggestionsContainerStyle, styles.suggestionsGrid]}>
            <CustomScrollView contentContainerStyle={styles.suggestionsScrollView}>
              {monthRecommendations.map((category, index) => (
                <TouchableOpacity
                  style={styles.suggestionOption}
                  onPress={() => handeBillCatPress(category, 'month')}
                >
                  <BillCatLabel
                    selected={categories.some(c => c.name === category.name)}
                    emoji={category.emoji}
                    name={category.name}
                    key={`month-suggestion-${index}`}
                    period='month'
                  />
                </TouchableOpacity>
              ))}
              {yearRecommendations.map((category, index) => (
                <TouchableOpacity
                  style={styles.suggestionOption}
                  onPress={() => handeBillCatPress(category, 'year')}
                >
                  <BillCatLabel
                    selected={categories.some(c => c.name === category.name)}
                    emoji={category.emoji}
                    name={category.name}
                    key={`year-suggestion-${index}`}
                    period='year'
                  />
                </TouchableOpacity>
              ))}
              <Button
                label='Custom'
                backgroundColor='mediumGrayButton'
                variant='rectangle'
                paddingVertical='xs'
                marginTop='xs'
                textColor='secondaryText'
                labelPlacement='left'
                icon={<Icon icon={Edit} color='secondaryText' strokeWidth={2} size={16} />}
                onPress={() => setShowSuggestionsGrid(false)}
              />
            </CustomScrollView>
            <View style={styles.legend}>
              <Box backgroundColor='monthColor' style={styles.dot} />
              <Text color='tertiaryText' fontSize={15}>Monthly Category</Text>
              <Box backgroundColor='yearColor' style={styles.dot} />
              <Text color='tertiaryText' fontSize={15}>Yearly Category</Text>
            </View>
          </Animated.View>
        </Box>
      </View>
      <Modal
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        animationType='slide'
        presentationStyle='pageSheet'
        transparent={true}
        style={styles.modal}
      >
        <Box
          backgroundColor='modalBox'
          paddingHorizontal='pagePadding'
          style={styles.modal}
        >
          <EmojiPicker value={emoji} onChange={onEmojiChange} title='Emoji' as='inline'>
            <View style={styles.dragBarContainer}>
              <View style={styles.dragBar}>
                <Box variant='dragBar' />
              </View>
            </View>
            <Text fontSize={24} lineHeight={28} marginTop='xxxl' marginBottom='l'>
              New Category
            </Text>
            <View>
              <InputLabel>Name</InputLabel>
              <View style={styles.emojiButton}>
                <EmojiPicker.Trigger>
                  <TextInputbase>
                    {emoji
                      ? <Text>{emoji}</Text>
                      : <Icon icon={Emoji} color='placeholderText' size={24} />}
                  </TextInputbase>
                </EmojiPicker.Trigger>
              </View>
              <View style={styles.nameInput}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder='Name'
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.name}
                    />
                  )}
                  name='name'
                  rules={{ required: 'Category name is required' }}
                />
              </View>
            </View>
            <Controller
              name='period'
              render={({ field }) => (
                <ModalPicker
                  label='Period'
                  chevronDirection='down'
                  isFormInput={true}
                  header='Period'
                  valueKey={'value'}
                  defaultValue={{ value: field.value, label: field.value === 'month' ? 'Monthly' : 'Yearly' }}
                  onChange={field.onChange}
                  options={[
                    { label: 'Monthly', value: 'month' },
                    { label: 'Yearly', value: 'year' }
                  ]}
                />
              )}
              control={control}
            />
            <Controller
              name='limit_amount'
              render={({ field }) => (
                <MoneyInput
                  label='Limit'
                  defaultValue={field.value}
                  onChange={(v) => {
                    field.onChange(Big(v || 0).times(100).toNumber())
                  }}
                  inputType='single'
                  error={errors.limit_amount}
                  accuracy={2}
                />
              )}
              control={control}
            />
            <Button
              variant='main'
              label='Save'
              onPress={handleSubmit((data) => {
                setCategories([...categories, data as Category])
              })}
            />
          </EmojiPicker>
        </Box>
      </Modal>
      <Box paddingBottom='xxxxl'>
        <Button
          label='Done'
          variant='main'
          onPress={() => {
            handleFinalSubmit()
            props.navigation.navigate('AddBills')
          }}
        />
        <Button
          label='Skip'
          backgroundColor='transparent'
          variant='grayMain'
          onPress={() => props.navigation.navigate('AddBills')}
        />
      </Box>
    </Box>
  )
}

export default AddCategories
