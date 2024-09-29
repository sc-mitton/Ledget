import { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut, useSharedValue } from 'react-native-reanimated';
import OutsidePressHandler from "react-native-outside-press";

import styles from './styles/carousel-item';
import { Card, HueSliderCard } from "@/components";
import { Account } from "@ledget/shared-features";

interface Props {
  account: Account;
  onPress: () => void;
}

const CarouselItem = (props: Props) => {
  const [showSlider, setShowSlider] = useState(false);
  const hue = useSharedValue(props.account.cardHue);

  return (
    <OutsidePressHandler onOutsidePress={() => setShowSlider(false)} >
      <View style={[styles.container]}>
        {showSlider
          ?
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <HueSliderCard
              account={props.account.id}
              onChange={(newHue) => { hue.value = newHue }}
              hue={props.account.cardHue}
            />
          </Animated.View>
          :
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Card {...props} onLongPress={() => setShowSlider(true)} hue={hue} />
          </Animated.View>
        }
      </View>
    </OutsidePressHandler>
  )
}

export default CarouselItem;
