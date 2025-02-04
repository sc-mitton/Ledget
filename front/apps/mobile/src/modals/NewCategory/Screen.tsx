import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useForm, Controller, useController, useWatch } from 'react-hook-form';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Emoji } from 'geist-native-icons';
import Big from 'big.js';

import styles from './styles/screen';
import {
  Box,
  Button,
  Icon,
  TextInput,
  SubmitButton,
  Text,
  TextInputbase,
  InputLabel,
  EmojiPicker,
  MoneyInput,
  ModalPicker,
} from '@ledget/native-ui';
import { useAddNewCategoryMutation } from '@ledget/shared-features';
import { PageSheetModalScreenProps } from '@types';
import { categorySchema } from '@ledget/form-schemas';
import AlertInput from './AlertInput';

const Screen = (props: PageSheetModalScreenProps<'NewCategory'>) => {
  const { control, handleSubmit } = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    reValidateMode: 'onChange',
    defaultValues: {
      period: props.route.params?.period || 'month',
      ...props.route.params?.category,
    },
  });
  const [addNewCategory, { isLoading, isSuccess }] =
    useAddNewCategoryMutation();

  const emoji = useWatch({ control, name: 'emoji' });
  const limit_amount = useWatch({ control, name: 'limit_amount' });

  const onSubmit = (data: z.infer<typeof categorySchema>) => {
    addNewCategory(data);
  };

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Button
          label="Done"
          variant="bold"
          textColor="blueText"
          onPress={() => handleSubmit(onSubmit)()}
        />
      ),
    });
  }, []);

  useEffect(() => {
    if (isSuccess) {
      props.navigation.goBack();
    }
  }, [isSuccess]);

  const {
    field: { onChange: onEmojiChange },
    formState: { errors },
  } = useController({ control, name: 'emoji' });

  return (
    <Box backgroundColor="modalBox100" style={styles.modalContent}>
      <ScrollView
        contentContainerStyle={styles.form}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <InputLabel>Name</InputLabel>
          <EmojiPicker
            value={emoji}
            onChange={onEmojiChange}
            title="Emoji"
            as="modal"
          >
            <View style={styles.emojiButton}>
              <EmojiPicker.Trigger>
                <TextInputbase>
                  {emoji ? (
                    <Text>{emoji}</Text>
                  ) : (
                    <Icon icon={Emoji} color="placeholderText" size={24} />
                  )}
                </TextInputbase>
              </EmojiPicker.Trigger>
            </View>
          </EmojiPicker>
          <View style={styles.nameInput}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.name}
                />
              )}
              name="name"
              rules={{ required: 'Category name is required' }}
            />
          </View>
        </View>
        <Controller
          name="period"
          render={({ field }) => (
            <ModalPicker
              label="Period"
              chevronDirection="down"
              isFormInput={true}
              header="Period"
              valueKey={'value'}
              defaultValue={{
                value: field.value,
                label: field.value === 'month' ? 'Monthly' : 'Yearly',
              }}
              onChange={field.onChange}
              options={[
                { label: 'Monthly', value: 'month' },
                { label: 'Yearly', value: 'year' },
              ]}
            />
          )}
          control={control}
        />
        <Controller
          name="limit_amount"
          render={({ field }) => (
            <MoneyInput
              label="Limit"
              defaultValue={field.value}
              onChange={(v) => {
                field.onChange(
                  Big(v || 0)
                    .times(100)
                    .toNumber()
                );
              }}
              inputType="single"
              error={errors.limit_amount}
              accuracy={2}
            />
          )}
          control={control}
        />
        {limit_amount > 0 && <AlertInput control={control} />}
        <Animated.View style={styles.saveButton} layout={LinearTransition}>
          <SubmitButton
            variant="main"
            label="Save"
            isSubmitting={isLoading}
            isSuccess={isSuccess}
            onPress={() => handleSubmit(onSubmit)()}
          />
        </Animated.View>
      </ScrollView>
    </Box>
  );
};
export default Screen;
