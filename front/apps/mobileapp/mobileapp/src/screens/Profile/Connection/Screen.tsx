import { View } from 'react-native';

import { NestedScreenWOFeedback, Header, Base64Image } from '@ledget/native-ui';
import { ConnectionScreenProps } from '@types';
import { useGetPlaidItemsQuery } from '@ledget/shared-features';

import styles from './styles';

const Screen = ({ navigation, route }: ConnectionScreenProps) => {
  const { data: plaidItems } = useGetPlaidItemsQuery();

  return (
    <NestedScreenWOFeedback>
      <View style={styles.header}>
        <Header>
          {plaidItems?.find((item) => item.id === route.params.item)?.institution.name}
        </Header>
        <Base64Image data={plaidItems?.find((item) => item.id === route.params.item)?.institution.logo} />
      </View>
    </NestedScreenWOFeedback>
  )
}

export default Screen
