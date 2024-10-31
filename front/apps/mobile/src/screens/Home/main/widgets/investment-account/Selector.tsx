import { useRef, useState } from 'react';
import { View, TouchableHighlight } from 'react-native'
import { useTheme } from "@shopify/restyle";
import { LinearGradient, Canvas, Rect, vec } from '@shopify/react-native-skia';
import Carousel from "react-native-reanimated-carousel";
import { CheckInCircleFill } from 'geist-native-icons';
import { useSharedValue } from 'react-native-reanimated';
import dayjs from 'dayjs';

import styles from './styles/selector';
import { useAppDispatch } from '@/hooks';
import { Button, Text, Icon, Box, InstitutionLogo, Seperator } from '@ledget/native-ui';
import { InvestmentWithProductSupport, useGetInvestmentsQuery, isInvestmentSupported } from '@ledget/shared-features';
import { updateWidget, WidgetProps } from '@features/widgetsSlice';
import { windows } from './constants';

const SELECT_OPTION_WIDTH = 120

const Selector = (props: WidgetProps) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()

  const progress = useSharedValue(0)
  const carouselIndexLock = useRef(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [selectedInvestment, setSelectedInvestment] = useState<InvestmentWithProductSupport>()

  const { data: investmentsData } = useGetInvestmentsQuery({
    end: dayjs().format('YYYY-MM-DD'),
    start: dayjs().subtract(windows[0].amount, windows[0].period).format('YYYY-MM-DD')
  })

  return (
    <View style={styles.container}>
      <Canvas style={[styles.leftMask, styles.mask]}>
        <Rect x={0} y={0} width={16} height={80}>
          <LinearGradient
            colors={[
              theme.colors.blueChartGradientEnd,
              theme.colors.nestedContainer,
              theme.colors.nestedContainer
            ]}
            start={vec(0, 0)}
            end={vec(16, 0)}
          />
        </Rect>
      </Canvas>
      <Canvas style={[styles.rightMask, styles.mask]}>
        <Rect x={0} y={0} width={16} height={80}>
          <LinearGradient
            colors={[
              theme.colors.blueChartGradientEnd,
              theme.colors.nestedContainer,
              theme.colors.nestedContainer
            ]}
            start={vec(0, 0)}
            end={vec(16, 0)}
          />
        </Rect>
      </Canvas>
      {investmentsData
        ?
        <Carousel
          style={styles.accountsCarousel}
          vertical={false}
          snapEnabled={true}
          mode='parallax'
          data={investmentsData.results.filter(i => isInvestmentSupported(i))}
          renderItem={({ item: investment, index }) => (
            <View style={styles.optionButtonContainer}>
              <View>
                <Box
                  key={`category-option-${investment.account_id}`}
                  style={styles.optionBoxOuter}
                >
                  <TouchableHighlight
                    activeOpacity={0.97}
                    onPress={() => selectedInvestment ? setSelectedInvestment(undefined) : setSelectedInvestment(investment)}
                    underlayColor={theme.colors.mainText}
                    style={{ width: SELECT_OPTION_WIDTH }}
                  >
                    <Box
                      backgroundColor="transactionShimmer"
                      style={styles.optionBoxInner}
                    >
                      <View>
                        <InstitutionLogo account={investment.account_id} size={16} />
                      </View>
                      <View>
                        <Text fontSize={14}>
                          {investment.account_name.length > 12
                            ? `${investment.account_name.slice(0, 12)}..`
                            : investment.account_name}
                        </Text>
                      </View>
                    </Box>
                  </TouchableHighlight>
                </Box>
                <View style={styles.checkedIcon}>
                  {selectedInvestment === investment
                    ?
                    <Icon
                      icon={CheckInCircleFill}
                      borderColor={'nestedContainer'}
                      color={'greenText'}
                      size={18}
                      strokeWidth={2}
                    />
                    :
                    <Icon
                      icon={CheckInCircleFill}
                      borderColor='nestedContainer'
                      color='quinaryText'
                      size={18}
                      strokeWidth={2}
                    />}
                </View>
              </View>
            </View>
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
              setCarouselIndex(carouselIndex - 1 >= 0 ? carouselIndex - 1 : investmentsData.results.length - 1)
              carouselIndexLock.current = true
              progress.value = p
            } else if (p - progress.value < -20) {
              setCarouselIndex(carouselIndex + 1 < investmentsData.results.length ? carouselIndex + 1 : 0)
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
            parallaxScrollingOffset: 6,
          }}
        />
        :
        <View style={styles.skeletonContainer}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Box
              width={index === 1 ? 48 : 32}
              height={index === 1 ? 32 : 24}
              backgroundColor='transactionShimmer'
              borderRadius='s'
            />
          ))}
        </View>
      }
      <Seperator backgroundColor='nestedContainerSeperator' variant='s' />
      <View style={styles.selectorButtons}>
        <Button
          label='Save'
          textColor='blueText'
          variant='rectangle'
          style={styles.selectorButton}
          paddingVertical='xs'
          fontSize={13}
          labelPlacement='left'
          onPress={() => {
            if (selectedInvestment) {
              dispatch(updateWidget({
                widget: { ...props, args: { investment: selectedInvestment.account_id } }
              }))
            }
          }}
        />
      </View>
    </View>
  )
}

export default Selector
