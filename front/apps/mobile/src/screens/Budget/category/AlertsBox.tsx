import { Bell } from "geist-native-icons";

import styles from "./styles/alerts-box";
import { View } from "react-native";
import { Category } from "@ledget/shared-features";
import { Box, BoxHeader, Icon } from "@ledget/native-ui";

const Alerts = ({ category }: { category: Category }) => {

  return (
    <View style={styles.alertsBoxContainer}>
      <BoxHeader>
        <View style={styles.bellIcon}>
          <Icon icon={Bell} size={16} color='tertiaryText' />
        </View>
        Reminders
      </BoxHeader>
      <Box variant='nestedContainer' style={styles.alertsBox}>

      </Box>
    </View>
  )
}

export default Alerts;
