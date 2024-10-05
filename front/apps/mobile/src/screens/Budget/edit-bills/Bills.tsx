import { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ArrowUp, ArrowDown, Plus } from 'geist-native-icons';

import styles from './styles/bills';
import { selectBudgetMonthYear, Bill, useGetBillsQuery } from '@ledget/shared-features';
import { BillCatEmoji, Text, DollarCents, Seperator, CustomScrollView, Icon, Button } from '@ledget/native-ui';
import { useAppSelector } from '@/hooks';
import { getScheduleDescription } from './helpers';
import { BudgetScreenProps } from '@types';

const Categories = (props: BudgetScreenProps<'EditBills'> & { period: Bill['period'] }) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear)
  const [sort, setSort] = useState<'nameAsc' | 'nameDesc' | 'amountAsc' | 'amountDesc'>()
  const [bills, setBills] = useState<Bill[]>([])

  const { data: billsData } = useGetBillsQuery(
    { month, year },
    { skip: !month || !year }
  )

  useEffect(() => {
    if (!billsData) return
    setBills(billsData.filter(b => b.period === props.period).sort((a, b) => {
      switch (sort) {
        case 'nameAsc':
          return a.name.localeCompare(b.name)
        case 'nameDesc':
          return b.name.localeCompare(a.name)
        case 'amountAsc':
          return a.upper_amount - b.upper_amount
        case 'amountDesc':
          return b.upper_amount - a.upper_amount
        default:
          return 0
      }
    }))
  }, [billsData, sort, props.period])

  return (
    <>
      {bills.length > 0 &&
        (
          <View style={styles.header}>
            <Button
              label='Name'
              textColor={sort?.includes('name') ? 'mainText' : 'quaternaryText'}
              onPress={() => {
                setSort(sort === 'nameDesc'
                  ? 'nameAsc'
                  : sort === 'nameAsc' ? undefined : 'nameDesc')
              }}
            >
              <View style={styles.headerIcon}>
                <Icon
                  size={16}
                  strokeWidth={2}
                  color={sort?.includes('name') ? 'mainText' : 'quaternaryText'}
                  icon={sort === 'nameDesc' ? ArrowUp : ArrowDown} />
              </View>
            </Button>
            <Button
              label='Amount'
              textColor={sort?.includes('amount') ? 'mainText' : 'quaternaryText'}
              onPress={() => {
                setSort(sort === 'amountDesc'
                  ? 'amountAsc'
                  : sort === 'amountAsc' ? undefined : 'amountDesc')
              }}
            >
              <View style={styles.headerIcon}>
                <Icon
                  size={16}
                  strokeWidth={2}
                  color={sort?.includes('amount') ? 'mainText' : 'quaternaryText'}
                  icon={sort === 'amountAsc' ? ArrowUp : ArrowDown} />
              </View>
            </Button>
          </View>
        )}
      <CustomScrollView contentContainerStyle={styles.scrollViewContent}>
        {bills.map((bill, i) => (
          <>
            {i !== 0 && <Seperator backgroundColor='nestedContainerSeperator' />}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                props.navigation.navigate('Bill', { bill })
              }}
              style={styles.row}>
              <View>
                <BillCatEmoji emoji={bill.emoji} period={bill.period} />
              </View>
              <View style={styles.nameContainer}>
                <Text>{
                  bill.name.length > 20
                    ? `${bill.name.substring(0, 20)}...`
                    : bill.name
                }</Text>
                <Text color='tertiaryText'>{getScheduleDescription(bill)}</Text>
              </View>
              <View style={styles.amountContainer}>
                {bill.lower_amount &&
                  <View style={{ flexDirection: 'row' }}>
                    <DollarCents value={bill.lower_amount} />
                    <Text>  - </Text>
                  </View>}
                <DollarCents value={bill.upper_amount} />
              </View>
            </TouchableOpacity>
          </>
        ))}
      </CustomScrollView>
      {bills.length === 0 &&
        <View style={styles.emptyTextContainer}>
          <View style={styles.emptyText}>
            <Button
              label='Add a bill'
              variant='grayPill'
              backgroundColor='nestedContainerSeperator'
              textColor='secondaryText'
              onPress={() => {
                props.navigation.navigate('Modals', { screen: 'NewBill', params: { period: props.period } })
              }}
            >
              <Icon icon={Plus} color='secondaryText' />
            </Button>
          </View>
        </View>}
    </>
  )
}
export default Categories
