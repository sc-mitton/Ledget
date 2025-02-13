import { Box, PulseText } from '@ledget/native-ui';

const Skeleton = () => {
  return (
    <Box flexDirection="column" gap="m" width="100%">
      {Array.from({ length: 4 }).map((_, index) => (
        <Box
          key={index}
          marginVertical="xs"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box gap="s">
            <PulseText width={120} />
            <PulseText width={50} />
          </Box>
          <PulseText width={50} />
        </Box>
      ))}
    </Box>
  );
};
export default Skeleton;
