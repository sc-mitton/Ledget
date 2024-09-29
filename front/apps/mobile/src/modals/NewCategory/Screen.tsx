import { X } from 'geist-native-icons';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useForm, Controller, useController, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Smile } from 'geist-native-icons';

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
  EmojiPicker
} from "@ledget/native-ui"
import { useAddNewCategoryMutation } from '@ledget/shared-features';
import { ModalScreenProps } from '@types';
import { categorySchema } from '@ledget/form-schemas';
import { useEffect } from 'react';

const Screen = (props: ModalScreenProps<'NewCategory'>) => {
  const { control, handleSubmit } = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
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

  const { field: { onChange: onEmojiChange } } = useController({ control, name: 'emoji' });

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
                />
              )}
              name='name'
              rules={{ required: 'Category name is required' }}
            />
          </View>
        </View>
        <SubmitButton
          variant='main'
          label='Save'
          isSubmitting={isLoading}
          isSuccess={isSuccess}
          onPress={() => handleSubmit(onSubmit)()}
        />
      </ScrollView>
    </Box>
  )
}
export default Screen
