import { useState } from 'react';
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
} from 'react-native-reanimated';
import OutsidePressHandler from 'react-native-outside-press';

import styles from './styles/carousel-item';
import { Box } from '@ledget/native-ui';
import { Card, HueSliderCard } from '@/components';
import { Account } from '@ledget/shared-features';
import { useAppearance } from '@/features/appearanceSlice';

interface Props {
  account: Account;
  onPress: () => void;
}

const CarouselItem = (props: Props) => {
  const [showSlider, setShowSlider] = useState(false);
  const { mode } = useAppearance();
  const hue = useSharedValue(props.account.card_hue);

  return (
    <OutsidePressHandler onOutsidePress={() => setShowSlider(false)}>
      <Box style={[styles.container]}>
        {showSlider ? (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Box
              shadowColor="blackText"
              shadowOpacity={mode === 'dark' ? 1 : 0.1}
              shadowRadius={mode === 'dark' ? 12 : 8}
              shadowOffset={{ width: 0, height: 8 }}
              elevation={7}
            >
              <Box
                shadowColor="blackText"
                shadowOpacity={0.2}
                shadowOffset={{ width: 0, height: 2 }}
                shadowRadius={2}
              >
                <HueSliderCard
                  account={props.account.id}
                  onChange={(newHue) => {
                    hue.value = newHue;
                  }}
                  hue={props.account.card_hue}
                />
              </Box>
            </Box>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Box
              shadowColor="blackText"
              shadowOpacity={mode === 'dark' ? 1 : 0.1}
              shadowRadius={mode === 'dark' ? 12 : 8}
              shadowOffset={{ width: 0, height: 8 }}
              elevation={7}
            >
              <Box
                shadowColor="blackText"
                shadowOpacity={0.2}
                shadowOffset={{ width: 0, height: 2 }}
                shadowRadius={2}
              >
                <Card
                  {...props}
                  onLongPress={() => setShowSlider(true)}
                  hue={hue}
                />
              </Box>
            </Box>
          </Animated.View>
        )}
      </Box>
    </OutsidePressHandler>
  );
};

export default CarouselItem;
