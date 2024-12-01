import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

import styles from './styles/account-screens';
import { AccountsScreenProps, AccountsTabsParamList } from '@types';
import { useTheme } from '@shopify/restyle';
import { DefaultHeader } from './Header';
import TabBar from './TabBar';
import DepositsPanel from './Depository/Panel';
import CreditPanel from './Credit/Panel';
import InvestmentPanel from './Investment/Panel';
import LoanPanel from './Loan/Panel';
import Menu from './Menu';

const Tab = createBottomTabNavigator<AccountsTabsParamList>()

const AccountTabs = (props: AccountsScreenProps<'AccountsTabs'>) => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: () => <Menu {...props} />,
        animation: 'fade',
        header: (props) => <DefaultHeader routeName={props.route.name} />
      }}
      backBehavior='history'
      tabBar={({ state, descriptors, navigation }) =>
        <View style={[
          { top: theme.spacing.statusBar + theme.textVariants.header.lineHeight + 24 },
          styles.tabBarContainer]
        }>
          <TabBar
            state={state}
            descriptors={descriptors}
            navigation={navigation}
          />
        </View>}
      initialRouteName='Depository'
    >
      <Tab.Screen name='Depository' component={DepositsPanel} />
      <Tab.Screen name='Credit' component={CreditPanel} />
      <Tab.Screen name='Investment' component={InvestmentPanel} />
      <Tab.Screen name='Loan' component={LoanPanel} />
    </Tab.Navigator>
  )
}

export default AccountTabs
