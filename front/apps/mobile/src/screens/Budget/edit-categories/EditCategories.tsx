import { useEffect, useState } from 'react';

import styles from './styles/edit-bill-cats';
import { BudgetScreenProps } from '@types';
import { Box } from '@ledget/native-ui';
import TabButtons from './TabButtons';
import Categories from './Categories';

const EditBillCats = (props: BudgetScreenProps<'EditCategories'>) => {
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
        <Categories period={pageIndex === 0 ? 'month' : 'year'} />
      </Box>
    </Box>
  )
}
export default EditBillCats
