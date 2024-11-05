import { View } from "react-native"

import { WidgetProps } from "@/features/widgetsSlice"
import { useGetBreakdownHistoryQuery } from "@ledget/shared-features"


const Filled = (widget: WidgetProps) => {
  const { data } = useGetBreakdownHistoryQuery()

  return (
    <View>

    </View>
  )
}

export default Filled
