import { useState } from 'react';
import { Modal as NativeModal, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'geist-native-icons';
import { useController } from 'react-hook-form';
import dayjs from 'dayjs';

import styles from './styles/scheduler-modal';
import sharedStyles from './styles/shared';
import {
  Box,
  Icon,
  TextInputbase,
  Text,
  InputLabel,
  Button,
  Seperator,
  Radios,
  DatePicker,
  TabsTrack
} from '@ledget/native-ui';
import { getScheduleDescription } from './helpers';
import { getOrderSuffix } from '@ledget/helpers';
import type { SchedulerModalProps, Value } from './types';

const DAYS = Array.from({ length: 31 }, (_, i) => i).reduce((acc, day) => {
  acc[day % 7].push(day + 1);
  return acc;
}, Array.from({ length: 7 }, () => [] as number[]));

const SchedulerModal = (props: SchedulerModalProps) => {
  const { field: { onChange: onPeriodChange, value: periodValue } } = useController({ control: props.control, name: 'period' });
  const { field: { onChange: onScheduleChange, value: scheduleValue } } = useController({ control: props.control, name: 'schedule' });
  const { field: { onChange: onExpiresChange, value: expiresValue } } = useController({ control: props.control, name: 'expires' });

  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState(scheduleValue?.week ? 1 : 0);

  const handleSave = () => {
    setShowModal(false);
  }

  const handlePeriodChange = (value: string) => {
    onPeriodChange(value);
    onScheduleChange(undefined);
  }

  const handleClear = () => {
    props.resetField('schedule');
    setShowModal(false);
  }

  return (
    <View style={styles.container}>
      <InputLabel>Schedule</InputLabel>
      <TouchableOpacity
        style={styles.inputButton}
        activeOpacity={.7}
        onPress={() => setShowModal(true)}
      >
        <TextInputbase error={props.error}>
          <View style={styles.calendarIcon}>
            <Icon icon={Calendar} color={scheduleValue ? 'mainText' : 'placeholderText'} />
          </View>
          <Text color={scheduleValue ? 'mainText' : 'placeholderText'}>
            {scheduleValue ? getScheduleDescription(scheduleValue) : 'Set schedule'}
          </Text>
        </TextInputbase>
      </TouchableOpacity>
      <NativeModal
        visible={showModal}
        animationType='slide'
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <Box
          marginTop='statusBar'
          backgroundColor='modalBox100'
          borderTopEndRadius='xl'
          borderTopStartRadius='xl'
          shadowColor='modalShadow'
          shadowOffset={{ width: 0, height: -4 }}
          shadowOpacity={.3}
          shadowRadius={8}
          style={sharedStyles.modalContent}
        >
          <View style={styles.header}>
            <Button label='Clear' textColor='blueText' onPress={() => handleClear()} />
            <Text>Schedule</Text>
            <Button label='Done' textColor='blueText' onPress={() => handleSave()} />
          </View>
          <Seperator backgroundColor='modalSeperator' />
          <Box paddingHorizontal='l'>
            <View style={styles.inputs}>
              <InputLabel>Period</InputLabel>
              <Radios
                cardStyle
                horizontal
                defaultValue={periodValue}
                onChange={handlePeriodChange}
                options={[
                  { label: 'Once', value: 'once' },
                  { label: 'Monthly', value: 'month' },
                  { label: 'Yearly', value: 'year' }
                ]}
              />
              <Box marginVertical='l'>
                {periodValue === 'month' && (
                  <>
                    <View style={styles.tabsContainer}>
                      <TabsTrack
                        containerStyle={styles.tabsContent}
                        onIndexChange={(index) => setTab(index)}
                      >
                        <TabsTrack.Tab index={0}>
                          <Text>Day</Text>
                        </TabsTrack.Tab>
                        <TabsTrack.Tab index={1}>
                          <Text>Week</Text>
                        </TabsTrack.Tab>
                      </TabsTrack>
                    </View>
                    <Seperator variant='s' />
                  </>
                )}
                {periodValue === 'month' && tab === 0 && (
                  <>
                    <Box
                      borderRadius='m'
                      paddingVertical='l'
                      style={styles.dayCalendar}>
                      {DAYS.map((column, index) => (
                        <Box key={index} style={styles.column}>
                          {column.map((day) => (
                            <TouchableOpacity
                              key={`${day}-day`}
                              style={styles.dayCell}
                              onPress={() => {
                                onScheduleChange({ day });
                              }}
                            >
                              <Text>{day}</Text>
                              {day === scheduleValue?.day && (
                                <View style={styles.dayIndicatorBoxContainer}>
                                  <Box
                                    style={styles.dayIndicatorBox}
                                    backgroundColor='blueButton'
                                    borderRadius='s'
                                  />
                                </View>
                              )}
                            </TouchableOpacity>
                          ))}
                        </Box>
                      ))}
                    </Box>
                    <Text variant='footer' textAlign='center' fontSize={15}>
                      Bill will repeat every month on the selected day
                    </Text>
                  </>
                )}
                {periodValue === 'year' && (
                  <View>
                    <InputLabel>Month</InputLabel>
                    <View style={styles.months}>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <Button
                          borderRadius='s'
                          paddingHorizontal='m'
                          paddingVertical='xs'
                          key={`${month}-month`}
                          style={styles.month}
                          backgroundColor={scheduleValue?.month === month ? 'blueButton' : 'transparent'}
                          label={dayjs().month(month - 1).format('MMM')}
                          onPress={() => {
                            onScheduleChange({ month: month, day: scheduleValue?.day });
                          }}
                        />
                      ))}
                    </View>
                    <Seperator variant='s' />
                    <InputLabel>Day</InputLabel>
                    <View style={styles.dayCalendar}>
                      {Array.from({ length: dayjs().month((scheduleValue?.month || 1) - 1).daysInMonth() })
                        .map((_, i) => i)
                        .reduce((acc, day) => {
                          acc[day % 7].push(day + 1);
                          return acc;
                        }, Array.from({ length: 7 }, () => [] as number[]))
                        .map((column) => (
                          <View key={column[0]} style={styles.column}>
                            {column.map((day) => (
                              <TouchableOpacity
                                key={`${day}-day`}
                                style={styles.dayCell}
                                onPress={() => {
                                  onScheduleChange({ month: scheduleValue?.month, day: day });
                                }}
                              >
                                <Text>{day}</Text>
                                {day === scheduleValue?.day && (
                                  <View style={styles.dayIndicatorBoxContainer}>
                                    <Box
                                      style={styles.dayIndicatorBox}
                                      backgroundColor='blueButton'
                                      borderRadius='s'
                                    />
                                  </View>
                                )}
                              </TouchableOpacity>
                            ))}
                          </View>
                        ))}
                    </View>
                  </View>
                )}
                {periodValue === 'month' && tab === 1 && (
                  <>
                    <View>
                      <View style={styles.weeks}>
                        {Array.from({ length: 4 }, (_, i) => i + 1).map((week) => (
                          <Button
                            borderRadius='s'
                            paddingHorizontal='m'
                            paddingVertical='xs'
                            key={`${week}-week`}
                            backgroundColor={scheduleValue?.week === week ? 'blueButton' : 'transparent'}
                            label={`${week}${getOrderSuffix(week)}`}
                            onPress={() => {
                              onScheduleChange({ week: week, week_day: scheduleValue?.week_day });
                            }}
                          />
                        ))}
                      </View>
                      <View style={styles.weekDays}>
                        {Array.from({ length: 7 }, (_, i) => i + 1).map((weekDay) => (
                          <Button
                            borderRadius='s'
                            paddingHorizontal='l'
                            paddingVertical='xs'
                            key={`${weekDay}-week`}
                            backgroundColor={scheduleValue?.week_day === weekDay ? 'blueButton' : 'transparent'}
                            label={dayjs().day(weekDay).format('dd')}
                            onPress={() => {
                              onScheduleChange({ week: scheduleValue?.week, week_day: weekDay });
                            }}
                          />
                        ))}
                      </View>
                    </View>
                    <Text variant='footer' fontSize={15}>
                      Bill will repeat every month on the selected
                      week and day
                    </Text>
                  </>
                )}
              </Box>
              {periodValue === 'once' && (
                <DatePicker
                  label='Date'
                  pickerType='date'
                  placeholder='Select'
                  mode='date'
                  title={'Date'}
                  disabled={[dayjs(), undefined]}
                  defaultValue={expiresValue ? dayjs(expiresValue) : undefined}
                  onChange={(value) => {
                    if (!value) return;
                    onScheduleChange({ day: value.day(), month: value.month() + 1, year: value.year() });
                  }}
                  icon
                />)}
              {periodValue !== 'once' && (
                <DatePicker
                  label='Expires'
                  pickerType='date'
                  placeholder='Optional'
                  mode='date'
                  title={'Expires'}
                  disabled={[
                    dayjs().month(scheduleValue?.month || dayjs().month() - 1).date(scheduleValue?.day || dayjs().date()),
                    undefined
                  ]}
                  defaultValue={expiresValue ? dayjs(expiresValue) : undefined}
                  onChange={(value) => value ? onExpiresChange(value?.toISOString()) : onExpiresChange(undefined)}
                  icon
                />)}
            </View>
          </Box>
        </Box>
      </NativeModal>
    </View>
  )
}

export default SchedulerModal;
