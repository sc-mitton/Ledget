
import { Box, Text, BoxHeader } from '@ledget/native-ui';
import { useGetCoOwnerQuery, useGetMeQuery } from '@ledget/shared-features';
import { ChevronRightButton } from './shared';

const Household = () => {
  const { data: coOwner } = useGetCoOwnerQuery();
  const { data: user } = useGetMeQuery();

  return (
    <>
      <BoxHeader key='household-header'>Household</BoxHeader>
      <Box key='household-box' variant='nestedContainer' backgroundColor='nestedContainer'>
        <Text>
          {user?.co_owner
            ? coOwner && `${coOwner?.name.first} ${coOwner?.name.last}`
            : 'No household members'}
        </Text>
        <ChevronRightButton onPress={() => console.log('edit')} />
      </Box>
    </>
  )
}

export default Household
