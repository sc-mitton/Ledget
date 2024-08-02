import { Linking, Platform } from 'react-native'

import { Box, Button } from '@ledget/native-ui'

import styles from './styles/legal-footer'
import { ANDROID_LANDING_URL, IOS_LANDING_URL } from '@env'

export default function LegalFooter() {

  const openLink = (url: string) => {
    try {
      Linking.openURL(url)
    } catch (error) {
      console.error('Error opening link', error)
    }
  }

  return (
    <Box style={[styles.legalFooter, Platform.OS === 'ios' && styles.legalFooterIOS]} variant='footer'>
      <Button
        variant='bold'
        label="Terms"
        onPress={() => openLink(`${Platform.OS === 'ios'
          ? IOS_LANDING_URL
          : ANDROID_LANDING_URL}/terms`)}
      />
      <Button
        variant='bold'
        label="Privacy"
        onPress={() => openLink(`${Platform.OS === 'ios'
          ? IOS_LANDING_URL
          : ANDROID_LANDING_URL}/privacy`)}
      />
    </Box>
  )
}
