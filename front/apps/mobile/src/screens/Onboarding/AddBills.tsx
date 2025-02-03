import { useState, useEffect, createRef } from 'react';
import { View, ScrollView, Dimensions, FlatList } from 'react-native';
import { Emoji, Edit, Edit2 } from 'geist-native-icons';
import Swipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Modal } from 'react-native';
import Reanimated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient, Canvas, Rect, vec } from '@shopify/react-native-skia';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm, Controller, useController, useWatch } from 'react-hook-form';
import { useTheme } from '@shopify/restyle';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Big from 'big.js';

import sharedStyles from './styles/shared';
import styles from './styles/add-bills';
import { OnboardingScreenProps } from '@/types';
import {
  Button,
  Box,
  Text,
  Checkbox,
  EmojiPicker,
  MoneyInput,
  TextInputbase,
  InputLabel,
  TextInput,
  Icon,
  SubmitButton,
  DollarCents,
  LoadingDots,
} from '@ledget/native-ui';
import { billSchema } from '@ledget/form-schemas';
import SchedulerModal from '../../modals/NewBill/SchedulerModal';
import RemindersModal from '../../modals/NewBill/RemindersModal';
import { getScheduleDescription } from '../../modals/NewBill/helpers';
import {
  useUpdateUserMutation,
  useGetRecurringTransactionsQuery,
  useAddnewBillMutation,
  Bill,
  isBill,
  RecurringTransaction,
} from '@ledget/shared-features';

const GAP = 16;

