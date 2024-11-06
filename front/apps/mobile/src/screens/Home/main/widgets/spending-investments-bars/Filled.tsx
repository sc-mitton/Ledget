import { useState } from "react";
import { View } from "react-native"

import styles from './styles/filled';
import { WidgetProps } from "@/features/widgetsSlice"
import Skeleton from "./Skeleton"
import Carousel from './Carousel'
import { HorizontalStats, VerticalStats } from "./Stats";
import { useGetBreakdownHistoryQuery } from "@ledget/shared-features";

const Filled = (widget: WidgetProps) => {
  const { data } = useGetBreakdownHistoryQuery();
  const [carouselIndex, setCarouselIndex] = useState(0);

  return (
    <View style={widget.shape === 'rectangle' ? styles.rectangleContainer : styles.container}>
      {data
        ?
        <>
          {widget.shape === 'rectangle'
            ? <VerticalStats index={carouselIndex} />
            : <HorizontalStats index={carouselIndex} />}
          <View style={widget.shape === 'rectangle' ? styles.rectangleRightSide : styles.bottomHalf}>
            <Carousel index={carouselIndex} setIndex={setCarouselIndex} />
          </View>
        </>
        :
        <Skeleton {...widget} />
      }
    </View>
  )
}

export default Filled
