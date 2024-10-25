import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme } from '@shopify/restyle';

import styles from './styles/screen';
import { Box } from '@ledget/native-ui';
import { BudgetScreenProps } from '@types';
import Categories from './categories/Categories';
import CategoriesHeader from './categories/Header';
import Bills from './bills/Bills';
import BillsHeader from './bills/Header';

const MainScreen = (props: BudgetScreenProps<'Main'>) => {
  const theme = useTheme()
  const [categoriesIndex, setCategoriesIndex] = useState(0)
  const [billsIndex, setBillsIndex] = useState(0)

  return (
    <Box variant='screen'>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[{ paddingBottom: theme.spacing.navHeight * 1 }]}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0, 2, 3]}
      >
        <CategoriesHeader index={categoriesIndex} />
        <Categories {...props} setIndex={setCategoriesIndex} />
        <View style={styles.scrollViewSpacer} />
        <BillsHeader index={billsIndex} />
        <Bills {...props} setIndex={setBillsIndex} />
      </ScrollView>
    </Box>
  )
}

export default MainScreen
