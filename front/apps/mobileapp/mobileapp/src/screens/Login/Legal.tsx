import { Linking } from 'react-native'

import { Box, Button } from '@components'
import { LANDING_URL } from '@env'

import styles from './styles/legal-footer'

export default function LegalFooter() {

  const openLink = (url: string) => {
    console.log('Opening link', url)
    console.log(process.env.NODE_ENV)
    try {
      Linking.openURL(url)
    } catch (error) {
      console.error('Error opening link', error)
    }
  }

  return (
    <Box style={styles.legalFooter}>
      <Button
        label="Terms"
        onPress={() => openLink(`${LANDING_URL}/terms-and-conditions`)}
      />
      <Button
        label="Privacy"
        onPress={() => openLink(`${LANDING_URL}/privacy-policy`)}
      />
    </Box>
  )
}
