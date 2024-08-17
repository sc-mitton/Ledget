import { Plus } from 'geist-native-icons';

import { Text, BoxHeader, ChevronTouchable, ShimmerBox, Avatar } from '@ledget/native-ui';
import { useGetCoOwnerQuery, useGetMeQuery } from '@ledget/shared-features';
import { setModal } from '@features/modalSlice';
import { ProfileScreenProps } from '@types';
import { useAppDispatch } from '@hooks';

const Household = (props: ProfileScreenProps<'Main'>) => {
  const dispatch = useAppDispatch();
  const { data: coOwner, isLoading } = useGetCoOwnerQuery();
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
          ?
          <ChevronTouchable onPress={() => props.navigation.navigate('CoOwner')}>
            <Avatar name={coOwner?.name} size='s' />
            <Text>{coOwner && `${coOwner?.name.first} ${coOwner?.name.last}`}</Text>
          </ChevronTouchable>
          :
          <ChevronTouchable iconOverride={Plus} onPress={() => dispatch(setModal('addCoOwner'))}>
            <Text>Add Acount Member</Text>
          </ChevronTouchable>}
      </ShimmerBox>
    </>
  )
}

export default Household
