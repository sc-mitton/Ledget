import { useEffect, useMemo, useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Plus } from 'geist-native-icons'
import dayjs from 'dayjs'

import styles from './styles/calendar'
import { useAppSelector } from '@/hooks'
import { selectBudgetMonthYear, TransformedBill, useGetBillsQuery } from '@ledget/shared-features'
import { Box, Icon } from '@ledget/native-ui'
import { Text } from '@ledget/native-ui'
import { BudgetScreenProps } from '@types'

const Calendar = (props: BudgetScreenProps<'Main'> & { onPress: () => void }) => {
  const [bills, setBills] = useState<TransformedBill[]>()
  const { month, year } = useAppSelector(selectBudgetMonthYear)
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
      setDays(Array.from({ length: daysInMonth })
        .map((_, i) => i + 1)
        .reduce((acc, day, i) => {
          acc[i % 7].push(day);

          if (day === 1) {
            for (let i = 0; i < dayjs(`${year}-${month}-01`).day(); i++) {
              acc[i].unshift(-1);
            }
          } else if (day === daysInMonth) {
            for (let i = day % 7; i < 7; i++) {
              acc[i].push(-1);
            }
          }
          return acc;
        }, [...Array.from({ length: 7 }).map(() => [] as number[])]));
    }
  }, [month, year]);

  useEffect(() => { setBills(data) }, [data])

  const handlePress = (day: number) => {
    props.navigation.setParams({ day });
    props.onPress();
  }

  return (
    <View style={styles.calendar}>
      <Text fontSize={20}>{dayjs(`${year}-${month}-01`).format('MMMM YYYY')}</Text>
      <View style={styles.grid}>
        {days.map((weekDays) => (
          <View style={styles.column}>
            {weekDays.map((day, i) => (
              <>
                {i === 0 &&
                  <Text color='tertiaryText'>
                    {dayjs(`${year}-${month}-${day}`).format('ddd')}
                  </Text>}
                <TouchableOpacity
                  disabled={day === -1 || !billsPerDay?.[day - 1]}
                  onPress={() => handlePress(day)} style={styles.day}>
                  <Box
                    style={styles.calendarCell}
                    backgroundColor={day === props.route?.params?.day ? 'blueButton' : 'transparent'}>
                    <Text color={day === -1 ? 'transparent' : 'mainText'}>
                      {day}
                    </Text>
                  </Box>
                  {/* Show dots for the number of bills on each day. Max 4 dots total. */}
                  {<View style={styles.markersWrapper}>
                    <View style={styles.markersContainer}>
                      <View style={styles.markers}>
                        {Array.from({ length: (billsPerDay?.[day - 1]?.month || 0) + (billsPerDay?.[day - 1]?.once || 0) })
                          .slice(0, 4 - Math.min(billsPerDay?.[day - 1]?.year || 0, 2))
                          .map((_, i) =>
                            <Box backgroundColor='monthColor' key={i} style={styles.marker} />)
                        }
                        {Array.from({ length: (billsPerDay?.[day - 1]?.year || 0) })
                          .slice(0, 4 - Math.min((billsPerDay?.[day - 1]?.month || 0) + (billsPerDay?.[day - 1]?.once || 0), 2))
                          .map((_, i) =>
                            <Box backgroundColor='yearColor' key={i} style={styles.marker} />)
                        }
                        {(billsPerDay?.[day - 1]?.month || 0) + (billsPerDay?.[day - 1]?.once || 0) + (billsPerDay?.[day - 1]?.year || 0) >= 4 &&
                          <Icon icon={Plus} color='quinaryText' size={12} strokeWidth={3} />}
                      </View>
                    </View>
                  </View>}
                </TouchableOpacity>
              </>
            ))}
          </View>
        ))}
      </View>
    </View>
  )
}
export default Calendar


// <View style={styles.markers}>

// </View>
