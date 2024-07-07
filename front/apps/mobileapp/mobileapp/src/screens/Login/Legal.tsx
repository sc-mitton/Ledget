import { Linking } from 'react-native'

import { Box, Button } from '@ledget/native-ui'
import { LANDING_URL } from '@env'

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
    <Box style={styles.legalFooter} variant='footer'>
      <Button
        label="Terms"
        onPress={() => openLink(`${LANDING_URL}/terms`)}
      />
      <Button
        label="Privacy"
        onPress={() => openLink(`${LANDING_URL}/privacy`)}
      />
    </Box>
  )
}
