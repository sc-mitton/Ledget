import { Send } from 'geist-native-icons';
import dayjs from 'dayjs';

import { Box, Button, DollarCents, Icon, Text } from '@ledget/native-ui';
import { ModalScreenProps } from '@/types';
import SlotNumbers from 'react-native-slot-numbers';

const Leftovers = (props: ModalScreenProps<'Leftovers'>) => {
  return (
    <Box
      flex={1}
      backgroundColor="modalBox"
      padding="pagePadding"
      paddingTop="statusBar"
      justifyContent="space-between"
      paddingBottom="xxl"
    >
      <Box justifyContent="center">
        <DollarCents fontSize={32} variant="bold" value={246200} />
        <Text color="secondaryText" marginLeft="xs">
          in leftovers since {dayjs().subtract(1, 'month').format('M/D/YY')}
        </Text>
        <Box
          variant="nestedContainer"
          backgroundColor="modalNestedContainer"
          height={70}
          width={'100%'}
        ></Box>
      </Box>
      <Box>
        <Button
          variant="main"
          onPress={() => {
            props.navigation.goBack();
          }}
          label="Transfer"
          labelPlacement="left"
          icon={<Icon icon={Send} size={16} />}
        />
        <Button
          variant="borderedGrayMain"
          backgroundColor="transparent"
          onPress={() => {
            props.navigation.goBack();
          }}
          label="Snooze until next month"
        />
      </Box>
    </Box>
  );
};

export default Leftovers;
