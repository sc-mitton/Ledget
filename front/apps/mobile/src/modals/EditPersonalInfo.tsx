import { useEffect } from 'react';
import { View, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod';

import styles from './styles/edit-personal-info';
import {
  Header,
  Text,
  SubmitButton,
  Modal,
  TextInput,
  Box,
  Seperator,
} from '@ledget/native-ui'
import { useLazyGetSettingsFlowQuery, useCompleteSettingsFlowMutation } from '@/features/orySlice';
import { useUpdateUserMutation, useGetMeQuery } from '@ledget/shared-features'
import { useNativeFlow } from '@ledget/ory';
import { ModalScreenProps } from '@types';

const schema = z.object({
  first: z.string().min(1, { message: 'First name is required' }),
  last: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email().min(1, { message: 'Email is required' }),
})

const EditPersonalInfo = (props: ModalScreenProps<'EditPersonalInfo'>) => {
  const [updateUser, { isSuccess, isLoading }] = useUpdateUserMutation()
  const { data: user } = useGetMeQuery()
  const { fetchFlow, flowStatus, submitFlow } = useNativeFlow(
    useLazyGetSettingsFlowQuery,
    useCompleteSettingsFlowMutation,
    'settings'
  );

  const { control, handleSubmit, formState: { errors, dirtyFields } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      first: user?.name.first,
      last: user?.name.last,
      email: user?.email
    }
  })

  useEffect(() => { fetchFlow() }, [])

  const onSave = () => {
    handleSubmit((data) => {
      const { email, ...rest } = data
      if (dirtyFields.email) {
        submitFlow({ email, method: 'profile' })
      }
      updateUser({ name: rest })
    })()
  }

  return (
    <Modal>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <View style={styles.headerContainer}>
            <Header>Edit</Header>
            <Text color='secondaryText'>
              Edit your personal information
            </Text>
          </View>
          <Seperator backgroundColor='modalSeperator' />
          <Box marginVertical='l'>
            <View style={styles.splitInputs}>
              <View style={styles.splitInput}>
                <Controller
                  control={control}
                  name="first"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="First Name"
                      value={value}
                      onChangeText={onChange}
                      error={errors.first}
                    />
                  )}
                />
              </View>
              <View style={styles.splitInput}>
                <Controller
                  control={control}
                  name="last"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Last Name"
                      value={value}
                      onChangeText={onChange}
                      error={errors.last}
                    />
                  )}
                />
              </View>
            </View>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  error={errors.email}
                />
              )}
            />
          </Box>
          <SubmitButton
            label="Save"
            isSubmitting={isLoading}
            isSuccess={isSuccess}
            variant='main'
            onPress={onSave}
          />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
};

export default EditPersonalInfo
