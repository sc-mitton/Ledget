import { View } from 'react-native';

import styles from './styles/categories';
import { useAppSelector } from '@/hooks';
import { selectCategoryMetaData, Category } from '@ledget/shared-features';
import { Box, DollarCents, Text } from '@ledget/native-ui';

const Progress = ({ period }: { period: Category['period'] }) => {
  const {
    monthly_spent,
    yearly_spent,
    limit_amount_monthly,
    limit_amount_yearly
  } = useAppSelector(selectCategoryMetaData);

  return (
    <View>
      <View style={styles.progressHeader}>
        <DollarCents
          value={period === 'month' ? monthly_spent : yearly_spent}
          color={period === 'month' ? 'monthColor' : 'yearColor'}
          withCents={false}
        />
        <Text color={period === 'month' ? 'monthColor' : 'yearColor'}>
          spent of
        </Text>
        <DollarCents
          value={period === 'month' ? limit_amount_monthly : limit_amount_yearly}
          color={period === 'month' ? 'monthColor' : 'yearColor'}
          withCents={false}
        />
      </View>
      <View style={styles.progressBarContainer}>
        <Box
          backgroundColor={period === 'month' ? 'monthColor' : 'yearColor'}
          style={[
            styles.progressBar,
            {
              width: period === 'month'
                ? `${(monthly_spent / limit_amount_monthly) * 100}%`
                : `${(yearly_spent / limit_amount_yearly) * 100}%`
            }
          ]}
        />
        <Box
          style={styles.progressBarBack}
          backgroundColor={period === 'month' ? 'monthColor' : 'yearColor'}
        />
      </View>
    </View>
  )
}

export default Progress;
