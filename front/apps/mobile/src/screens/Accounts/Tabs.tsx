import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate } from 'react-native-reanimated';
import { Clock, CreditCard, TrendingUp } from 'geist-native-icons';

import styles from './styles/tabs';
import { CurrencyNote } from '@ledget/media/native';
import { Button, Icon } from '@ledget/native-ui';
import { AccountsTabsScreenProps } from '@types';

const Tabs = () => {
  const { navigation } = useNavigation<AccountsTabsScreenProps<'Deposits' | 'Credit' | 'Investment' | 'Loan'>>()

  return (
    <ScrollView horizontal style={styles.tabs}>
      <Button
        label='Deposits'
        onPress={() => navigation.navigate('Deposits', { account: undefined })}
      >
        <Icon icon={CurrencyNote} />
      </Button>
      <Button
        label='Credit'
        onPress={() => navigation.navigate('Credit', { account: undefined })}
      >
        <Icon icon={CreditCard} />
      </Button>
      <Button
        label='Investment'
        onPress={() => navigation.navigate('Investment', { account: undefined })}
      >
        <Icon icon={TrendingUp} />
      </Button>
      <Button
        label='Loan'
        onPress={() => navigation.navigate('Loan', { account: undefined })}
      >
        <Icon icon={Clock} />
      </Button>
    </ScrollView>
  )
}

export default Tabs
