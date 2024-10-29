import { useEffect, useState, useMemo } from 'react'
import { View } from 'react-native'
import { Plus } from 'geist-native-icons'
import dayjs from 'dayjs'
import Big from 'big.js'

import styles from './styles/rectangle-filled'
import sharedStyles from './styles/shared'
import { WidgetProps } from '@features/widgetsSlice'
import { useAppSelector } from '@hooks'
import { Text, Box, Icon, DollarCents, PulseBox } from '@ledget/native-ui'
import {
  selectBudgetMonthYear,
  selectBillMetaData,
  useGetBillsQuery,
  TransformedBill
} from '@ledget/shared-features'


const RectangleFilled = (props: WidgetProps & { loading: boolean }) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear)
  const [bills, setBills] = useState<TransformedBill[]>()
  const { data } = useGetBillsQuery(
    { month, year },
    { skip: !month || !year }
  );
  const [days, setDays] = useState<Array<number[]>>([]);

  const billsPerDay = useMemo(() => {
    if (!days) return;
    return bills?.reduce((acc, bill) => {
      acc[dayjs(bill.date).date() - 1][bill.period] += 1;
      return acc;
    },
      Array.from({ length: dayjs(`${year}-${month}-01`).daysInMonth() })
        .map(() => ({ 'month': 0, 'year': 0, 'once': 0 })))
  }, [bills, days])

  useEffect(() => {
    if (month && year) {
      const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth()
      const previousDaysInMonth = dayjs(`${year}-${month}-01`).subtract(1, 'month').daysInMonth()
      const sparePreviousDays = dayjs(`${year}-${month}-01`).day()

      setDays(Array.from({ length: daysInMonth })
        .map((_, i) => i + 1)
        .reduce((acc, day, i) => {

          // insert the trailing days from previous month as -1s
          if (i === 0) {
            for (let j = 0; j < sparePreviousDays; j++) {
              acc[sparePreviousDays - j - 1].push(previousDaysInMonth - j);
            }
          }
          // insert the trailing days from next month as -1s
          if (day === daysInMonth) {
            for (let i = (day + sparePreviousDays) % 7, k = 1; i < 7; i++, k++) {
              acc[i].push(k);
            }
          }

          acc[(i + sparePreviousDays) % 7].push(day);

          return acc;
        }, [...Array.from({ length: 7 }).map(() => [] as number[])]));
    }
  }, [month, year]);

  useEffect(() => { setBills(data) }, [data])

  const {
    yearly_bills_paid,
    monthly_bills_paid,
    number_of_monthly_bills,
    number_of_yearly_bills,
    monthly_bills_amount_remaining,
    yearly_bills_amount_remaining,
    total_monthly_bills_amount,
    total_yearly_bills_amount
  } = useAppSelector(selectBillMetaData)

  return (
    <Box style={styles.container}>
      <Box
        style={styles.leftColumn}
        backgroundColor='nestedContainerSeperator'
        borderRadius='l'
      >
        <View style={styles.leftColumnInner}>
          <Text color='secondaryText' fontSize={13}>
            {dayjs(`${year}-${month}-01`).format('MMM')}&nbsp;
            Bills Paid
          </Text>
          <Text fontSize={24} lineHeight={28} variant='bold'>
            {props.loading ? '0 / 0' : `${monthly_bills_paid + yearly_bills_paid} / ${number_of_monthly_bills + number_of_yearly_bills}`}
          </Text>
          <View style={sharedStyles.calendarButtonContainer}>
            <View>
              <View style={sharedStyles.numbers}>
                {props.loading
                  ?
                  <Box marginRight='xs'>
                    <PulseBox width={32} height='s' />
                  </Box>
                  :
                  <DollarCents
                    value={
                      Big(total_monthly_bills_amount)
                        .plus(total_yearly_bills_amount)
                        .minus(monthly_bills_amount_remaining)
                        .minus(yearly_bills_amount_remaining)
                        .toNumber()
                    }
                    withCents={false}
                    fontSize={15}
                  />}
                <Text color='tertiaryText' fontSize={13} lineHeight={15}>paid</Text>
              </View>
              <View style={sharedStyles.numbers}>
                {props.loading
                  ?
                  <Box marginRight='xs'>
                    <PulseBox width={32} height='s' />
                  </Box>
                  : <DollarCents
                    value={Big(monthly_bills_amount_remaining).plus(yearly_bills_amount_remaining).toNumber()}
                    withCents={false}
                    fontSize={15}
                  />}
                <Text color='tertiaryText' fontSize={13} lineHeight={15}>unpaid</Text>
              </View>
            </View>
          </View>
        </View>
      </Box>
      <View style={styles.calendar}>
        {days.map((weekDays, weekDay) => (
          <View style={styles.column}>
            {weekDays.map((day, i) => {
              const isBookend = ((weekDays[i + 1] || 40) < day && i < 2) || ((weekDays[i - 1] || 0) > day && i > 2)
              const monthDots = (billsPerDay?.[day - 1]?.month || 0) + (billsPerDay?.[day - 1]?.once || 0)
              const yearDots = (billsPerDay?.[day - 1]?.year || 0)
              return (
                <View style={styles.cell}>
                  {i === 0 &&
                    <Text color='tertiaryText' variant='bold' fontSize={12}>
                      {dayjs(`${year}-${month}-${weekDay}`).format('dd')}
                    </Text>}
                  <Box style={styles.calendarCell}>
                    <Text color={isBookend ? 'tertiaryText' : 'mainText'} fontSize={12}>{day}</Text>
                  </Box>
                  {/* Show dots for the number of bills on each day. Max 4 dots total. */}
                  {!isBookend &&
                    <View style={styles.markersContainer}>
                      <View style={styles.markers}>
                        {Array.from({ length: monthDots }).slice(0, 4 - Math.min(billsPerDay?.[day - 1]?.year || 0, 2)).map((_, i) =>
                          <Box backgroundColor='monthColor' key={i} style={styles.marker} />)}
                        {Array.from({ length: yearDots })
                          .slice(0, 4 - Math.min((billsPerDay?.[day - 1]?.month || 0) + (billsPerDay?.[day - 1]?.once || 0), 2))
                          .map((_, i) =>
                            <Box backgroundColor='yearColor' key={i} style={styles.marker} />)}
                        {monthDots + yearDots >= 4 &&
                          <Icon icon={Plus} color='quinaryText' size={8} strokeWidth={3} />}
                      </View>
                    </View>}
                </View>
              )
            })}
          </View>
        ))}
      </View>
    </Box>
  )
}

export default RectangleFilled
