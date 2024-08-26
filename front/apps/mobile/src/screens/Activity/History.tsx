import { View } from 'react-native'

import { BottomDrawerModal, CustomScrollView } from '@ledget/native-ui'

const History = () => {


  return (
    <BottomDrawerModal.Content>
      <CustomScrollView scrollIndicatorInsets={{ right: -4 }}>

      </CustomScrollView>
    </BottomDrawerModal.Content>
  )
}

export default History
