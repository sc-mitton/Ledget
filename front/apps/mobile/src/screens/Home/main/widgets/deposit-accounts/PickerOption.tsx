import { View } from 'react-native';

import styles from './styles/picker-option';
import { Box, InstitutionLogo, Text } from '@ledget/native-ui';
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
          <View style={styles.rightContainer}>
            <Box
              backgroundColor='transactionShimmer'
              style={styles.amountSkeleton}
              borderRadius='xxs'
            />
          </View>
        </View>
      ))}
    </View>
  )
}
export default Shadow
