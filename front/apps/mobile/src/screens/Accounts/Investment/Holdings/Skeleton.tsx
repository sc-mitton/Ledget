import { Fragment } from 'react'
import { View } from 'react-native'

import styles from './styles/holdings';
import { Box, PulseBox } from '@ledget/native-ui';

const Holdings = () => {

  return (
    <Box variant='nestedContainer'>
      <View style={styles.skeletonHoldings}>
        {Array.from({ length: 4 }, (_, index) => (
          <Fragment key={`$holding-${index}`}>
            {index !== 0 && <Box variant='divider' backgroundColor='nestedContainerSeperator' />}
            <Box style={styles.skeletonHolding} >
              <PulseBox height='reg' width={54} />
              <PulseBox height='s' width={32} />
            </Box>
          </Fragment>
        ))
        }
      </View>
    </Box>
  )
}

export default Holdings;
