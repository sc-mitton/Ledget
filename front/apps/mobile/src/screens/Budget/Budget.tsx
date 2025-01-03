import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@shopify/restyle';
import { View, ScrollView } from 'react-native';

import styles from './styles/screen';
import { Box } from '@ledget/native-ui';
import { BudgetScreenProps } from '@types';
import Categories from './categories/Categories';
import CategoriesHeader from './categories/Header';
import Bills from './bills/Bills';
import BillsHeader from './bills/Header';
import Context from './context';

const MainScreen = (props: BudgetScreenProps<'Main'>) => {
  const theme = useTheme();
  const [stickyIndices, setStickyIndices] = useState([0, 2]);
  const topOfBillsYPosition = useRef(0);

  return (
    <Box variant="screen">
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          { paddingBottom: theme.spacing.navHeight * 0.875 },
        ]}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={stickyIndices}
        onScrollBeginDrag={() => {
          setStickyIndices([0, 2, 3]);
        }}
        onMomentumScrollEnd={({ nativeEvent: ne }) => {
          if (ne.contentOffset.y < topOfBillsYPosition.current - 100) {
            setStickyIndices([0, 2]);
          }
        }}
        // Sticky headers mess up layout transitions and this is the only fix
      >
        <CategoriesHeader />
        <Categories {...props} />
        <View
          onLayout={(e) => {
            topOfBillsYPosition.current = e.nativeEvent.layout.y;
          }}
          style={styles.scrollViewSpacer}
        />
        <BillsHeader />
        <Bills {...props} />
      </ScrollView>
    </Box>
  );
};

export default function (props: BudgetScreenProps<'Main'>) {
  return (
    <Context>
      <MainScreen {...props} />
    </Context>
  );
}
