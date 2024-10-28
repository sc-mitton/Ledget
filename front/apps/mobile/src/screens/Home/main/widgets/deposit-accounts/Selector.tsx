import { useState, useRef } from "react";
import { TouchableHighlight, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { CheckInCircleFill } from 'geist-native-icons';
import Carousel from "react-native-reanimated-carousel";
import { useTheme } from "@shopify/restyle";
import { LinearGradient, Canvas, Rect, vec } from '@shopify/react-native-skia';

import styles from './styles/selector';
import { Account, useGetAccountsQuery } from "@ledget/shared-features";
import { Button, Box, ColorNumber, Text, Icon, InstitutionLogo } from "@ledget/native-ui";
import { WidgetProps, updateWidget } from "@/features/widgetsSlice";
import { useAppDispatch } from "@/hooks";

const SELECT_OPTION_WIDTH = 150
const MAX = 3

const Selector = (widget: WidgetProps<{ accounts: string[] }>) => {
  const dispatch = useAppDispatch()
  const { data } = useGetAccountsQuery()
  const theme = useTheme()

  const progress = useSharedValue(0)
  const carouselIndexLock = useRef(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [selectedAccounts, setSelectedAccounts] = useState<Account[]>()

  const handlePress = (account: Account) => {
    if (selectedAccounts?.includes(account)) {
      setSelectedAccounts(selectedAccounts.filter(a => a !== account))
    } else {
      if (selectedAccounts && selectedAccounts?.length >= MAX) {
        setSelectedAccounts([...selectedAccounts.slice(1), account])
      } else {
        setSelectedAccounts([...(selectedAccounts || []), account])
      }
    }
  }

  return (
    <View style={styles.container}>
      <Canvas style={[styles.leftMask, styles.mask]}>
        <Rect x={0} y={0} width={48} height={100}>
          <LinearGradient
            colors={[
              theme.colors.blueChartGradientEnd,
              theme.colors.nestedContainer
            ]}
            start={vec(0, 0)}
            end={vec(28, 0)}
          />
        </Rect>
      </Canvas>
      <Canvas style={[styles.rightMask, styles.mask]}>
        <Rect x={0} y={0} width={48} height={100}>
          <LinearGradient
            colors={[
              theme.colors.blueChartGradientEnd,
              theme.colors.nestedContainer
            ]}
            start={vec(0, 0)}
            end={vec(28, 0)}
          />
        </Rect>
      </Canvas>
      {data?.accounts
        ?
        <Carousel
          style={styles.accountsCarousel}
          vertical={false}
          snapEnabled={true}
          mode='parallax'
          data={data?.accounts.filter(a => a.type === 'depository')}
          renderItem={({ item: account, index }) => (
            <View style={styles.optionButtonContainer}>
              <View>
                <Box
                  borderColor='mediumGrayButton'
                  borderWidth={1.5}
                  key={`category-option-${account.id}`}
                  style={styles.optionBoxOuter}
                >
                  <TouchableHighlight
                    activeOpacity={0.97}
                    onPress={() => { handlePress(account) }}
                    underlayColor={theme.colors.mainText}
                    style={{ width: SELECT_OPTION_WIDTH }}
                  >
                    <Box
                      backgroundColor="transactionShimmer"
                      style={styles.optionBoxInner}
                    >
                      <View>
                        <InstitutionLogo account={account.id} size={16} />
                      </View>
                      <View>
                        <Text fontSize={14}>
                          {account.name.length > 12
                            ? `${account.name.slice(0, 12)}..`
                            : account.name}
                        </Text>
                        <Text fontSize={13} lineHeight={16} color='secondaryText'>
                          {[2, 3].includes(account.subtype.length)
                            ? account.subtype.toUpperCase()
                            : account.subtype.charAt(0).toUpperCase() + account.subtype.slice(1)}
                        </Text>
                      </View>
                    </Box>
                  </TouchableHighlight>
                </Box>
                <View style={styles.checkedIcon}>
                  {selectedAccounts?.includes(account)
                    ?
                    <Icon
                      icon={CheckInCircleFill}
                      borderColor={'nestedContainer'}
                      color={'greenText'}
                      size={18}
                      strokeWidth={2}
                    />
                    : carouselIndex === index &&
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
              setCarouselIndex(carouselIndex - 1 >= 0 ? carouselIndex - 1 : data.accounts.length - 1)
              carouselIndexLock.current = true
              progress.value = p
            } else if (p - progress.value < -20) {
              setCarouselIndex(carouselIndex + 1 < data.accounts.length ? carouselIndex + 1 : 0)
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
            parallaxScrollingOffset: 0,
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
      <View style={styles.selectorButtons}>
        <Button
          label='Clear'
          textColor='secondaryText'
          paddingVertical='xs'
          variant='rectangle'
          style={styles.selectorButton}
          fontSize={13}
          onPress={() => { setSelectedAccounts([]) }}
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
            if (selectedAccounts) {
              dispatch(updateWidget({
                widget: {
                  ...widget,
                  args: {
                    ...widget.args,
                    accounts: selectedAccounts.map(a => a.id)
                  }
                }
              }))
            }
          }}
        >
          {(selectedAccounts?.length || 0) > 0 &&
            <Box>
              <ColorNumber
                value={selectedAccounts?.length || 0}
                color='blueText'
                backgroundColor='nestedContainerSeperator'
                fontSize={13}
                size={18}
              />
            </Box>}
        </Button>
      </View>
    </View>
  )
}

export default Selector
