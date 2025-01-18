import { View } from 'react-native';
import { ChevronUp } from 'geist-native-icons';
import dayjs from 'dayjs';

import styles from './styles/picker-option';
import sharedStyles from './styles/sharedStyles';
import { Box, Text, DollarCents, Icon } from '@ledget/native-ui';
import { useAppSelector } from '@/hooks';
import { selectBudgetMonthYear } from '@ledget/shared-features';

const PickerOption = () => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);

  return (
    <View style={styles.container}>
      <View style={sharedStyles.topRow}>
        <View>
          <View style={sharedStyles.topRowHeader}>
            <Box style={sharedStyles.dot} backgroundColor="greenText" />
            <Text fontSize={13} color="tertiaryText">
              Saved
            </Text>
          </View>
          <View style={sharedStyles.currencyContainer}>
            <DollarCents value={200000} withCents={false} />
          </View>
        </View>
        <View>
          <View style={sharedStyles.topRowHeader}>
            <Box backgroundColor="purpleText" style={sharedStyles.dot} />
            <Text fontSize={13} color="tertiaryText">
              Invested
            </Text>
          </View>
          <View style={sharedStyles.currencyContainer}>
            <DollarCents value={100000} withCents={false} />
          </View>
        </View>
      </View>
      <View style={sharedStyles.barsContainer}>
        {Array.from({ length: 3 }).map((_, index) => (
          <View
            style={[
              (sharedStyles as any)[`barsContainer${index}`],
              sharedStyles.barContainer,
            ]}
            key={`skeleton-bar-${index}`}
          >
            <Box
              style={sharedStyles.investedBar}
              backgroundColor="purpleText"
              shadowColor="nestedContainer"
              shadowOpacity={0.3}
              shadowRadius={3}
              shadowOffset={{
                width: 0,
                height: -3,
              }}
            />
            <Box
              style={sharedStyles.savedBar}
              backgroundColor="greenText"
              shadowColor="nestedContainer"
              shadowOpacity={0.3}
              shadowRadius={3}
              shadowOffset={{
                width: 0,
                height: -3,
              }}
            />
            <Box style={sharedStyles.incomeBar} backgroundColor="pulseBox" />
          </View>
        ))}
      </View>
      <View style={styles.bottomRow}>
        <Icon
          icon={ChevronUp}
          color="tertiaryText"
          size={12}
          strokeWidth={2.5}
        />
        <Text fontSize={14} color="tertiaryText">
          {dayjs(`${year}-${month}-01`).format('MMM YYYY')}
        </Text>
      </View>
    </View>
  );
};

export default PickerOption;
