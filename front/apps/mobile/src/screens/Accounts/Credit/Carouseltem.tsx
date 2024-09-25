import { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
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

  return (
    <OutsidePressHandler onOutsidePress={() => setShowSlider(false)} >
      <View style={[styles.container]}>
        {showSlider
          ?
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <HueSliderCard account={props.account.id} />
          </Animated.View>
          :
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Card {...props} onLongPress={() => setShowSlider(true)} />
          </Animated.View>
        }
      </View>
    </OutsidePressHandler>
  )
}

export default CarouselItem;
