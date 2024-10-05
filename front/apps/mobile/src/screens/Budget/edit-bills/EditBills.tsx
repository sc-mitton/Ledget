import { useEffect, useState } from 'react';

import styles from './styles/edit-bill-cats';
import { BudgetScreenProps } from '@types';
import { Box } from '@ledget/native-ui';
import TabButtons from './TabButtons';
import Bills from './Bills';

const EditBillCats = (props: BudgetScreenProps<'EditBills'>) => {
  const [pageIndex, setPageIndex] = useState(0)

  return (
    <Box variant='nestedScreen' style={styles.container}>
      <TabButtons index={pageIndex} setIndex={setPageIndex} />
      <Box
        backgroundColor='nestedContainer'
        borderRadius='l'
        paddingVertical='m'
        marginBottom='navHeight'
        style={styles.nestedContainer}
      >
        <Bills
          {...props}
          period={pageIndex === 0 ? 'month'
            : pageIndex === 1 ? 'year'
              : 'once'}
        />
      </Box>
    </Box>
  )
}
export default EditBillCats
