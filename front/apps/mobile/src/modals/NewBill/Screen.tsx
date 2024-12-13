import { View, ScrollView } from 'react-native';
import { useForm, Controller, useController, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Emoji } from 'geist-native-icons';
import { z } from 'zod';

import styles from './styles/screen';
import sharedStyles from './styles/shared';
import {
  Box,
  Icon,
  Button,
  InputLabel,
  TextInput,
  EmojiPicker,
  TextInputbase,
  Text,
  MoneyInput,
  Checkbox,
} from "@ledget/native-ui"
import { billSchema } from '@ledget/form-schemas';
import { useAddnewBillMutation } from '@ledget/shared-features';
import { ModalScreenProps } from '@types';
import SchedulerModal from './SchedulerModal';
import RemindersModal from './RemindersModal';
import { useEffect } from 'react';

const Screen = (props: ModalScreenProps<'NewBill'>) => {
  const [addNewBill, { isLoading, isSuccess }] = useAddnewBillMutation();
  const { control, handleSubmit, resetField } = useForm<z.infer<typeof billSchema>>({
    resolver: zodResolver(billSchema),
    defaultValues: props.route.params?.bill || { period: 'month' }
  });

  const onSubmit = (data: z.infer<typeof billSchema>) => {
    addNewBill(data);
  }

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Button
          label='Done'
          variant='bold'
          textColor='blueText'
          onPress={() => handleSubmit(onSubmit)()}
        />
      )
    })
  }, [])

  const emoji = useWatch({ control, name: 'emoji' });
  const isRange = useWatch({ control, name: 'range' });
  const { field: { onChange: onEmojiChange }, formState: { errors } } = useController({ control, name: 'emoji' });
  const { field: { onChange: onLowerAmountChange } } = useController({ control, name: 'lower_amount' });
  const { field: { onChange: onUpperAmountChange } } = useController({ control, name: 'upper_amount' });

  return (
    <Box backgroundColor='modalBox100' style={sharedStyles.modalContent} paddingTop='xxl'>
      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false} >
        <View>
          <InputLabel>Name</InputLabel>
          <EmojiPicker value={emoji} onChange={onEmojiChange} title='Emoji' as='modal'>
            <View style={styles.emojiButton}>
              <EmojiPicker.Trigger>
                <TextInputbase>
                  {emoji
                    ? <Text>{emoji}</Text>
                    : <Icon icon={Emoji} color='placeholderText' size={24} />}
                </TextInputbase>
              </EmojiPicker.Trigger>
            </View>
          </EmojiPicker>
          <View style={styles.nameInput}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder='Name'
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.name}
                />
              )}
              name='name'
              rules={{ required: 'Category name is required' }}
            />
          </View>
        </View>
        <Box style={styles.moneyInputs}>
          <MoneyInput
            label='Amount'
            accuracy={2}
            inputType={isRange ? 'range' : undefined}
            error={errors.lower_amount || errors.upper_amount}
            onChange={(value) => {
              if (Array.isArray(value)) {
                onLowerAmountChange(value[0]);
                onUpperAmountChange(value[1]);
              } else {
                onUpperAmountChange(value);
              }
            }}
          />
        </Box>
        <View style={styles.checkBoxContainer}>
          <Controller
            name='range'
            render={({ field }) => (
              <Checkbox
                label='Range'
                default={field.value ? 'checked' : 'unchecked'}
                onChange={() => field.onChange(!field.value)}
              />
            )}
            control={control}
          />
        </View>
        <SchedulerModal
          control={control}
          resetField={resetField}
          error={errors.schedule}
        />
        <RemindersModal control={control} resetField={resetField} />
      </ScrollView>
    </Box>
  )
}
export default Screen