const AddBills = (props: OnboardingScreenProps<'AddBills'>) => {
  const {
    data: recurringTransactions,
    isLoading: isLoadingRecurringTransactions,
  } = useGetRecurringTransactionsQuery();
  const [updateUser] = useUpdateUserMutation();
  const [addNewBill, { isLoading, isSuccess }] = useAddnewBillMutation();
  const theme = useTheme();

  const [showModal, setShowModal] = useState(false);
  const [selectedBills, setSelectedBills] = useState<Bill[]>([]);
  const [modalBillId, setModalBillid] = useState<string>();
  const [, setRowsMeasured] = useState(false);
  const [flatListData, setFlatListData] = useState<Bill[]>([]);
  const swipeables = [...Array(100)].map(() => createRef<SwipeableMethods>());

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    resetField,
    formState: { errors },
  } = useForm<z.infer<typeof billSchema>>({
    resolver: zodResolver(billSchema),
  });
  const {
    field: { onChange: onEmojiChange },
  } = useController({ control, name: 'emoji' });
  const emoji = useWatch({ control, name: 'emoji' });
  const isRange = useWatch({ control, name: 'range' });
  const {
    field: { onChange: onLowerAmountChange, value: lowerAmountValue },
  } = useController({ control, name: 'lower_amount' });
  const {
    field: { onChange: onUpperAmountChange, value: upperAmountValue },
  } = useController({ control, name: 'upper_amount' });

  const saveCustomBill = () => {
    handleSubmit((data) => {
      setShowModal(false);
      const { upper_amount, lower_amount, ...restData } = data;
      const upperAmount = Big(upper_amount).div(100).toNumber();
      const lowerAmount =
        lower_amount === undefined
          ? undefined
          : Big(lower_amount).div(100).toNumber();
      if (flatListData.some((b) => b.id === modalBillId)) {
        setFlatListData((prev) =>
          prev.map((b) =>
            b.id === modalBillId
              ? ({
                  ...restData,
                  id: b.id,
                  lower_amount: lowerAmount,
                  upper_amount: upperAmount,
                } as any)
              : b
          )
        );
      } else {
        setFlatListData([
          ...flatListData,
          {
            ...restData,
            upper_amount: upperAmount,
            lower_amount: lowerAmount,
          } as any,
        ]);
      }

      if (selectedBills.some((b) => b.id === modalBillId)) {
        setSelectedBills((prev) =>
          prev.map((b) =>
            b.id === modalBillId ? ({ ...data, id: b.id } as any) : b
          )
        );
      } else {
        setSelectedBills([...selectedBills, data as any]);
      }
    })();
  };

  const handlePress = (
    item: (RecurringTransaction & { id: string }) | Bill
  ) => {
    setSelectedBills((prev) => {
      if (prev.some((b) => b.id === item.id)) {
        return prev.filter((b) =>
          isBill(item)
            ? b.id !== item.id
            : b.name !== item.transactions[0]?.name
        );
      } else if (isBill(item)) {
        return [...prev, item];
      } else {
        const { transactions, ...rest } = item;
        return [...prev, { ...rest, name: transactions[0]?.name } as Bill];
      }
    });
  };

  useEffect(() => {
    if (recurringTransactions) {
      setFlatListData(
        recurringTransactions.map(
          (t) => ({ ...t, id: Math.random().toString(36).slice(2, 9) } as any)
        )
      );
    }
  }, [recurringTransactions]);

  const handleFinish = () => {
    addNewBill(selectedBills);
    updateUser({ is_onboarded: true });
    props.navigation.navigate('BottomTabs', { screen: 'Budget' } as any);
  };

  useEffect(() => {
    setTimeout(() => {
      setRowsMeasured(true);
    }, 1000);
  }, []);

  return (
    <Box variant="screen">
      <View style={sharedStyles.mainContainer}>
        <View style={sharedStyles.header}>
          <Text fontSize={24} lineHeight={28} marginBottom="s">
            Add Bills
          </Text>
          <Text color="secondaryText">
            Confirm any of your recurring payments, or enter them manually.
          </Text>
        </View>
        <Box
          variant="nestedContainer"
          style={styles.form}
          paddingVertical="xs"
          paddingHorizontal="m"
        >
          {isLoadingRecurringTransactions && (
            <View style={styles.loadingDotsContainer}>
              <LoadingDots visible={true} />
            </View>
          )}
          <View>
            <Canvas style={[sharedStyles.topMask, sharedStyles.mask]}>
              <Rect
                x={0}
                y={0}
                width={Dimensions.get('window').width}
                height={24}
              >
                <LinearGradient
                  colors={[
                    theme.colors.blueChartGradientEnd,
                    theme.colors.nestedContainer,
                    theme.colors.nestedContainer,
                  ]}
                  start={vec(0, 24)}
                  end={vec(0, 0)}
                />
              </Rect>
            </Canvas>
            <FlatList
              indicatorStyle={theme.colors.mode === 'dark' ? 'white' : 'black'}
              style={[styles.flatList]}
              contentContainerStyle={[
                styles.suggestionsFlatListContent,
                { gap: GAP },
              ]}
              data={flatListData}
              renderItem={({ item, index }) => {
                return (
                  <Reanimated.View
                    style={[styles.suggestionOptionContainer]}
                    entering={FadeIn}
                  >
                    <Swipeable
                      ref={swipeables[index]}
                      friction={2}
                      containerStyle={[
                        { backgroundColor: theme.colors.modalSeperator },
                        styles.swipeable,
                      ]}
                      renderLeftActions={() => null}
                      renderRightActions={(e) => (
                        <Box style={styles.rightActions}>
                          <Button
                            onPress={() => {
                              swipeables[index].current?.close();
                              setValue('name', item.name);
                              if (item.period) {
                                setValue('period', item.period);
                              }
                              if (
                                isBill(item) &&
                                item.lower_amount !== undefined &&
                                item.upper_amount !== undefined
                              ) {
                                setValue('range', true);
                              }
                              if ('emoji' in item) {
                                setValue('emoji', item.emoji);
                              }
                              if (item.lower_amount) {
                                setValue(
                                  'lower_amount',
                                  Big(item.lower_amount).times(100).toNumber()
                                );
                              }
                              setValue(
                                'upper_amount',
                                Big(item.upper_amount).times(100).toNumber()
                              );
                              setValue(
                                'range',
                                isBill(item) ? 'lower_amount' in item : false
                              );
                              for (const period of [
                                'day',
                                'month',
                                'week',
                                'week_day',
                                'year',
                              ] as const) {
                                setValue(`schedule.${period}`, item[period]);
                              }
                              setValue(
                                'reminders',
                                isBill(item) ? item.reminders : []
                              );
                              setModalBillid(item.id);
                              setShowModal(true);
                            }}
                            icon={
                              <Icon
                                icon={Edit2}
                                size={18}
                                color="secondaryText"
                              />
                            }
                          />
                        </Box>
                      )}
                    >
                      <Box
                        paddingHorizontal="m"
                        paddingVertical="xs"
                        borderWidth={1.5}
                        backgroundColor="nestedContainer"
                        borderColor="borderedGrayButton"
                        borderRadius="m"
                        style={styles.suggestionOptionBox}
                      >
                        <Checkbox
                          value={selectedBills.some((b) => b.id === item.id)}
                          onChange={() => handlePress(item)}
                          size={16}
                        />
                        <Button
                          style={styles.suggestionOption}
                          onPress={() => handlePress(item)}
                        >
                          <View style={styles.suggestionOptionContent}>
                            <View style={styles.nameContainer}>
                              <Text style={styles.name}>
                                {item.emoji && <Text>{item.emoji}&nbsp;</Text>}
                                {item.name}
                              </Text>
                              <Text color="tertiaryText">
                                {getScheduleDescription(item)}
                              </Text>
                            </View>
                            <DollarCents
                              value={Big(item.upper_amount)
                                .times(100)
                                .toNumber()}
                            />
                          </View>
                        </Button>
                      </Box>
                    </Swipeable>
                  </Reanimated.View>
                );
              }}
              keyExtractor={(b, index) =>
                isBill(b) ? b.id : `${index}-recurring-transaction`
              }
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
                  start={vec(0, 14)}
                  end={vec(0, 38)}
                />
              </Rect>
            </Canvas>
          </View>
          <View style={styles.bottomButtons}>
            <Button
              label="Custom"
              backgroundColor="transparent"
              textColor="blueText"
              labelPlacement="left"
              icon={
                <Icon icon={Edit} color="blueText" strokeWidth={2} size={16} />
              }
              onPress={() => setShowModal(true)}
            />
            <Text color="quinaryText" marginTop="s">
              <MaterialCommunityIcons
                name="gesture-swipe-left"
                size={24}
                color={theme.colors.quinaryText}
              />
              &nbsp;Edit
            </Text>
          </View>
        </Box>
      </View>
      <Modal
        visible={showModal}
        onRequestClose={() => {
          reset();
          setShowModal(false);
        }}
        animationType="slide"
        presentationStyle="pageSheet"
        transparent={true}
        style={sharedStyles.modal}
      >
        <Box
          paddingHorizontal="pagePadding"
          backgroundColor="modalBox"
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
              New Bill
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
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
                <View style={styles.nameInput}>
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
              <Box style={styles.moneyInputs}>
                <MoneyInput
                  label="Amount"
                  accuracy={2}
                  defaultValue={
                    isRange
                      ? lowerAmountValue !== undefined &&
                        upperAmountValue !== undefined
                        ? ([lowerAmountValue, upperAmountValue] as [
                            number,
                            number
                          ])
                        : ([0, 0] as [number, number])
                      : (upperAmountValue as any)
                  }
                  inputType={isRange ? 'range' : undefined}
                  error={errors.lower_amount || errors.upper_amount}
                  onChange={(value) => {
                    if (Array.isArray(value)) {
                      onLowerAmountChange(value[0]);
                      onUpperAmountChange(value[1]);
                    } else {
                      onUpperAmountChange(value);
                    }
                  }}
                />
              </Box>
              <View style={styles.checkBoxContainer}>
                <Controller
                  name="range"
                  render={({ field }) => (
                    <Checkbox
                      label="Range"
                      default={field.value ? 'checked' : 'unchecked'}
                      onChange={() => field.onChange(!field.value)}
                    />
                  )}
                  control={control}
                />
              </View>
              <SchedulerModal
                control={control}
                resetField={resetField}
                error={errors.schedule}
              />
              <RemindersModal control={control} resetField={resetField} />
              <View style={styles.saveButton}>
                <SubmitButton
                  variant="main"
                  label="Save"
                  isSubmitting={isLoading}
                  isSuccess={isSuccess}
                  onPress={saveCustomBill}
                />
              </View>
            </ScrollView>
          </EmojiPicker>
        </Box>
      </Modal>
      <Box paddingBottom="xxxxl">
        <Button variant="main" label="Finish" onPress={handleFinish} />
      </Box>
    </Box>
  );
};
export default AddBills;
