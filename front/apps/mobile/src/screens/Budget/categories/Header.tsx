import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { SlotText } from 'react-native-slot-text';
import { useTheme } from '@shopify/restyle';
import Big from 'big.js';

import styles from './styles/categories';
import sharedStyles from '../styles/shared-styles';
import { useAppSelector } from '@/hooks';
import { selectCategoryMetaData, Category } from '@ledget/shared-features';
import { Box, CarouselDots, Text } from '@ledget/native-ui';

const Progress = ({ period }: { period: Category['period'] }) => {
  const {
    monthly_spent,
    yearly_spent,
    limit_amount_monthly,
    limit_amount_yearly
  } = useAppSelector(selectCategoryMetaData);
  const theme = useTheme();

  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withSpring(period === 'month'
      ? (monthly_spent / limit_amount_monthly) * 100
      : (yearly_spent / limit_amount_yearly) * 100
    );
  }, [period]);

  return (
    <View>
      <View style={styles.progressHeader}>
        <SlotText
          fontStyle={[
            { color: period === 'month' ? theme.colors.monthColor : theme.colors.yearColor },
            styles.fontStyle
          ]}
          value={
            period === 'month'
              ? `${monthly_spent}`
              : `${yearly_spent}`
          }
          includeComma={true}
          animationDuration={200}
          prefix={'$'}
        />
        <Text color={period === 'month' ? 'monthColor' : 'yearColor'} style={styles.spentOf}>
          spent of
        </Text>
        <SlotText
          fontStyle={[
            { color: period === 'month' ? theme.colors.monthColor : theme.colors.yearColor },
            styles.fontStyle
          ]}
          value={
            period === 'month'
              ? `${Big(limit_amount_monthly).div(100).toNumber()}`
              : `${Big(limit_amount_yearly).div(100).toNumber()}`
          }
          includeComma={true}
          animationDuration={200}
          prefix={'$'}
        />
      </View>
      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBar, { width: width }]} />
        <Box
          style={styles.progressBarBack}
          backgroundColor={period === 'month' ? 'monthColor' : 'yearColor'}
        />
      </View>
    </View>
  )
}

const Header = ({ index }: { index: number }) => {
  return (
    <>
      <Box backgroundColor='mainBackground' style={sharedStyles.boxHeader}>
        <Text fontSize={15} color='tertiaryText' style={sharedStyles.boxHeader}>Spending</Text>
      </Box>
      <Box variant='nestedContainer' style={sharedStyles.headerContainer}>
        <Box style={sharedStyles.carouselDots} backgroundColor='nestedContainer'>
          <CarouselDots length={2} currentIndex={index} />
        </Box>
        <View style={styles.header}>
          <Text color={index === 0 ? 'monthColor' : 'yearColor'} >
            {index === 0 ? 'Monthly' : 'Yearly'}
          </Text>
          <Progress period={index === 0 ? 'month' : 'year'} />
        </View>
      </Box>
    </>
  )
}
export default Header
