import { View } from 'react-native';
import { ArrowUpRight, ArrowDownRight } from 'geist-native-icons';

import styles from './styles/pick-option';
import { Box, InstitutionLogo, Icon } from '@ledget/native-ui';
import { useGetAccountsQuery } from '@ledget/shared-features';

const Shadow = () => {
  const { data: accounts } = useGetAccountsQuery();

  return (
    <View style={styles.skeletonRows}>
      {Array.from({ length: 3 }).map((_, i) => (
        <View style={styles.row}>
          <InstitutionLogo
            institution={accounts?.institutions[i % (accounts.institutions.length)].id}
            size={16}
          />
          <View style={styles.rightContainer}>
            <Box
              backgroundColor='transactionShimmer'
              style={styles.nameSkeleton}
              borderRadius='xxs'
            />
            <Box
              backgroundColor='transactionShimmer'
              style={styles.amountSkeleton}
              borderRadius='xxs'
            />
          </View>
          <Icon
            icon={i % 2 === 0 ? ArrowUpRight : ArrowDownRight}
            color={i % 2 === 0 ? 'greenText' : 'redText'}
            strokeWidth={2}
            size={16}
          />
        </View>
      ))}
    </View>
  )
}
export default Shadow
