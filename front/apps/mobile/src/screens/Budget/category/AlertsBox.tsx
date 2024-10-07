import { Trash } from "geist-native-icons";
import Big from "big.js";

import styles from "./styles/alerts-box";
import { View } from "react-native";
import { Category, useUpdateCategoriesMutation } from "@ledget/shared-features";
import { Box, Icon, Text, DollarCents, SubmitButton, Seperator } from "@ledget/native-ui";

const Alerts = ({ category }: { category: Category }) => {
  const [updateCategories, { isLoading, isSuccess }] = useUpdateCategoriesMutation();

  const removeAlert = (index: number) => {
    const alerts = category.alerts.filter((_, i) => i !== index);
    updateCategories([{ id: category.id, alerts }]);
  }

  return (
    <>

      <Box variant='nestedContainer' style={styles.alerts}>
        {category.alerts.length > 0
          ?
          category.alerts.sort((a, b) => a.percent_amount - b.percent_amount).map((alert, index) => (
            <>
              {index !== 0 &&
                <Seperator backgroundColor='nestedContainerSeperator' />}
              <View style={styles.alert}>
                <Box
                  backgroundColor='quinaryText'
                  borderRadius="circle"
                  padding='xs'
                  style={styles.alertCircle}
                >
                  <Text
                    color='secondaryText'
                    style={styles.alertIndex}
                  >
                    {index + 1}
                  </Text>
                </Box>
                <DollarCents
                  value={Big(category.limit_amount).times(alert.percent_amount).div(100).toNumber()}
                />
                <View style={styles.trashButton}>
                  <SubmitButton
                    isSubmitting={isLoading}
                    isSuccess={isSuccess}
                    padding='none'
                    onPress={() => removeAlert(index)}
                  >
                    <Icon icon={Trash} color='alert' />
                  </SubmitButton>
                </View>
              </View>
            </>
          ))
          :
          <Text color='tertiaryText'>No alerts set</Text>
        }
      </Box>
      <Text variant='footer' paddingHorizontal={'s'}>
        Get notified when you've reached these
        spending amounts for this category
      </Text>
    </>
  )
}

export default Alerts;
