import { Bell } from "geist-native-icons";

import styles from "./styles/reminders-box";
import { View } from "react-native";
import { Bill } from "@ledget/shared-features";
import { Box, BoxHeader, Icon, Text } from "@ledget/native-ui";

const Reminders = ({ bill }: { bill: Bill }) => {

  return (
    <>
      <BoxHeader>
        <View style={styles.bellIcon}>
          <Icon icon={Bell} size={16} color='tertiaryText' />
        </View>
        Reminders
      </BoxHeader>
      <Box variant='nestedContainer'>

      </Box>
    </>
  )
}

export default Reminders;
