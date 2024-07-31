import { Linking, Platform } from 'react-native'

import { Box, Button } from '@ledget/native-ui'

import styles from './styles/legal-footer'

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
          ? process.env.IOS_LANDING_URL
          : process.env.ANDROID_LANDING_URL}/terms`)}
      />
      <Button
        variant='bold'
        label="Privacy"
        onPress={() => openLink(`${Platform.OS === 'ios'
          ? process.env.IOS_LANDING_URL
          : process.env.ANDROID_LANDING_URL}/privacy`)}
      />
    </Box>
  )
}
