import { View, TouchableOpacity } from 'react-native';
import { Plus } from 'geist-native-icons';
import { Trash2 } from 'geist-native-icons';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import styles from './styles/household';
import { Text, BoxHeader, ChevronTouchable, ShimmerBox, Avatar, Icon, Box } from '@ledget/native-ui';
import { useGetCoOwnerQuery, useGetMeQuery, useDeleteCoOwnerMutation } from '@ledget/shared-features';

const Swipeable = () => {
  const { data: coOwner } = useGetCoOwnerQuery();
  const [deleteCoOwner] = useDeleteCoOwnerMutation();

  return (
    <ReanimatedSwipeable
      renderRightActions={() => (
        <TouchableOpacity onPress={() => deleteCoOwner()}>
          <Box
            backgroundColor='alert'
            padding='s'
            borderRadius={8}
            style={styles.rightAction}
          >
            <Icon icon={Trash2} />
          </Box>
        </TouchableOpacity>
      )}
    >
      <View style={styles.row}>
        <Avatar name={coOwner?.name} size='s' />
        <Text>{coOwner && `${coOwner?.name.first} ${coOwner?.name.last}`}</Text>
      </View>
    </ReanimatedSwipeable>
  )
}

const Household = () => {
  const { isLoading } = useGetCoOwnerQuery();
  const { data: user } = useGetMeQuery();

  return (
    <>
      <BoxHeader key='household-header'>Household</BoxHeader>
      <ShimmerBox
        shimmering={isLoading}
        placeholder='placeholder'
        key='household-box'
        variant='nestedContainer'
        backgroundColor='nestedContainer'>
        {user?.co_owner
          ? <Swipeable />
          : <ChevronTouchable iconOverride={Plus}>
            <Text>Acount Member</Text>
          </ChevronTouchable>}
      </ShimmerBox>
    </>
  )
}

export default Household
