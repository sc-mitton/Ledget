import { Linking, Platform } from 'react-native';

import { Box, Button, Text } from '@ledget/native-ui';

import styles from './styles/legal-footer';
import { ANDROID_LANDING_URL, IOS_LANDING_URL } from '@env';

export default function LegalFooter() {
  const openLink = (url: string) => {
    try {
      Linking.openURL(url);
    } catch (error) {
      console.error('Error opening link', error);
    }
  };

  return (
    <Box
      style={[
        styles.legalFooter,
        Platform.OS === 'ios' && styles.legalFooterIOS,
      ]}
      variant="footer"
      flexDirection="column"
      alignItems="center"
    >
      <Text fontSize={15} color="secondaryText" style={styles.firstline}>
        By continuing, you agree to our
      </Text>
      <Box flexDirection="row" alignItems="baseline">
        <Button
          variant="bold"
          label="Terms"
          fontSize={14}
          onPress={() =>
            openLink(
              `${
                Platform.OS === 'ios' ? IOS_LANDING_URL : ANDROID_LANDING_URL
              }/terms`
            )
          }
        />
        <Text fontSize={14} color="secondaryText">
          and
        </Text>
        <Button
          variant="bold"
          fontSize={14}
          label="Privacy Policy"
          onPress={() =>
            openLink(
              `${
                Platform.OS === 'ios' ? IOS_LANDING_URL : ANDROID_LANDING_URL
              }/privacy`
            )
          }
        />
      </Box>
    </Box>
  );
}
