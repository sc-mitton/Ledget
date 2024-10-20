import { useEffect } from "react";
import { View } from "react-native";
import { useSprings } from "@react-spring/web";

import styles from './styles'
import { Box } from "../../restyled/Box";
import { AnimatedView } from "../../animated/views/AnimatedView";

interface Props {
  currentIndex?: number;
  length: number;
}

export const CarouselDots = (props: Props) => {

  const [springs, api] = useSprings(props.length, (index) => ({
    opacity: index === props.currentIndex ? 1 : 0.3
  }));

  useEffect(() => {
    api.start((index) => ({
      opacity: index === props.currentIndex ? 1 : 0.3
    }))
  }, [props.currentIndex])

  return (
    <View style={styles.dotsContainer}>
      {springs.map((style, index) => (
        <AnimatedView key={index} style={style}>
          <Box variant='carouselDot' />
        </AnimatedView>
      ))}
    </View>
  )
}
