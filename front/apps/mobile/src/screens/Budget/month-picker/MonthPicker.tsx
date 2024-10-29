import { useEffect, useState, useRef } from 'react';
import { View, Modal as NativeModal } from 'react-native';
import dayjs from 'dayjs';
import { Calendar } from 'geist-native-icons';
import { ChevronsRight, ChevronsLeft } from 'geist-native-icons';

import styles from './styles';
import { Button, Icon, Text, Modal, Box, PagerView, TPagerViewRef, Seperator } from '@ledget/native-ui';
import { selectBudgetMonthYear, useGetMeQuery, setBudgetMonthYear } from '@ledget/shared-features';
import { useAppSelector, useAppDispatch } from '@hooks';

export default function DatePicker() {
  const dispatch = useAppDispatch()
  const { month, year } = useAppSelector(selectBudgetMonthYear)
  const { data: user } = useGetMeQuery()

  const pagerRef = useRef<TPagerViewRef>(null)
  const [showPicker, setShowPicker] = useState(false)
  const [pagerIndex, setPagerIndex] = useState(0)
  const [options, setOptions] = useState<Record<string, number[][]>[]>();

  useEffect(() => {
    if (!user) return

    // Set the months available
    let newOptions: Record<string, number[][]>[] = [{}]
    for (let y = dayjs(user?.created_on).year(), i = 0; y <= dayjs().year(); y++, i++) {
      const startMonth = y === dayjs(user?.created_on).year() ? dayjs(user?.created_on).month() + 1 : 1
      const endMonth = y === dayjs().year() ? dayjs().month() + 1 : 12
      newOptions[i][y] = Array.from({ length: 4 }, () => Array.from({ length: 3 }, () => -1))

      for (let m = startMonth; m <= endMonth; m++) {
        newOptions[i][y][m % 4 - 1 < 0 ? 3 : m % 4 - 1][Math.ceil(m / 4) - 1] = m
      }
    }
    setOptions(newOptions)
  }, [user])

  return (
    <>
      <View style={styles.container}>
        <Button
          borderRadius='circle'
          paddingVertical='xs'
          onPress={() => setShowPicker(true)}
        >
          <View style={styles.calendarIcon}>
            <Icon icon={Calendar} color='mainText' size={22} />
          </View>
          <Text color='mainText' fontSize={18}>
            {dayjs(`${year}-${month}-01`).format('MMMM YYYY')}
          </Text>
        </Button>
      </View>
      <NativeModal
        presentationStyle='overFullScreen'
        visible={showPicker}
        transparent={true}
        animationType='fade'
      >
        <Modal
          position='top'
          animation='slideDown'
          onClose={() => setShowPicker(false)}
          hasExitButton={false}
          hasOverlay={true}
        >
          <Box paddingTop='statusBar'>
            <View style={styles.title}>
              <Text variant='bold' fontSize={20}>
                {dayjs(`${year}-${month}-01`).format('MMM YYYY')}
              </Text>
              <Seperator backgroundColor='modalSeperator' />
            </View>
            <View style={styles.pagerContainer}>
              <Button
                onPress={() => { pagerRef.current?.setPage(Math.max(0, pagerIndex - 1)) }}
                padding='none'
                style={styles.arrowButton}
              >
                <Icon
                  strokeWidth={2}
                  icon={ChevronsLeft}
                  color={pagerIndex > 0 ? 'mainText' : 'quinaryText'}
                />
              </Button>
              {options &&
                <PagerView
                  ref={pagerRef}
                  onPageSelected={(n) => setPagerIndex(n.nativeEvent.position)}
                  style={styles.pagerView}>
                  {options.map((yearKey, i) => (
                    <View key={`year-${yearKey}`} style={styles.grid}>
                      {Object.entries(yearKey).map(([y, group]) => (
                        group.map((months, c) => (
                          <View style={styles.column} key={`month-${y}-${c}`}>
                            {months.map((m, r) => (
                              <Button
                                backgroundColor={
                                  m === month && parseInt(y) === year ? 'blueButton' : 'transparent'
                                }
                                disabled={m === -1}
                                onPress={() => {
                                  dispatch(setBudgetMonthYear({ month: m, year: parseInt(y) }))
                                  setShowPicker(false)
                                }}
                                borderRadius='s'
                                variant='rectangle'
                              >
                                <Text
                                  color={
                                    m === month && parseInt(y) === year
                                      ? 'whiteText'
                                      : m === -1 ? 'quaternaryText' : 'mainText'}
                                >
                                  {m === -1
                                    ? dayjs(`${y}-${r * 4 + c + 2}-0`).format('MMM')
                                    : dayjs(`${y}-${m}-01`).format('MMM')
                                  }
                                </Text>
                              </Button>
                            ))}
                          </View>
                        ))
                      ))
                      }
                    </View>
                  ))}
                </PagerView>
              }
              <Button
                style={styles.arrowButton}
                padding='none'
                onPress={() => { pagerRef.current?.setPage(Math.min((options?.length || 1) - 1, pagerIndex + 1)) }}
              >
                <View style={styles.calendarIcon}>
                  <Icon
                    icon={ChevronsRight}
                    strokeWidth={2}
                    color={pagerIndex < (options?.length || 1) - 1 ? 'mainText' : 'quinaryText'}
                  />
                </View>
              </Button>
            </View>
          </Box>
        </Modal>
      </NativeModal>
    </>
  )
}
