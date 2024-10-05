import { Clock } from "geist-native-icons";

import styles from "./styles/history-box";
import { View } from "react-native";
import { Bill } from "@ledget/shared-features";
import { Box, BoxHeader, Icon, Text } from "@ledget/native-ui";

const History = ({ bill }: { bill: Bill }) => {

  return (
    <>
      <BoxHeader>
        <View style={styles.clockIcon}>
          <Icon icon={Clock} size={16} color='tertiaryText' />
        </View>
        Payment History
      </BoxHeader>
      <Box variant='nestedContainer'>

      </Box>
    </>
  )
}

export default History;
