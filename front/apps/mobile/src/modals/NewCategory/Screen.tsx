import { useEffect } from 'react';
import { X } from 'geist-native-icons';
import { ScrollView, View } from 'react-native';
import { useForm, Controller, useController, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Smile } from 'geist-native-icons';
import Big from 'big.js';

import styles from './styles/screen';
import {
  Box,
  Button,
  Icon,
  TextInput,
  Header2,
  Seperator,
  SubmitButton,
  Text,
  TextInputbase,
  InputLabel,
  EmojiPicker,
  MoneyInput,
  ModalPicker
} from "@ledget/native-ui"
import { useAddNewCategoryMutation } from '@ledget/shared-features';
import { ModalScreenProps } from '@types';
import { categorySchema } from '@ledget/form-schemas';
import AlertInput from './AlertInput';

const Screen = (props: ModalScreenProps<'NewCategory'>) => {
  const { control, handleSubmit } = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      period: 'month'
    }
  });
  const [addNewCategory, { isLoading, isSuccess }] = useAddNewCategoryMutation();

  const emoji = useWatch({ control, name: 'emoji' });

  const onSubmit = (data: z.infer<typeof categorySchema>) => {
    addNewCategory(data);
  }

  useEffect(() => {
    if (isSuccess) {
      props.navigation.goBack();
    }
  }, [isSuccess])

  const { field: { onChange: onEmojiChange }, formState: { errors } } = useController({ control, name: 'emoji' });

  return (
    <Box backgroundColor='modalBox100' style={styles.modalContent}>
      <Button
        onPress={() => props.navigation.goBack()}
        variant='circleButton'
        style={styles.closeButton}>
        <Icon icon={X} color='secondaryText' />
      </Button>
      <View style={styles.formHeader}>
        <Header2>New Category</Header2>
        <Seperator />
      </View>
      <ScrollView
        contentContainerStyle={styles.form}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <InputLabel>Name</InputLabel>
          <EmojiPicker value={emoji} onChange={onEmojiChange} title='Emoji'>
            <View style={styles.emojiButton}>
              <EmojiPicker.Trigger>
                <TextInputbase>
                  {emoji
                    ? <Text>{emoji}</Text>
                    : <Icon icon={Smile} color='placeholderText' size={24} />}
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
        <Controller
          name='period'
          render={({ field }) => (
            <ModalPicker
              label='Period'
              chevronDirection='down'
              isFormInput={true}
              header='Period'
              valueKey={'value'}
              defaultValue={{ value: field.value, label: field.value === 'month' ? 'Monthly' : 'Yearly' }}
              onChange={field.onChange}
              options={[
                { label: 'Monthly', value: 'month' },
                { label: 'Yearly', value: 'year' }
              ]}
            />
          )}
          control={control}
        />
        <Controller
          name='limit_amount'
          render={({ field }) => (
            <MoneyInput
              label='Limit'
              defaultValue={field.value}
              onChange={(v) => {
                field.onChange(Big(v || 0).times(100).toNumber())
              }}
              inputType='single'
              error={errors.limit_amount}
              accuracy={2}
            />
          )}
          control={control}
        />
        <Controller
          name='alerts'
          render={({ field }) => (
            <AlertInput
              onChange={(value) => field.onChange(value.map(v => ({ percent_amount: value })))}
              defaultValue={field.value?.map(v => v.percent_amount)}
            />
          )}
          control={control}
        />
        <View style={styles.saveButton}>
          <SubmitButton
            variant='main'
            label='Save'
            isSubmitting={isLoading}
            isSuccess={isSuccess}
            onPress={() => handleSubmit(onSubmit)()}
          />
        </View>
      </ScrollView>
    </Box>
  )
}
export default Screen
