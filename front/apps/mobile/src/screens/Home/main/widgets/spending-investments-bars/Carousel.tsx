import { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { ChevronUp } from 'geist-native-icons';
import Carousel from 'react-native-reanimated-carousel';
import dayjs from 'dayjs';

import styles from './styles/filled';
import { Box, Icon, Text } from '@ledget/native-ui';
import { useGetBreakdownHistoryQuery } from '@ledget/shared-features';

const SELECT_OPTION_WIDTH = 100;

interface CarouselProps {
  index: number;
  setIndex: (index: number) => void;
}

export const BakedCarousel = (props: CarouselProps) => {
  const { data } = useGetBreakdownHistoryQuery();

  const progress = useSharedValue(0);
  const indexLock = useRef(false);
  const [carouselData, setCarouselData] = useState<typeof data>();

  useEffect(() => {
    if (data) {
      const newCarouselData = [...data].reverse();
      setCarouselData(newCarouselData);
      props.setIndex(newCarouselData.length - 1);
    }
  }, [data]);

  const maxIncome = useMemo(
    () =>
      carouselData?.reduce(
        (max, breakdown) => Math.max(max, breakdown.income),
        0
      ) || 0,
    [carouselData]
  );

  return (
    <>
      {carouselData && (
        <Carousel
          style={styles.accountsCarousel}
          vertical={false}
          snapEnabled={true}
          mode="parallax"
          modeConfig={{
            parallaxAdjacentItemScale: 1,
            parallaxScrollingScale: 1,
            parallaxScrollingOffset: SELECT_OPTION_WIDTH - 20,
          }}
          data={carouselData}
          loop={false}
          defaultIndex={carouselData.length - 1}
          renderItem={({ item: breakdown, index }) => {
            const investmentPercent =
              (breakdown.investment_transfer_out / (breakdown.income || 1)) *
              100;
            const saved = Math.max(
              breakdown.income -
                breakdown.spending -
                breakdown.investment_transfer_out,
              0
            );
            const savedPercent = (saved / (breakdown.income || 1)) * 100;
            const incomePercent = Math.max(
              breakdown.income / (maxIncome || 1),
              10
            );
            const opacity =
              index > props.index
                ? Math.max(1 - 0.34 * (index - props.index), 0)
                : 1;

            return (
              <View style={[styles.carouselItem, { opacity }]}>
                <Box
                  style={[
                    styles.bar,
                    {
                      zIndex: investmentPercent > savedPercent ? 0 : 1,
                      height: `${investmentPercent * 100}%`,
                    },
                  ]}
                  backgroundColor="purpleText"
                />
                <Box
                  style={[
                    styles.bar,
                    {
                      zIndex: investmentPercent > savedPercent ? 0 : 1,
                      height: `${savedPercent ? 100 : 0}%`,
                    },
                  ]}
                  backgroundColor="greenText"
                />
                <Box
                  style={[styles.bar, { height: `${incomePercent}%` }]}
                  backgroundColor="pulseBox"
                />
              </View>
            );
          }}
          width={SELECT_OPTION_WIDTH}
          onProgressChange={(p) => {
            if (progress.value === 0) {
              progress.value = p;
              return;
            }
            if (indexLock.current) {
              return;
            }

            const carouselLength = carouselData?.length || 0;

            if (p - progress.value > 20) {
              props.setIndex(
                props.index - 1 >= 0 ? props.index - 1 : carouselLength - 1
              );
              indexLock.current = true;
              progress.value = p;
            } else if (p - progress.value < -20) {
              props.setIndex(
                props.index + 1 < carouselLength ? props.index + 1 : 0
              );
              indexLock.current = true;
              progress.value = p;
            }
          }}
          onScrollEnd={(index) => {
            setTimeout(() => {
              indexLock.current = false;
            }, 200);
            props.setIndex(index);
            progress.value = 0;
          }}
        />
      )}
      {data && (
        <View style={styles.dateIndicator}>
          <View style={styles.dateIndicatorIcon}>
            <Icon
              icon={ChevronUp}
              color="quaternaryText"
              size={12}
              strokeWidth={2.5}
            />
          </View>
          <Text color="quaternaryText" fontSize={14}>
            {dayjs(data[props.index].date).format('MMM YYYY')}
          </Text>
        </View>
      )}
    </>
  );
};

export default BakedCarousel;
