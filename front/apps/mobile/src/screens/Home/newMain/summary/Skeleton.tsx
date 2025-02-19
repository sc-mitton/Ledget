import { Box, PulseText } from '@ledget/native-ui';

const Summary = () => {
  return (
    <>
      <Box flexDirection="row" gap="m" padding="l">
        <Box flex={1} flexDirection="column" alignItems="flex-start" gap="m">
          <PulseText width={75} borderRadius="xxs" />
          <PulseText width={120} numberOfLines={2} borderRadius="s" />
          <PulseText width={50} borderRadius="xxs" />
        </Box>
        <Box flex={1} flexDirection="column" alignItems="flex-start" gap="m">
          <PulseText width={75} borderRadius="xxs" />
          <PulseText width={120} numberOfLines={2} borderRadius="s" />
          <PulseText width={50} borderRadius="xxs" />
        </Box>
      </Box>
    </>
  );
};
export default Summary;
