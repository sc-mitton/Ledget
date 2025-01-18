import { useRef, useState } from 'react';
import { View, TouchableHighlight, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { LinearGradient, Canvas, Rect, vec } from '@shopify/react-native-skia';
import Carousel from 'react-native-reanimated-carousel';
import { CheckInCircleFill } from 'geist-native-icons';
import Animated, { useSharedValue, FadeOut } from 'react-native-reanimated';

import styles from './styles/selector';
import { useAppDispatch } from '@/hooks';
import {
  Button,
  Text,
  Icon,
  Box,
  InstitutionLogo,
  Seperator,
} from '@ledget/native-ui';
import { useGetAccountsQuery, Account } from '@ledget/shared-features';
import { updateWidget, WidgetProps } from '@features/widgetsSlice';

const SELECT_OPTION_WIDTH = 140;
const SELECT_OPTION_HEIGHT = 120 * 0.8;

const Selector = (props: WidgetProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const progress = useSharedValue(0);
  const carouselIndexLock = useRef(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState<Account>();

  const { data: accountsData } = useGetAccountsQuery();

  return (
    <View style={styles.container}>
      <Canvas style={[styles.leftMask, styles.mask]}>
        <Rect x={0} y={0} width={16} height={80}>
          <LinearGradient
            colors={[
              theme.colors.blueChartGradientEnd,
              theme.colors.nestedContainer,
              theme.colors.nestedContainer,
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
              theme.colors.nestedContainer,
            ]}
            start={vec(0, 0)}
            end={vec(16, 0)}
          />
        </Rect>
      </Canvas>
      {accountsData?.accounts ? (
        <Carousel
          style={styles.accountsCarousel}
          vertical={false}
          snapEnabled={true}
          mode="parallax"
          data={accountsData?.accounts.filter(
            (account) => account.type === 'depository'
          )}
          renderItem={({ item: account, index }) => (
            <View style={styles.carouselItem}>
              <View
                style={{
                  width: SELECT_OPTION_WIDTH,
                  height: SELECT_OPTION_HEIGHT,
                }}
              >
                <Box
                  key={`category-option-${account.id}`}
                  style={styles.optionBoxOuter}
                >
                  <TouchableHighlight
                    activeOpacity={0.97}
                    underlayColor={theme.colors.mainText}
                    onPress={() =>
                      selectedAccount
                        ? setSelectedAccount(undefined)
                        : setSelectedAccount(account)
                    }
                    style={[StyleSheet.absoluteFillObject, styles.touchable]}
                  >
                    <>
                      <Box
                        style={[StyleSheet.absoluteFillObject, styles.grayBack]}
                        backgroundColor="nestedContainerSeperator"
                      />
                      <View style={styles.logo}>
                        <View>
                          <InstitutionLogo account={account.id} size={18} />
                        </View>
                        <Text color="tertiaryText" fontSize={13}>
                          &nbsp;&bull;&nbsp;&bull;&nbsp;&nbsp;
                          {account.mask}
                        </Text>
                      </View>
                      <View style={styles.name}>
                        <Text fontSize={14} lineHeight={18}>
                          {account.name.length > 26
                            ? `${account.name.slice(0, 24)}..`
                            : account.name}
                        </Text>
                      </View>
                    </>
                  </TouchableHighlight>
                </Box>
                {!props.args && (
                  <Animated.View style={styles.checkedIcon} exiting={FadeOut}>
                    {selectedAccount === account ? (
                      <Icon
                        icon={CheckInCircleFill}
                        borderColor={'nestedContainer'}
                        color={'greenText'}
                        size={18}
                        strokeWidth={2}
                      />
                    ) : (
                      <Icon
                        icon={CheckInCircleFill}
                        borderColor="nestedContainer"
                        color="quinaryText"
                        size={18}
                        strokeWidth={2}
                      />
                    )}
                  </Animated.View>
                )}
              </View>
            </View>
          )}
          width={SELECT_OPTION_WIDTH}
          onProgressChange={(p) => {
            if (progress.value === 0) {
              progress.value = p;
              return;
            }
            if (carouselIndexLock.current) {
              return;
            }
            if (p - progress.value > 20) {
              setCarouselIndex(
                carouselIndex - 1 >= 0
                  ? carouselIndex - 1
                  : accountsData.accounts.length - 1
              );
              carouselIndexLock.current = true;
              progress.value = p;
            } else if (p - progress.value < -20) {
              setCarouselIndex(
                carouselIndex + 1 < accountsData.accounts.length
                  ? carouselIndex + 1
                  : 0
              );
              carouselIndexLock.current = true;
              progress.value = p;
            }
          }}
          onScrollEnd={(index) => {
            setTimeout(() => {
              carouselIndexLock.current = false;
            }, 200);
            setCarouselIndex(index);
            progress.value = 0;
          }}
          modeConfig={{
            parallaxAdjacentItemScale: 0.8,
            parallaxScrollingScale: 1,
            parallaxScrollingOffset: 6,
          }}
        />
      ) : (
        <View style={styles.skeletonContainer}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Box
              width={index === 1 ? 48 : 32}
              height={index === 1 ? 32 : 24}
              backgroundColor="pulseBox"
              borderRadius="s"
            />
          ))}
        </View>
      )}
      <Seperator backgroundColor="nestedContainerSeperator" variant="bare" />
      <View style={styles.selectorButtons}>
        <Button
          label="Save"
          textColor="blueText"
          variant="rectangle"
          style={styles.selectorButton}
          paddingVertical="xs"
          fontSize={13}
          labelPlacement="left"
          onPress={() => {
            if (selectedAccount) {
              dispatch(
                updateWidget({
                  widget: { ...props, args: { account: selectedAccount.id } },
                })
              );
            }
          }}
        />
      </View>
    </View>
  );
};

export default Selector;
