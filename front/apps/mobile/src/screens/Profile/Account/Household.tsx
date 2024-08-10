
import { Text, BoxHeader, ChevronTouchable, ShimmerBox, Avatar } from '@ledget/native-ui';
import { useGetCoOwnerQuery, useGetMeQuery } from '@ledget/shared-features';

const Household = () => {
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
        <ChevronTouchable>
          <Avatar name={coOwner?.name} size='s' />
          <Text>
            {user?.co_owner
              ? coOwner && `${coOwner?.name.first} ${coOwner?.name.last}`
              : 'No household members'}
          </Text>
        </ChevronTouchable>
      </ShimmerBox>
    </>
  )
}

export default Household
