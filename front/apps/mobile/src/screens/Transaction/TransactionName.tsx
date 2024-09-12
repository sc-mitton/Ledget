import { useState } from "react";
import OutsidePressHandler from "react-native-outside-press";
import { Keyboard, View } from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

import styles from './styles/transaction-name';
import { AccountsScreenProps } from "@types";
import { Box, TextInput, Text, Button } from '@ledget/native-ui';
import { useUpdateTransactionMutation } from "@ledget/shared-features";

const TransactionName = (props: AccountsScreenProps<'Transaction'>) => {
  const [updateTransaction] = useUpdateTransactionMutation();
  const [value, onChangeText] = useState(
    props.route.params.transaction.preferred_name || props.route.params.transaction.name
  );

  const onSave = () => {
    Keyboard.dismiss();
    updateTransaction({
      transactionId: props.route.params.transaction.transaction_id,
      data: {
        preferred_name: value
      }
    })
    props.navigation.setParams({ options: {} })
  }

  return (
    <>
      {props.route.params.options?.rename
        ?
        <Animated.View
          style={styles.inputContainer}
          entering={ZoomIn.withInitialValues({ scale: 0.8 })}
          exiting={ZoomOut}
        >
          <OutsidePressHandler onOutsidePress={onSave}>
            <Box
              shadowColor="newTransactionShadow"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={1}
              shadowRadius={12}
            >
              <TextInput
                autoFocus
                value={value}
                onChangeText={onChangeText}
                onBlur={onSave}
              />
              <View style={styles.saveButttonContainer}>
                <Button
                  onPress={onSave}
                  label='Save'
                  textColor='blueText'
                  style={styles.saveButton}
                />
              </View>
            </Box>
          </OutsidePressHandler>
        </Animated.View>
        :
        <Text fontSize={18}>
          {props.route.params.transaction.preferred_name || props.route.params.transaction.name}
        </Text>
      }
    </>
  )
}

export default TransactionName
