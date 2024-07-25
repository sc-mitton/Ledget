import { View } from 'react-native';

import { NestedScreenWOFeedback, Header } from '@ledget/native-ui';
import { ConnectionScreenProps } from '@types';
import { useGetPlaidItemsQuery } from '@ledget/shared-features';

const Screen = ({ navigation, route }: ConnectionScreenProps) => {
  const { data: plaidItems } = useGetPlaidItemsQuery();

  return (
    <NestedScreenWOFeedback>
      <View>
        <Header>
          {plaidItems?.find((item) => item.id === route.params.item)?.institution.name}
        </Header>
      </View>
    </NestedScreenWOFeedback>
  )
}

export default Screen
