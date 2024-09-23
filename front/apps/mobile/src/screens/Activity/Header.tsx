import { View } from 'react-native'
import React from 'react'

import styles from './styles/header';
import { Box, Button, Seperator, Text } from '@ledget/native-ui';
import { useAppSelector } from '@hooks';
import { useGetTransactionsCountQuery, selectBudgetMonthYear } from '@ledget/shared-features';

const Header = ({ index, setIndex }: { index: number, setIndex: (index: number) => void }) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const { data } = useGetTransactionsCountQuery(
    { confirmed: false, month, year },
    { skip: !month || !year }
  );

  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Button
          label="New"
          labelPlacement='left'
          onPress={() => setIndex(0)}
          textColor={index === 0 ? 'blueText' : 'secondaryText'}
        >
          <View style={styles.countCountainer}>
            <View style={styles.countBackgroundOuterContainer}>
              <View style={styles.countBackgroundContainer}>
                <Box
                  backgroundColor={index === 0 ? 'blueText' : 'tertiaryText'}
                  style={styles.countBackground} />
              </View>
              <Text fontSize={14} color={index === 0 ? 'blueText' : 'secondaryText'}>
                {data?.count}
              </Text>
            </View>
          </View>
        </Button>
        <Box backgroundColor='modalSeperator' variant='divider' />
        <Button
          label="History"
          labelPlacement='left'
          onPress={() => setIndex(1)}
          textColor={index === 1 ? 'blueText' : 'secondaryText'}
        />
      </View>
      <Seperator variant='bare' backgroundColor={'modalSeperator'} />
    </View>
  )
}

export default Header
