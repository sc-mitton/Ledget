import { View } from 'react-native';
import { ArrowUpRight } from 'geist-native-icons';

import styles from './styles/pick-option';
import { Box, InstitutionLogo, Icon } from '@ledget/native-ui';
import { useGetAccountsQuery } from '@ledget/shared-features';
import ChartSkeleton from './Chart';

const Shadow = () => {
  const { data: accounts } = useGetAccountsQuery();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <InstitutionLogo institution={accounts?.institutions[0].id} size={16} />
        <View style={styles.rightContainer}>
          <Box
            backgroundColor="transactionShimmer"
            style={styles.nameSkeleton}
            borderRadius="xxs"
          />
          <Box
            backgroundColor="transactionShimmer"
            style={styles.amountSkeleton}
            borderRadius="xxs"
          />
        </View>
        <Icon
          icon={ArrowUpRight}
          color={'greenText'}
          strokeWidth={2}
          size={16}
        />
      </View>
      <ChartSkeleton emptyMessage={false} />
    </View>
  );
};
export default Shadow;
