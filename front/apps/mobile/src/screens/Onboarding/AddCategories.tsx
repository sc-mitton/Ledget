import { Fragment, useEffect, useState } from 'react';
import { View, KeyboardAvoidingView } from 'react-native'
import { useForm, Controller, useController, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Emoji } from 'geist-native-icons';
import Big from 'big.js';

import sharedStyles from './styles/shared';
import styles from './styles/add-categories';
import { OnboardingScreenProps } from '@/types'
import Animated, { StretchInY, StretchOutY } from 'react-native-reanimated';
import {
  Button,
  Box,
  Text,
  TabsTrack,
  Seperator,
  EmojiPicker,
  TextInput,
  Icon,
  MoneyInput,
  DollarCents,
  CustomScrollView,
  LoadingDots,
  BillCatEmoji
} from '@ledget/native-ui';
import { Category, useAddNewCategoryMutation, useGetCategoriesQuery, selectBudgetMonthYear } from '@ledget/shared-features';
import { categorySchema } from '@ledget/form-schemas';
import { useAppSelector } from '@hooks';

const AddCategories = (props: OnboardingScreenProps<'AddCategories'>) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear)

  const { data: categoriesData, isLoading } = useGetCategoriesQuery({ month, year, spending: false }, { skip: !month || !year })
  const [addNewCategory] = useAddNewCategoryMutation()

  const [categories, setCategories] = useState<Category[]>([])
  const [tabIndex, setTabIndex] = useState(0)

  const { control, handleSubmit, setValue } = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema)
  });
  const emoji = useWatch({ control, name: 'emoji' });
  const { field: { onChange: onEmojiChange }, formState: { errors } } = useController({ control, name: 'emoji' });

  useEffect(() => {
    if (tabIndex === 0) {
      setValue('period', 'month')
    } else {
      setValue('period', 'year')
    }
  }, [tabIndex])

  const handleFinalSubmit = () => {
    addNewCategory([...categories.filter(c => !categoriesData?.some(cd => cd.id === c.id))])
  }

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData)
    }
  }, [categoriesData])

  return (
    <Box variant='screen'>
      <KeyboardAvoidingView behavior='padding' style={[sharedStyles.mainContainer]}>
        <View>
          <Text fontSize={24} lineHeight={28} variant='geistSemiBold' marginTop='xxxl' marginBottom='s'>
            Add Categories
          </Text>
          <Text color='secondaryText'>
            Add a few categories to get started. You can always add more later.
          </Text>
        </View>
        <Box variant='nestedContainer' style={styles.form}>
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
          <View style={styles.formContent}>
            {categories?.filter(c => tabIndex === 0 ? c.period === 'month' : c.period === 'year')?.length || 0 > 0
              ? <CustomScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {categories?.filter(c => tabIndex === 0 ? c.period === 'month' : c.period === 'year').map((category, i) => (
                  <Fragment key={category.id}>
                    {i !== 0 && <Seperator variant='s' backgroundColor={'nestedContainerSeperator'} />}
                    <Animated.View style={styles.row} entering={StretchInY} exiting={StretchOutY}>
                      <BillCatEmoji emoji={category.emoji} period={category.period} />
                      <Text>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</Text>
                      <View style={styles.amount}>
                        <DollarCents value={Big(category.limit_amount || 0).toFixed(2)} withCents={false} />
                      </View>
                    </Animated.View>
                  </Fragment>
                ))}
              </CustomScrollView>
              : isLoading
                ? <LoadingDots visible={true} />
                : <View style={sharedStyles.emptyMessage}>
                  <Text textAlign='center' color='tertiaryText'>No categories yet</Text>
                </View>
            }
            <Box
              style={styles.textInputs}
              backgroundColor='nestedContainer'
              shadowColor='nestedContainer'
              shadowOffset={{ width: 0, height: 0 }}
              shadowOpacity={1}
              shadowRadius={16}
            >
              <View style={styles.nameInputContainer}>
                <View style={styles.emojiButtonContainer}>
                  <View style={styles.emojiButton}>
                    <EmojiPicker value={emoji} onChange={onEmojiChange} title='Emoji'>
                      <EmojiPicker.Trigger>
                        {emoji
                          ? <Text>{emoji}</Text>
                          : <Icon icon={Emoji} color='placeholderText' size={24} />}
                      </EmojiPicker.Trigger>
                    </EmojiPicker>
                  </View>
                </View>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label='Name'
                      placeholder='Name'
                      value={value}
                      style={styles.nameInput}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                  name='name'
                  rules={{ required: 'Category name is required' }}
                />
              </View>
              <View style={styles.moneyInput}>
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
              </View>
            </Box>
            <Button
              variant='main'
              label='Save'
              onPress={handleSubmit((data) => {
                setCategories([...categories, data as Category])
              })}
            />
          </View>
        </Box>
      </KeyboardAvoidingView>
      <Box paddingBottom='xxxxl' style={sharedStyles.bottomSplitButtons}>
        <Button
          label='Skip'
          backgroundColor='transparent'
          onPress={() => props.navigation.navigate('AddBills')}
        />
        <Button
          textColor='blueText'
          label='Done'
          onPress={() => {
            // handleFinalSubmit()
            props.navigation.navigate('AddBills')
          }}
        />
      </Box>
    </Box>
  )
}

export default AddCategories
