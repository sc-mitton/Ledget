import { View } from 'react-native'
import React, { useEffect, useState } from 'react'

import styles from './styles/header';
import { Box, Button, Seperator, Text, TabsTrack } from '@ledget/native-ui';
import { useAppSelector } from '@hooks';
import { useGetTransactionsCountQuery, selectBudgetMonthYear } from '@ledget/shared-features';
import { useAppearance } from '@/features/appearanceSlice';

const Header = ({ index, setIndex }: { index: number, setIndex: (index: number) => void }) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const { data } = useGetTransactionsCountQuery(
    { confirmed: false, month, year },
    { skip: !month || !year }
  );
  const { mode } = useAppearance();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <TabsTrack onIndexChange={setIndex} >
          <TabsTrack.Tab index={0}>
            <View style={styles.countCountainer}>
              <View style={styles.countBackgroundOuterContainer}>
                <Text variant='bold' fontSize={14} color={'secondaryText'}>
                  {24}
                </Text>
              </View>
            </View>
            <Text color={index === 0 ? 'mainText' : 'secondaryText'}>New</Text>
          </TabsTrack.Tab>
          <TabsTrack.Tab index={1}>
            <Text color={index === 1 ? 'mainText' : 'secondaryText'}>History</Text>
          </TabsTrack.Tab>
        </TabsTrack>
      </View>
      <View style={[styles.seperator, mode === 'light' && styles.lightModeSeperator]}>
        <Seperator
          variant={'bare'}
          backgroundColor={'modalSeperator'}
        />
      </View>
    </View>
  )
}

export default Header
