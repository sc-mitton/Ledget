import { View } from 'react-native';
import React from 'react';
import { AlertCircle } from 'geist-icons-native';

import { Icon } from '../../restyled/Icon';
import { Text } from '../../restyled/Text';
import styles from './styles';

export const ErrorTip = () => (
  <View style={styles.errorTip}>
    <Icon icon={AlertCircle} color='alert' borderColor='invertedText' />
  </View>
)

export const FormError = ({ error }: { error?: string | string[] }) => {
  return (
    <>
      {error && <View style={styles.formErrors}>
        {typeof error === 'string'
          ?
          <View>
            <View style={styles.formError}>
              <Icon icon={AlertCircle} color='alert' />
              <Text color='alert'>{error}</Text>
            </View>
          </View>
          : error?.map((er, i) => (
            <View key={i} style={styles.formError}>
              <Icon icon={AlertCircle} color='alert' />
              <Text color='alert'>{er}</Text>
            </View>
          ))
        }
      </View>}
    </>
  )
}
