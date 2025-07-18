import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Plus } from 'geist-native-icons';
import dayjs from 'dayjs';

import styles from './styles/bills-calendar';
import { TransformedBill, useGetBillsQuery } from '@ledget/shared-features';
import { Box, Icon } from '@ledget/native-ui';
import { Text } from '@ledget/native-ui';
import { Modal } from '@ledget/native-ui';
import { ModalScreenProps } from '@types';

const BillsCalendarModal = (props: ModalScreenProps<'BillsCalendar'>) => {
  const [bills, setBills] = useState<TransformedBill[]>();
  const month = props.route.params?.month;
  const year = props.route.params?.year;
  const { data } = useGetBillsQuery({ month, year }, { skip: !month || !year });
  const [days, setDays] = useState<Array<number[]>>([]);

  const billsPerDay = useMemo(() => {
    if (!days) return;
    return bills?.reduce(
      (acc, bill) => {
        acc[dayjs(bill.date).date() - 1][bill.period] += 1;
        return acc;
      },
      Array.from({ length: dayjs(`${year}-${month}-01`).daysInMonth() }).map(
        () => ({ month: 0, year: 0, once: 0 })
      )
    );
  }, [bills, days]);

  useEffect(() => {
    if (month && year) {
      const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
      const previousDaysInMonth = dayjs(`${year}-${month}-01`)
        .subtract(1, 'month')
        .daysInMonth();
      const sparePreviousDays = dayjs(`${year}-${month}-01`).day();

      setDays(
        Array.from({ length: daysInMonth })
          .map((_, i) => i + 1)
          .reduce(
            (acc, day, i) => {
              // insert the trailing days from previous month as -1s
              if (i === 0) {
                for (let j = 0; j < sparePreviousDays; j++) {
                  acc[sparePreviousDays - j - 1].push(previousDaysInMonth - j);
                }
              }
              // insert the trailing days from next month as -1s
              if (day === daysInMonth) {
                for (
                  let i = (day + sparePreviousDays) % 7, k = 1;
                  i < 7;
                  i++, k++
                ) {
                  acc[i].push(k);
                }
              }

              acc[(i + sparePreviousDays) % 7].push(day);

              return acc;
            },
            [...Array.from({ length: 7 }).map(() => [] as number[])]
          )
      );
    }
  }, [month, year]);

  useEffect(() => {
    setBills(data);
  }, [data]);

  return (
    <Modal position="centerFloat">
      <View style={styles.calendar}>
        <Text fontSize={20}>
          {dayjs(`${year}-${month}-01`).format('MMM YYYY')}&nbsp;
          <Text fontSize={20} color="secondaryText">
            Bills
          </Text>
        </Text>
        <View style={styles.grid}>
          {days.map((weekDays, weekDay) => (
            <View style={styles.column}>
              {weekDays.map((day, i) => {
                const isBookend =
                  ((weekDays[i + 1] || 40) < day && i < 2) ||
                  ((weekDays[i - 1] || 0) > day && i > 2);
                const monthDots =
                  (billsPerDay?.[day - 1]?.month || 0) +
                  (billsPerDay?.[day - 1]?.once || 0);
                const yearDots = billsPerDay?.[day - 1]?.year || 0;
                return (
                  <View style={styles.cell}>
                    {i === 0 && (
                      <Text
                        color="tertiaryText"
                        variant="bold"
                        style={styles.header}
                      >
                        {dayjs(`${year}-${month}-${weekDay}`).format('dd')}
                      </Text>
                    )}
                    <Box style={styles.calendarCell}>
                      <Text color={isBookend ? 'tertiaryText' : 'mainText'}>
                        {day}
                      </Text>
                    </Box>
                    {/* Show dots for the number of bills on each day. Max 4 dots total. */}
                    {!isBookend && (
                      <View style={styles.markersContainer}>
                        <View style={styles.markers}>
                          {Array.from({ length: monthDots })
                            .slice(
                              0,
                              4 - Math.min(billsPerDay?.[day - 1]?.year || 0, 2)
                            )
                            .map((_, i) => (
                              <Box
                                backgroundColor="monthColor"
                                key={i}
                                style={styles.marker}
                              />
                            ))}
                          {Array.from({ length: yearDots })
                            .slice(
                              0,
                              4 -
                                Math.min(
                                  (billsPerDay?.[day - 1]?.month || 0) +
                                    (billsPerDay?.[day - 1]?.once || 0),
                                  2
                                )
                            )
                            .map((_, i) => (
                              <Box
                                backgroundColor="yearColor"
                                key={i}
                                style={styles.marker}
                              />
                            ))}
                          {monthDots + yearDots >= 4 && (
                            <Icon
                              icon={Plus}
                              color="quinaryText"
                              size={12}
                              strokeWidth={3}
                            />
                          )}
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
};

export default BillsCalendarModal;
