import { useEffect, memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import SlotNumbers from 'react-native-slot-numbers';
import { useTheme } from '@shopify/restyle';
import Big from 'big.js';

import styles from './styles/categories';
import sharedStyles from '../styles/shared-styles';
import { useAppSelector } from '@/hooks';
import { selectCategoryMetaData } from '@ledget/shared-features';
import { Box, CarouselDots, Text } from '@ledget/native-ui';
import { useBudgetContext } from '../context';

const Progress = () => {
  const {
    monthly_spent,
    yearly_spent,
    limit_amount_monthly,
    limit_amount_yearly,
  } = useAppSelector(selectCategoryMetaData);
  const theme = useTheme();

  const width = useSharedValue(0);
  const { categoriesIndex } = useBudgetContext();

  useEffect(() => {
    width.value = withSpring(
      categoriesIndex === 1
        ? (monthly_spent / limit_amount_monthly) * 100
        : (yearly_spent / limit_amount_yearly) * 100
    );
  }, [categoriesIndex]);

  return (
    <View>
      <View style={styles.progressHeader}>
        <SlotNumbers
          easing="in-out"
          fontStyle={[
            {
              color:
                categoriesIndex === 0
                  ? theme.colors.monthColor
                  : theme.colors.yearColor,
            },
            styles.fontStyle,
          ]}
          value={categoriesIndex === 0 ? monthly_spent : yearly_spent}
          includeComma={true}
          animationDuration={300}
          prefix={'$'}
        />
        <Text
          color={categoriesIndex === 0 ? 'monthColor' : 'yearColor'}
          style={styles.spentOf}
        >
          spent of
        </Text>
        <SlotNumbers
          easing="in-out"
          fontStyle={[
            {
              color:
                categoriesIndex === 0
                  ? theme.colors.monthColor
                  : theme.colors.yearColor,
            },
            styles.fontStyle,
          ]}
          prefix={'$'}
          animationDuration={300}
          value={
            categoriesIndex === 1
              ? Big(limit_amount_monthly).div(100).toNumber()
              : Big(limit_amount_yearly).div(100).toNumber()
          }
          includeComma={true}
        />
      </View>
      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBar, { width: width }]} />
        <Box
          style={styles.progressBarBack}
          backgroundColor={categoriesIndex === 0 ? 'monthColor' : 'yearColor'}
        />
      </View>
    </View>
  );
};

const Header = () => {
  const { categoriesIndex } = useBudgetContext();

  return (
    <View style={styles.headerContainer}>
      <Box
        backgroundColor="mainBackground"
        style={[StyleSheet.absoluteFill, styles.backPanel]}
      />
      <Box
        paddingTop="nestedContainerHPadding"
        paddingHorizontal="nestedContainerHPadding"
        backgroundColor="nestedContainer"
        style={sharedStyles.boxTopHalf}
      >
        <View style={sharedStyles.carouselDots}>
          <CarouselDots length={2} currentIndex={categoriesIndex} />
        </View>
        <View style={styles.header}>
          <Text fontSize={18}>
            {categoriesIndex === 0 ? 'Monthly' : 'Yearly'} Spending
          </Text>
          <Progress />
        </View>
      </Box>
    </View>
  );
};
export default memo(Header);
