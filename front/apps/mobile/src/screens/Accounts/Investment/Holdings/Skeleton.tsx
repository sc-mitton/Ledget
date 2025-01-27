import { Fragment } from 'react';
import { View } from 'react-native';

import styles from './styles/holdings';
import { Box, PulseText } from '@ledget/native-ui';

const Holdings = () => {
  return (
    <Box variant="nestedContainer">
      <View style={styles.skeletonHoldings}>
        {Array.from({ length: 4 }, (_, index) => (
          <Fragment key={`$holding-${index}`}>
            {index !== 0 && (
              <Box
                variant="divider"
                backgroundColor="nestedContainerSeperator"
              />
            )}
            <Box style={styles.skeletonHolding}>
              <PulseText
                numberOfLines={1}
                width={54}
                pulsing={true}
                borderRadius="xs"
              />
              <PulseText
                numberOfLines={1}
                width={32}
                pulsing={true}
                borderRadius="xs"
              />
            </Box>
          </Fragment>
        ))}
      </View>
    </Box>
  );
};

export default Holdings;
