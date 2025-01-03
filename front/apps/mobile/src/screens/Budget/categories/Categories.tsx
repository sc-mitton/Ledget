import { useEffect, useState, memo } from 'react';
import { View } from 'react-native';
import { LinearTransition } from 'react-native-reanimated';

import sharedStyles from '../styles/shared-styles';
import { Box, PagerView } from '@ledget/native-ui';
import List from './List';
import SkeletonList from '../SkeletonList/SkeletonList';
import { BudgetScreenProps } from '@types';
import { useAppSelector } from '@hooks';
import { selectBillCatSort } from '@/features/uiSlice';
import {
  useGetCategoriesQuery,
  selectBudgetMonthYear,
  Category,
} from '@ledget/shared-features';
import { useBudgetContext } from '../context';

const Categories = (props: BudgetScreenProps<'Main'>) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dragging, setDragging] = useState(false);
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const billCatSort = useAppSelector(selectBillCatSort);
  const { data: categoriesData } = useGetCategoriesQuery(
    { month, year },
    { skip: !month || !year }
  );
  const { setCategoriesIndex } = useBudgetContext();

  useEffect(() => {
    if (categoriesData) {
      const sorted = [...categoriesData].sort((a, b) => {
        switch (billCatSort) {
          case 'nameAsc':
            return a.name.localeCompare(b.name);
          case 'nameDesc':
            return b.name.localeCompare(a.name);
          case 'amountAsc':
            return a.limit_amount - b.limit_amount;
          case 'amountDesc':
            return b.limit_amount - a.limit_amount;
          default:
            return 0;
        }
      });
      setCategories(sorted);
    }
  }, [categoriesData]);

  return (
    <Box
      paddingBottom="nestedContainerHPadding"
      paddingHorizontal="nestedContainerHPadding"
      backgroundColor="nestedContainer"
      style={sharedStyles.boxBottomHalf}
      layout={LinearTransition}
    >
      <PagerView
        pageMargin={24}
        style={sharedStyles.pagerView}
        initialPage={0}
        onPageSelected={(e) => setCategoriesIndex(e.nativeEvent.position)}
      >
        <View style={sharedStyles.page} key="1">
          {categories.length ? (
            <List
              period="month"
              categories={categories.filter((c) => c.period === 'month')}
              {...props}
            />
          ) : (
            <SkeletonList />
          )}
        </View>
        <View style={sharedStyles.page} key="2">
          {categories.length ? (
            <List
              period="year"
              categories={categories.filter((c) => c.period === 'year')}
              {...props}
            />
          ) : (
            <SkeletonList />
          )}
        </View>
      </PagerView>
    </Box>
  );
};

export default memo(Categories);
