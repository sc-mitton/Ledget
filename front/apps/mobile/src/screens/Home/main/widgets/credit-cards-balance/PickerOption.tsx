import { View } from 'react-native';

import styles from './styles/picker-option';
import sharedStyles from './styles/shared';
import { Box, InstitutionLogo } from '@ledget/native-ui';
import { useGetAccountsQuery } from '@ledget/shared-features';

const Shadow = () => {
  const { data: accounts } = useGetAccountsQuery();

  return (
    <View style={styles.skeletonRows}>
      {Array.from({ length: 3 }).map((_, i) => (
        <View style={styles.row} key={`credit-card-shadow-${i}`}>
          <View
            style={[{
              backgroundColor: accounts?.institutions[i % (accounts.institutions.length)].primary_color,
            },
            sharedStyles.card
            ]}
          >
            <View style={styles.logoContainer}>
              <InstitutionLogo
                institution={accounts?.institutions[i % (accounts.institutions.length)].id}
                hasBorder={false}
                hasShadow={false}
                size={16}
              />
            </View>
          </View>
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
        </View>
      ))}
    </View>
  )
}
export default Shadow
