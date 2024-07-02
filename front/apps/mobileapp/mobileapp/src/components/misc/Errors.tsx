import { View } from 'react-native'
import React from 'react'
import { AlertCircle } from 'geist-icons-native'

import { Icon } from '../restyled/Icon'
import styles from './styles/errors'

export const ErrorTip = () => (
  <View style={styles.errorTip}>
    <Icon icon={AlertCircle} color='alert' borderColor='invertedText' />
  </View>
)
