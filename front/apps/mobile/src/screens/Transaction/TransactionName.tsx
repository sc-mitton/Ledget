import React, { useEffect, useState } from 'react';
import OutsidePressHandler from 'react-native-outside-press';
import { Keyboard, View } from 'react-native';
import Animated, { ZoomIn, ZoomOut, Easing } from 'react-native-reanimated';

import styles from './styles/transaction-name';
import { RootStackScreenProps } from '@types';
import { Box, TextInput, Text, Button } from '@ledget/native-ui';
import {
  Transaction,
  useUpdateTransactionMutation,
} from '@ledget/shared-features';

const TransactionName = (
  props: RootStackScreenProps<'Transaction'> & { transaction: Transaction }
) => {
  const [updateTransaction] = useUpdateTransactionMutation();
  const [value, onChangeText] = useState(
    props.transaction.preferred_name || props.transaction.name
  );

  const onSave = () => {
    Keyboard.dismiss();
    updateTransaction({
      transactionId: props.transaction.transaction_id,
      data: {
        preferred_name: value,
      },
    });
    const { rename, ...rest } = props.route.params.options!;
    props.navigation.setParams({ options: rest });
  };

  return (
    <>
      {props.route.params.options?.rename ? (
        <Animated.View
          style={styles.inputContainer}
          entering={ZoomIn.withInitialValues({
            transform: [{ scale: 0.25 }],
            opacity: 0,
          }).easing(Easing.bezier(0.25, 0.1, 0.25, 1).factory())}
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
                  label="Save"
                  textColor="blueText"
                  style={styles.saveButton}
                />
              </View>
            </Box>
          </OutsidePressHandler>
        </Animated.View>
      ) : (
        <Text fontSize={18}>
          {props.transaction.preferred_name || props.transaction.name}
        </Text>
      )}
    </>
  );
};

export default TransactionName;
