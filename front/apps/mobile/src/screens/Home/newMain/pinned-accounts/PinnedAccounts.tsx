import { Pin } from 'geist-native-icons';

import { Box, Icon, Text, Button } from '@ledget/native-ui';

const PinnedAccounts = () => {
  return (
    <>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginBottom="ns"
      >
        <Box alignItems="center" flexDirection="row" gap="xs">
          <Icon icon={Pin} size={16} color="tertiaryText" />
          <Text color="tertiaryText">Accounts</Text>
        </Box>
        <Button label="Edit" textColor="tertiaryText" />
      </Box>
      <Box variant="nestedContainer"></Box>
    </>
  );
};

export default PinnedAccounts;
