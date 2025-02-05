import { View } from 'react-native';
import { AlertCircle } from 'geist-native-icons';

import styles from './styles';
import { Icon } from '../../restyled/Icon';
import { Text } from '../../restyled/Text';
import { Box } from '../../restyled/Box';

export const ErrorTip = () => (
  <View style={styles.errorTip}>
    <Icon icon={AlertCircle} color="alert" borderColor="invertedText" />
  </View>
);

export const FormError = ({ error }: { error?: string | string[] }) => {
  return (
    <>
      {error && (
        <Box style={styles.formErrors} marginBottom="s">
          {typeof error === 'string' ? (
            <View>
              <View style={styles.formError}>
                <Icon icon={AlertCircle} color="alert" />
                <Text color="alert">{error}</Text>
              </View>
            </View>
          ) : (
            error?.map((er, i) => (
              <View key={i} style={styles.formError}>
                <Icon icon={AlertCircle} color="alert" />
                <Text color="alert">{er}</Text>
              </View>
            ))
          )}
        </Box>
      )}
    </>
  );
};
