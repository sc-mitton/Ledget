import { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'geist-native-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs from 'dayjs';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Filter2 } from '@ledget/media/native';
import styles from './styles/history';
import {
  BottomDrawerModal,
  CustomScrollView,
  InstitutionLogo,
  Text,
  DollarCents,
  Icon,
  Seperator,
  Spinner,
  Button,
  MoneyInput,
  DatePicker
} from '@ledget/native-ui';
import {
  selectFilteredFetchedConfirmedTransactions,
  Transaction,
  useLazyGetTransactionsQuery,
  selectCurrentBudgetWindow,
} from '@ledget/shared-features';
import { useAppearance } from '@features/appearanceSlice';
import { formatDateOrRelativeDate } from '@ledget/helpers';
import { useAppSelector } from '@hooks';
import { ModalScreenProps } from '@types';
import { EmptyBox } from '@ledget/media/native';
import { BillCatSelect } from '@components';

const schema = z.object({
  date: z.array(z.number()).transform(value => value.map(i => i / 1000)),
  amount: z.object({
    min: z.number(),
    max: z.number()
  }),
  billCategories: z.array(z.string()),
  account: z.string(),
  merchant: z.string()
})

const Filter = ({ showFilters }: { showFilters: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { control, handleSubmit } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  });
  const { mode } = useAppearance();

  const onSubmit = () => {
    handleSubmit(data => {
      console.log(data);
    })();
  }

  return (
    <View style={styles.filtersForm}>
      {/*
        6. Account
        7. Merchant */}
      <View style={styles.formHeader}>
        <Text variant='semiBold' fontSize={17}>Filters</Text>
      </View>
      <Controller
        control={control}
        name='date'
        render={({ field: { onChange, value } }) => (
          <DatePicker
            pickerType='range'
            mode='date'
            format='MM/DD/YYYY'
            label='Date'
            theme={mode === 'dark' ? 'dark' : 'light'}
            disabled={[
              [undefined, dayjs()],
              [undefined, dayjs()]
            ]}
            placeholder={['Start Date', 'End Date']}
            onChange={(value) => {
              const v = value?.map(i => i?.valueOf());
              onChange(v);
            }}
          />
        )}
      />
      <Controller
        control={control}
        name='amount'
        render={({ field: { onChange, value } }) => (
          <MoneyInput
            inputType='range'
            label='Amount'
            onChange={onChange}
            accuracy={2}
          />
        )}
      />
      <Controller
        control={control}
        name='billCategories'
        render={({ field: { onChange, value } }) => (
          <BillCatSelect multiple onChange={onChange} />
        )}
      />
      <Button variant='main' label='Save' onPress={onSubmit} />
    </View>
  )
}

const TransactionRow = ({ transaction }: { transaction: Transaction }) => {
  return (
    <View style={styles.transaction}>
      <View style={styles.logoContainer}>
        <InstitutionLogo account={transaction.account} />
      </View>
      <View style={styles.leftColumn}>
        <Text>
          {transaction.name.length > 20 ? `${transaction.name.slice(0, 20)} ...` : transaction.name}
        </Text>
        <View style={styles.leftColumnBottomRow}>
          <Text color='tertiaryText'>
            {formatDateOrRelativeDate(dayjs(transaction.datetime! || transaction.date).valueOf())}
          </Text>
          <View style={styles.emojis}>
            {[...(transaction.categories || []), transaction.bill].map(i =>
              i && <Text>{i.emoji}</Text>)}
          </View>
        </View>
      </View>
      <View style={styles.dateColumn}>
        <DollarCents value={transaction.amount} />
      </View>
      <View>
        <Icon icon={ChevronRight} color={'quinaryText'} />
      </View>
    </View>
  )
}

const Transactions = (props: ModalScreenProps<'Activity'> & { showFilters: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { mode } = useAppearance();
  const { start, end } = useAppSelector(selectCurrentBudgetWindow);

  const transactionsData = useAppSelector(selectFilteredFetchedConfirmedTransactions);
  const [getTransactions, {
    isLoading: isLoadingTransactions,
    isSuccess: isTransactionsSuccess
  }] = useLazyGetTransactionsQuery();

  // Initial transaction fetch
  useEffect(() => {
    if (!start || !end) return;
    getTransactions({ confirmed: true, start, end }, true);
  }, [start, end]);

  return (
    <>
      {transactionsData.length === 0
        ? <View style={styles.emptyBoxGraphic}>
          {isLoadingTransactions ? <Spinner color='blueButton' /> : isTransactionsSuccess
            ? <EmptyBox dark={mode === 'dark'} />
            : null}
        </View>
        : <CustomScrollView
          stickyHeaderIndices={[0]}
          scrollIndicatorInsets={{ right: -8 }} style={styles.scrollView}>
          <View>
            <View style={styles.filterButtonContainer}>
              <Button
                shadowColor='modalBox'
                shadowOffset={{ width: 0, height: 0 }}
                shadowOpacity={1}
                shadowRadius={12}
                padding='s'
                labelPlacement='left'
                fontSize={14}
                borderRadius={8}
                backgroundColor='grayButton'
                textColor='secondaryText'>
                <Icon icon={Filter2} color='secondaryText' size={18} />
              </Button>
            </View>
          </View>
          {transactionsData.map((transaction, index) =>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.touchableTransacton}
                onPress={() => props.navigation.navigate('TransactionDetails', { transaction })}
                activeOpacity={.7}>
                <TransactionRow
                  key={transaction.transaction_id}
                  transaction={transaction} />
              </TouchableOpacity>
              <View style={styles.seperatorContainer}>
                <Seperator
                  backgroundColor={
                    index === transactionsData.length - 1 ? 'transparent' :
                      mode === 'light' ? 'menuSeperator' : 'lightseperator'} />
              </View>
            </View>
          )}
        </CustomScrollView>}
    </>
  )
}

const History = (props: ModalScreenProps<'Activity'>) => {
  const { start, end } = useAppSelector(selectCurrentBudgetWindow);
  const [showFilters, setShowFilters] = useState(false);

  const transactionsData = useAppSelector(selectFilteredFetchedConfirmedTransactions);
  const [getTransactions, {
    isLoading: isTransactionsLoading,
    isSuccess: isTransactionsSuccess
  }] =
    useLazyGetTransactionsQuery();

  // Initial transaction fetch
  useEffect(() => {
    if (!start || !end) return;
    getTransactions({ confirmed: true, start, end }, true);
  }, [start, end]);

  return (
    <BottomDrawerModal.Content
      // defaultExpanded={isTransactionsSuccess && transactionsData.length > 0}
      defaultExpanded={true}
      onCollapse={() => props.navigation.goBack()}
      onClose={() => props.navigation.goBack()}>
      {/* {showFilters */}
      {true
        ? <Animated.View exiting={FadeOut} entering={FadeIn} style={styles.animatedView}>
          <Filter showFilters={setShowFilters} />
        </Animated.View>
        : <Animated.View exiting={FadeOut} entering={FadeIn} style={styles.animatedView}>
          <Transactions {...props} showFilters={setShowFilters} />
        </Animated.View>}
    </BottomDrawerModal.Content>
  )
}

export default History
