import { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { Grip } from '@ledget/media/native';
import { ArrowUp, ArrowDown } from 'geist-native-icons';
import * as Haptics from 'expo-haptics';

import styles from './styles/categories';
import { useGetCategoriesQuery, selectBudgetMonthYear, Category } from '@ledget/shared-features';
import { BillCatEmoji, Text, Box, Icon, DollarCents, Button } from '@ledget/native-ui';
import { useAppSelector } from '@/hooks';

const Categories = ({ period }: { period: Category['period'] }) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear)
  const [sort, setSort] = useState<'nameAsc' | 'nameDesc' | 'amountAsc' | 'amountDesc'>()
  const [categories, setCategories] = useState<Category[]>([])

  const { data: categoriesData } = useGetCategoriesQuery(
    { month, year },
    { skip: !month || !year }
  )

  useEffect(() => {
    if (!categoriesData) return
    setCategories(categoriesData.filter(c => c.period === period).sort((a, b) => {
      switch (sort) {
        case 'nameAsc':
          return a.name.localeCompare(b.name)
        case 'nameDesc':
          return b.name.localeCompare(a.name)
        case 'amountAsc':
          return a.limit_amount - b.limit_amount
        case 'amountDesc':
          return b.limit_amount - a.limit_amount
        default:
          return 0
      }
    }))
  }, [categoriesData, sort, period])

  return (
    <>
      <View style={styles.header}>
        <Button
          label='Name'
          textColor={sort?.includes('name') ? 'mainText' : 'quaternaryText'}
          onPress={() => {
            setSort(sort === 'nameDesc'
              ? 'nameAsc'
              : sort === 'nameAsc' ? undefined : 'nameDesc')
          }}
        >
          <View style={styles.headerIcon}>
            <Icon
              size={16}
              strokeWidth={2}
              color={sort?.includes('name') ? 'mainText' : 'quaternaryText'}
              icon={sort === 'nameDesc' ? ArrowUp : ArrowDown} />
          </View>
        </Button>
        <Button
          label='Amount'
          textColor={sort?.includes('amount') ? 'mainText' : 'quaternaryText'}
          onPress={() => {
            setSort(sort === 'amountDesc'
              ? 'amountAsc'
              : sort === 'amountAsc' ? undefined : 'amountDesc')
          }}
        >
          <View style={styles.headerIcon}>
            <Icon
              size={16}
              strokeWidth={2}
              color={sort?.includes('amount') ? 'mainText' : 'quaternaryText'}
              icon={sort === 'amountAsc' ? ArrowUp : ArrowDown} />
          </View>
        </Button>
      </View>
      {categories
        ?
        <DraggableFlatList
          data={categories}
          debug={false}
          showsVerticalScrollIndicator={false}
          style={styles.draggableList}
          keyExtractor={item => item.id}
          renderItem={(args) => (
            <ScaleDecorator activeScale={1.03}>
              <Box
                shadowColor='navShadow'
                shadowOffset={{ width: 0, height: 0 }}
                shadowOpacity={args.isActive ? .2 : 0}
                shadowRadius={8}
                borderColor={args.isActive ? 'modalBorder' : 'transparent'}
                borderWidth={1.5}
                borderRadius='s'
                style={styles.rowBoxOuter}
              >
                <Box
                  borderRadius='s'
                  backgroundColor='nestedContainer'
                  style={styles.rowBoxInner}
                >
                  <Icon icon={Grip} size={16} color='tertiaryText' />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.row}
                    onLongPress={() => {
                      args.drag()
                      Haptics.selectionAsync()
                    }}
                  >
                    <BillCatEmoji emoji={args.item.emoji} period={args.item.period} />
                    <Text>{args.item.name.charAt(0).toUpperCase() + args.item.name.slice(1)}</Text>
                    <View style={styles.amountContainer}>
                      {args.item.limit_amount &&
                        <DollarCents
                          color='secondaryText'
                          value={args.item.limit_amount} withCents={false} />}
                    </View>
                  </TouchableOpacity>
                </Box>
              </Box>
            </ScaleDecorator>
          )}
        />
        :
        <Text>{`No ${period}ly categories`}</Text>
      }
    </>
  )
}
export default Categories
