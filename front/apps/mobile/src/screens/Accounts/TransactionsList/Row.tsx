import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import dayjs from 'dayjs';

import styles from './styles/transactions';
import { Hourglass } from '@ledget/media/native';
import { Transaction } from '@ledget/shared-features';
import { Section } from './types';
import { DollarCents, Text, Icon, Box } from '@ledget/native-ui';

const Row = (
  props: Partial<Transaction> & { section: Section; index: number }
) => {
  return (
    <Animated.View
      style={styles.transactionRow}
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
    >
      <View style={styles.leftColumn}>
        <View style={styles.nameContainer}>
          {props.pending && <Icon icon={Hourglass} size={16} />}
          <Text fontSize={15}>
            {props.preferred_name
              ? props.preferred_name.length > 20
                ? props.preferred_name.slice(0, 20) + '...'
                : props.preferred_name
              : (props.name?.length || 0) > 20
              ? props.name?.slice(0, 20) + '...'
              : props.name}
          </Text>
        </View>
        <View style={styles.bottomRow}>
          <Text color="tertiaryText" fontSize={15}>
            {dayjs(props.date).format('M/D/YYYY')}
          </Text>
        </View>
      </View>
      <Box style={styles.rightColumn}>
        <DollarCents
          fontSize={15}
          value={props.amount || 0}
          color={(props.amount || 0) < 0 ? 'greenText' : 'mainText'}
        />
      </Box>
    </Animated.View>
  );
};

export default Row;
