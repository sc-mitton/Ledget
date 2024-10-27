import { useState, useRef } from 'react';
import { View, TouchableOpacity } from 'react-native'
import { useSharedValue } from 'react-native-reanimated';
import { CheckInCircleFill } from 'geist-native-icons';
import { LinearGradient, Canvas, Rect, vec } from '@shopify/react-native-skia';
import { useTheme } from '@shopify/restyle';
import Carousel from "react-native-reanimated-carousel";

import styles from './styles/selector';
import { useGetCategoriesQuery, Category, selectBudgetMonthYear } from '@ledget/shared-features'
import { WidgetProps, updateWidget } from '@features/widgetsSlice'
import { Text, Button, BillCatEmoji, Icon, Box, Seperator, ColorNumber } from '@ledget/native-ui';
import { useAppDispatch, useAppSelector } from '@/hooks'

const SELECT_OPTION_WIDTH = 60;

const Selector = (widget: WidgetProps<{ categories?: string[] }>) => {
  const dispatch = useAppDispatch()

  const { month, year } = useAppSelector(selectBudgetMonthYear)
  const { data: categories } = useGetCategoriesQuery(
    { month, year },
    { skip: !month || !year }
  )
  const [carouselIndex, setCarouselIndex] = useState(0)
  const progress = useSharedValue(0)
  const carouselIndexLock = useRef(false)

  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    categories?.filter(c =>
      widget.args?.categories?.includes(c.id)) || []
  )
  const theme = useTheme()

  const handlePress = (category: Category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category))
    } else {
      const max = 4
      setSelectedCategories(prev => {
        if (prev.length >= max) {
          return [...prev.slice(1), category]
        } else {
          return [...prev, category]
        }
      })
    }
  }

  return (
    <View style={styles.selectorContainer}>
      <View style={[styles.categoriesScrollSelector]}>
        {widget.shape === 'rectangle' &&
          <>
            <Canvas style={[styles.leftMask, styles.mask]}>
              <Rect x={0} y={0} width={65} height={100}>
                <LinearGradient
                  colors={[
                    theme.colors.blueChartGradientEnd,
                    theme.colors.nestedContainer,
                    theme.colors.nestedContainer
                  ]}
                  start={vec(0, 0)}
                  end={vec(32, 0)}
                />
              </Rect>
            </Canvas>
            <Canvas style={[styles.rightMask, styles.mask]}>
              <Rect x={0} y={0} width={65} height={100}>
                <LinearGradient
                  colors={[
                    theme.colors.blueChartGradientEnd,
                    theme.colors.nestedContainer,
                    theme.colors.nestedContainer
                  ]}
                  start={vec(0, 0)}
                  end={vec(32, 0)}
                />
              </Rect>
            </Canvas>
          </>
        }
        {categories
          ?
          <Carousel
            style={styles.categoriesCarousel}
            vertical={false}
            snapEnabled={true}
            mode='parallax'
            data={categories}
            renderItem={({ item: category, index }) => (
              <TouchableOpacity
                key={`category-option-${category.id}`}
                style={[styles.categoryOption, { width: SELECT_OPTION_WIDTH }]}
                activeOpacity={.7}
                onPress={() => { handlePress(category) }}
              >
                <View>
                  <View style={styles.checkContainer}>
                    {selectedCategories.includes(category)
                      ?
                      <Icon
                        icon={CheckInCircleFill}
                        borderColor={category.period === 'month' ? 'monthBackground' : 'yearBackground'}
                        color={category.period === 'month' ? 'monthColor' : 'yearColor'}
                        size={20}
                        strokeWidth={2}
                      />
                      : carouselIndex === index && <Icon icon={CheckInCircleFill} borderColor='nestedContainer' color='quinaryText' size={16} strokeWidth={2} />}
                  </View>
                  <BillCatEmoji emoji={category.emoji} period={category.period} />
                </View>
                <View style={styles.emojiLabelContainer}>
                  <View style={styles.emojiLabel}>
                    {carouselIndex === index &&
                      <Text fontSize={13} color='secondaryText'>
                        {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                      </Text>}
                  </View>
                </View>
              </TouchableOpacity>
            )}
            width={SELECT_OPTION_WIDTH}
            onProgressChange={(p) => {
              if (progress.value === 0) {
                progress.value = p
                return
              }
              if (carouselIndexLock.current) {
                return
              }
              if (p - progress.value > 20) {
                setCarouselIndex(carouselIndex - 1 >= 0 ? carouselIndex - 1 : categories.length - 1)
                carouselIndexLock.current = true
                progress.value = p
              } else if (p - progress.value < -20) {
                setCarouselIndex(carouselIndex + 1 < categories.length ? carouselIndex + 1 : 0)
                carouselIndexLock.current = true
                progress.value = p
              }
            }}
            onScrollEnd={(index) => {
              setTimeout(() => {
                carouselIndexLock.current = false
              }, 200)
              setCarouselIndex(index)
              progress.value = 0
            }}
            modeConfig={{
              parallaxAdjacentItemScale: 0.8,
              parallaxScrollingScale: 1,
              parallaxScrollingOffset: 12,
            }}
          />
          :
          <View style={styles.skeletonContainer}>
            {Array.from({ length: 3 }).map((_, index) => (
              <Box
                width={index === 1 ? 32 : 24}
                height={index === 1 ? 32 : 24}
                backgroundColor='transactionShimmer'
                borderRadius='circle'
              />
            ))}
          </View>
        }
      </View>
      <Seperator variant='s' />
      <View style={styles.selectorButtons}>
        <Button
          label='Clear'
          textColor='secondaryText'
          paddingVertical='xs'
          style={styles.selectorButton}
          fontSize={13}
          onPress={() => { setSelectedCategories([]) }}
        />
        <Box variant='divider' backgroundColor='nestedContainerSeperator' />
        <Button
          label='Save'
          textColor='blueText'
          variant='rectangle'
          style={styles.selectorButton}
          paddingVertical='xs'
          fontSize={13}
          labelPlacement='left'
          onPress={() => {
            dispatch(updateWidget({
              widget: {
                ...widget,
                args: {
                  ...widget.args,
                  categories: selectedCategories.map(c => c.id)
                }
              }
            }))
          }}
        >
          {selectedCategories.length > 0 &&
            <Box marginRight='s'>
              <ColorNumber
                value={selectedCategories.length}
                color='blueText'
                backgroundColor='nestedContainerSeperator'
                fontSize={12}
              />
            </Box>}
        </Button>
      </View>
    </View>
  )
}

export default Selector;
