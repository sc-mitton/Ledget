import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useTheme } from "@shopify/restyle";
import { LinearGradient, Canvas, Rect, vec } from '@shopify/react-native-skia';
import Carousel from "react-native-reanimated-carousel";
import { CheckInCircleFill } from 'geist-native-icons';
import Animated, { FadeOut, useSharedValue, StretchOutY } from 'react-native-reanimated';
import { SlotText } from 'react-native-slot-text';

import styles from './styles/widget';
import { useAppDispatch } from "@/hooks"
import { WidgetProps } from "@/features/widgetsSlice"
import { Box, Icon, ColorNumber, Seperator, Button, InstitutionLogo, Text, PulseBox, CarouselDots } from '@ledget/native-ui';
import { updateWidget } from '@/features/widgetsSlice';
import { Account, useGetAccountsQuery } from "@ledget/shared-features"
import Big from 'big.js';

const SELECT_OPTION_WIDTH = 135
const SELECT_OPTION_HEIGHT = SELECT_OPTION_WIDTH * .66
const MAX = 3

const Selector = (widget: WidgetProps<{ accounts: string[] }>) => {
  const dispatch = useAppDispatch()
  const { data: accountsData } = useGetAccountsQuery()
  const theme = useTheme()

  const maskSize = widget.shape === 'square' ? 16 : 32

  const progress = useSharedValue(0)
  const carouselIndexLock = useRef(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [selectedAccounts, setSelectedAccounts] = useState<Account[]>()
  const [accounts, setAccounts] = useState<Account[]>()
  const [accountOptions, setAccountOptions] = useState<Account[]>()

  useEffect(() => {
    if (accountsData && !widget.args) {
      setAccountOptions(accountsData.accounts.filter(account => account.type === 'credit'))
    } else if (widget.args && accountsData) {
      setAccounts(accountsData.accounts.filter(a => widget.args?.accounts?.includes(a.id)))
    }
  }, [accountsData, widget.args])

  const handlePress = (account: Account) => {
    if (selectedAccounts?.includes(account)) {
      setSelectedAccounts(selectedAccounts.filter(selectedAccount => selectedAccount !== account))
    } else {
      if (selectedAccounts?.length === MAX) {
        setSelectedAccounts([...selectedAccounts.slice(1), account])
      } else {
        setSelectedAccounts([...(selectedAccounts || []), account])
      }
    }
  }

  return (
    <View style={styles.container}>
      <Canvas style={[styles.leftMask, styles.mask, { width: maskSize }]}>
        <Rect x={0} y={0} width={maskSize} height={SELECT_OPTION_HEIGHT * 1.25}>
          <LinearGradient
            colors={[
              theme.colors.blueChartGradientEnd,
              theme.colors.nestedContainer,
              theme.colors.nestedContainer
            ]}
            start={vec(0, 0)}
            end={vec(maskSize, 0)}
          />
        </Rect>
      </Canvas>
      <Canvas style={[styles.rightMask, styles.mask, { width: maskSize }]}>
        <Rect x={0} y={0} width={maskSize} height={SELECT_OPTION_HEIGHT * 1.25}>
          <LinearGradient
            colors={[
              theme.colors.blueChartGradientEnd,
              theme.colors.nestedContainer,
              theme.colors.nestedContainer
            ]}
            start={vec(0, 0)}
            end={vec(maskSize, 0)}
          />
        </Rect>
      </Canvas>
      {(accounts || accountOptions)
        ?
        <Carousel
          style={styles.accountsCarousel}
          vertical={false}
          snapEnabled={true}
          mode='parallax'
          data={(accounts || accountOptions) as Account[]}
          renderItem={({ item: account, index }) => {
            const primary_color = accountsData?.institutions.find(institution => institution.id === account.institution_id)?.primary_color
            const gradientColors = [
              primary_color || theme.colors.creditCardGradientStart.replace(theme.colors.blueHue, account.cardHue || theme.colors.blueHue),
              theme.colors.nestedContainerSeperator.replace(theme.colors.blueHue, account.cardHue || theme.colors.blueHue),
            ]

            return (
              <View style={styles.carouselItem}>
                <View style={{ width: SELECT_OPTION_WIDTH, height: SELECT_OPTION_HEIGHT }}>
                  <Box key={`category-option-${account.id}`} style={styles.optionBoxOuter}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      disabled={Boolean(widget.args)}
                      onPress={() => handlePress(account)}
                      style={[StyleSheet.absoluteFillObject, styles.touchable]}
                    >
                      <>
                        <View style={styles.logoContainer}>
                          <View><InstitutionLogo account={account.id} size={18} /></View>
                          <Text color='tertiaryText' fontSize={13}>
                            &nbsp;&bull;&nbsp;&bull;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&bull;&nbsp;&nbsp;&nbsp;
                            {account.mask}
                          </Text>
                        </View>
                        <View style={[StyleSheet.absoluteFill, { opacity: .7 }]}>
                          <Canvas style={[StyleSheet.absoluteFill, { opacity: .2 }]}>
                            <Rect x={0} y={0} width={SELECT_OPTION_WIDTH} height={SELECT_OPTION_HEIGHT}>
                              <LinearGradient
                                colors={gradientColors}
                                start={vec(0, 0)}
                                end={vec(SELECT_OPTION_WIDTH * .5, SELECT_OPTION_WIDTH * .5)}
                              />
                            </Rect>
                          </Canvas>
                        </View>
                        <Box style={[StyleSheet.absoluteFillObject, styles.grayBack]} backgroundColor='nestedContainerSeperator' />
                        <Text fontSize={14} lineHeight={18} style={styles.name}>
                          {account.name.length > 26 ? `${account.name.slice(0, 24)}..` : account.name}
                        </Text>
                      </>
                    </TouchableOpacity>
                  </Box>
                  {!widget.args &&
                    <Animated.View style={styles.checkedIcon} exiting={FadeOut}>
                      {selectedAccounts?.includes(account)
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
                    </Animated.View>}
                </View>
              </View>
            )
          }}
          width={SELECT_OPTION_WIDTH}
          onProgressChange={(p) => {
            if (progress.value === 0) {
              progress.value = p
              return
            }
            if (carouselIndexLock.current) {
              return
            }

            const carouselLength = accounts ? accounts.length : accountOptions?.length || 0

            if (p - progress.value > 20) {
              setCarouselIndex(carouselIndex - 1 >= 0 ? carouselIndex - 1 : carouselLength - 1)
              carouselIndexLock.current = true
              progress.value = p
            } else if (p - progress.value < -20) {
              setCarouselIndex(carouselIndex + 1 < carouselLength ? carouselIndex + 1 : 0)
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
            parallaxScrollingOffset: widget.shape === 'square' ? 6 : -6,
          }}
        />
        :
        <View style={styles.skeletonContainer}>
          {Array.from({ length: 3 }).map((_, index) => (
            <View style={{ width: SELECT_OPTION_WIDTH * .95, height: SELECT_OPTION_HEIGHT * .95 }}>
              <Box
                style={[
                  styles.skeleton,
                  { transform: [{ scale: index !== 1 ? .9 : 1 }] }
                ]}
                backgroundColor='transactionShimmer'
                borderRadius='s'
              />
            </View>
          ))}
        </View>
      }
      {widget.args &&
        <View style={styles.balanceContainer}>
          {accounts
            ?
            <View style={styles.bottomRow}>
              <SlotText
                fontStyle={[
                  { color: theme.colors.mainText },
                  styles.fontStyle
                ]}
                value={Big(accounts[carouselIndex].balances?.current || 0).toNumber()}
                animationDuration={200}
                prefix={'$'}
                includeComma={true}
              />
              <View style={styles.carouselDotsContainer}>
                <CarouselDots currentIndex={carouselIndex} length={accounts.length} />
              </View>
            </View>
            :
            <PulseBox height='m' width={50} borderRadius='s' backgroundColor='nestedContainerSeperator' />
          }
        </View>}
      {!widget.args &&
        <Animated.View exiting={StretchOutY}>
          <Seperator backgroundColor='nestedContainerSeperator' variant='s' />
          <View style={styles.selectorButtons}>
            <Button
              label='Clear'
              textColor='secondaryText'
              paddingVertical='xs'
              variant='rectangle'
              style={styles.selectorButton}
              fontSize={13}
              onPress={() => { setSelectedAccounts(undefined) }}
            />
            <Box variant='divider' backgroundColor='nestedContainerSeperator' />
            <Button
              label='Save'
              textColor='blueText'
              variant='rectangle'
              style={styles.selectorButton}
              paddingVertical='xs'
              fontSize={13}
              onPress={() => {
                if (selectedAccounts) {
                  dispatch(updateWidget({
                    widget: { ...widget, args: { accounts: selectedAccounts.map(account => account.id) } }
                  }))
                }
              }}
            >
              {selectedAccounts && selectedAccounts?.length > 0 &&
                <Box>
                  <ColorNumber
                    value={selectedAccounts.length}
                    color='blueText'
                    backgroundColor='nestedContainerSeperator'
                    fontSize={13}
                    size={18}
                  />
                </Box>}
            </Button>
          </View>
        </Animated.View>}
    </View>
  )
}


export default Selector
