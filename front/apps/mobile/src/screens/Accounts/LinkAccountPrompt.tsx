import { StyleSheet } from 'react-native';
import { ChevronRight } from 'geist-native-icons';
import { BlurView } from 'expo-blur';

import styles from './styles/link-account-prompt';
import { AccountsTabsScreenProps } from '@types';
import { Box, Icon, Button, Text } from '@ledget/native-ui';
import { useAppearance } from '@features/appearanceSlice';
import { useGetAccountsQuery } from '@ledget/shared-features';

const LinkAccountPrompt = (props: AccountsTabsScreenProps<any>) => {
  const { mode } = useAppearance();
  const { data } = useGetAccountsQuery();

  return (
    <>
      {data?.accounts.filter((a) => a.type === props.route.name.toLowerCase())
        .length === 0 && (
        <BlurView
          intensity={mode === 'dark' ? 20 : 15}
          tint={mode}
          style={[StyleSheet.absoluteFill, styles.blurView]}
        >
          <Box
            style={styles.addAccountButtonContainer}
            shadowColor="invertedText"
            shadowOpacity={1}
            shadowOffset={{ width: 0, height: 0 }}
            shadowRadius={12}
          >
            <Box
              style={styles.addAccountButtonContainer}
              shadowColor="invertedText"
              shadowOpacity={1}
              shadowOffset={{ width: 0, height: 0 }}
              shadowRadius={12}
            >
              <Text fontSize={18} style={[styles.message]} color="tertiaryText">
                No {props.route.name.toLowerCase()} accounts linked
              </Text>
              <Button
                style={styles.addAccountButton}
                textColor="blueText"
                label="Add Account"
                onPress={() =>
                  props.navigation.navigate('Profile', {
                    screen: 'Connections',
                    params: { screen: 'All' },
                  })
                }
                fontSize={18}
                labelPlacement="left"
                icon={
                  <Icon
                    icon={ChevronRight}
                    size={18}
                    strokeWidth={2}
                    color="blueText"
                  />
                }
              />
            </Box>
          </Box>
        </BlurView>
      )}
    </>
  );
};
export default LinkAccountPrompt;
