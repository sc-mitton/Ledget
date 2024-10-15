import { Fragment } from 'react'

import styles from './styles/holdings';
import { Box, CustomScrollView, PulseBox } from '@ledget/native-ui';

const Holdings = () => {

  return (
    <Box variant='nestedContainer'>
      <CustomScrollView
        contentContainerStyle={styles.holdings}
        horizontal>
        {Array.from({ length: 4 }, (_, index) => (
          <Fragment key={`$holding-${index}`}>
            {index !== 0 && <Box variant='divider' backgroundColor='nestedContainerSeperator' />}
            <Box style={styles.skeletonHolding} >
              <PulseBox height='s' width={40} />
              <PulseBox height='s' width={28} />
            </Box>
          </Fragment>
        ))
        }
      </CustomScrollView>
    </Box>
  )
}

export default Holdings;
