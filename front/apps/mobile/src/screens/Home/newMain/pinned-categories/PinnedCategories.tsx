import { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { Pin } from 'geist-native-icons';
import { Big } from 'big.js';

import styles from './styles/pinned-categories';
import { Box, Button, Icon, Text } from '@ledget/native-ui';
import {
  selectPinnedCategories,
  selectBudgetMonthYear,
  useGetCategoriesQuery,
} from '@ledget/shared-features';
import { useAppSelector } from '@/hooks';
import EmojiProgressCircle from './EmojiProgressCircle';
import Picker from './Picker';
import Skeleton from './Skeleton';

const PinnedCategories = () => {
  const navigation = useNavigation<any>();
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const pinnedCategories = useAppSelector(selectPinnedCategories);
  const [pickMode, setPickMode] = useState(false);

  const { isSuccess, data: categories } = useGetCategoriesQuery(
    { month, year, spending: true },
    { skip: !month || !year }
  );

  return (
    <Animated.View layout={LinearTransition}>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginBottom="ns"
      >
        <Box alignItems="center" flexDirection="row" gap="xs">
          <Icon icon={Pin} size={16} color="tertiaryText" />
          <Text color="tertiaryText">Categories</Text>
        </Box>
        <Button
          label="Edit"
          textColor="blueText"
          onPress={() => setPickMode(!pickMode)}
        />
      </Box>
      <Box variant="nestedContainer">
        {!isSuccess ? (
          <Skeleton />
        ) : pickMode ? (
          <Picker onSave={() => setPickMode(false)} />
        ) : pinnedCategories.length === 0 ? (
          <Skeleton />
        ) : (
          <View style={styles.circles}>
            {pinnedCategories.map((c) => {
              const category = categories?.find((cat) => cat.id === c);
              return (
                <Box
                  width={'25%'}
                  justifyContent="center"
                  alignItems="center"
                  key={c}
                >
                  <Button
                    onPress={() => {
                      navigation.navigate('Category', { category });
                    }}
                  >
                    <EmojiProgressCircle
                      progress={Big(category?.amount_spent || 0)
                        .div(category?.limit_amount || 0)
                        .toNumber()}
                      period={category?.period || 'month'}
                      emoji={category?.emoji || null}
                    />
                  </Button>
                </Box>
              );
            })}
          </View>
        )}
      </Box>
    </Animated.View>
  );
};

export default PinnedCategories;
