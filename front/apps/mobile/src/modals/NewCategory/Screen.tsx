import { X } from 'geist-native-icons';
import { ScrollView, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import styles from './styles/screen';
import { Box, Button, Icon, TextInput, Header2, Seperator, SubmitButton } from "@ledget/native-ui"
import { useAddNewCategoryMutation } from '@ledget/shared-features';
import { ModalScreenProps } from '@types';
import { categorySchema } from '@ledget/form-schemas';
import { useEffect } from 'react';

const Screen = (props: ModalScreenProps<'NewCategory'>) => {
  const { control, handleSubmit } = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
  });
  const [addNewCategory, { isLoading, isSuccess }] = useAddNewCategoryMutation();

  const onSubmit = (data: z.infer<typeof categorySchema>) => {
    addNewCategory(data);
  }

  useEffect(() => {
    if (isSuccess) {
      props.navigation.goBack();
    }
  }, [isSuccess])

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
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label='Name'
              placeholder='Name'
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
          name='name'
          rules={{ required: 'Category name is required' }}
        />
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
