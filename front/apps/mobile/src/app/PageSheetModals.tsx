import { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import * as StatusBar from 'expo-status-bar';

import { PageSheetModalParamList, RootStackScreenProps } from '@types';
import { NewCategory, NewBill, PickHomeAccounts } from '@modals';
import { Box, Button, Text } from '@ledget/native-ui';
import { useAppearance } from '@/features/appearanceSlice';

const Stack = createStackNavigator<PageSheetModalParamList>();

const PageSheetModals = (props: RootStackScreenProps<'PageSheetModals'>) => {
  const { mode } = useAppearance();

  useEffect(() => {
    props.navigation.addListener('blur', () => {
      StatusBar.setStatusBarStyle(mode === 'dark' ? 'light' : 'dark');
    });
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        gestureDirection: 'vertical',
        headerShown: true,
        header: (props) => {
          if (mode === 'light') {
            StatusBar.setStatusBarStyle('light', true);
          }
          return (
            <Box
              flexDirection="row"
              borderTopEndRadius="xl"
              borderTopStartRadius="xl"
              backgroundColor="modalBox"
              paddingHorizontal="m"
              paddingTop="l"
              paddingBottom="s"
              justifyContent="space-between"
              alignItems="center"
              borderBottomColor="modalSeperator"
              borderBottomWidth={1.75}
            >
              <Button
                label="Cancel"
                textColor="blueText"
                variant="bold"
                onPress={() => props.navigation.goBack()}
              />
              <Text color="highContrastText">
                {props.options.title || props.route.name}
              </Text>
              <Box>
                {props.options.headerRight && props.options.headerRight({})}
              </Box>
            </Box>
          );
        },
        gestureEnabled: true,
        gestureResponseDistance: 70,
      }}
    >
      <Stack.Screen
        name="NewCategory"
        component={NewCategory}
        options={({ route }) => ({ title: route.params?.options?.title })}
      />
      <Stack.Screen
        name="NewBill"
        component={NewBill}
        options={({ route }) => ({ title: route.params?.options?.title })}
      />
      <Stack.Screen
        name="PickHomeAccounts"
        component={PickHomeAccounts}
        options={{ title: 'Pin Accounts' }}
      />
    </Stack.Navigator>
  );
};

export default PageSheetModals;
