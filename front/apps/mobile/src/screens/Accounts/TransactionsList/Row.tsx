import { View } from 'react-native';
import dayjs from 'dayjs';

import styles from './styles/transactions';
import { Hourglass } from '@ledget/media/native';
import { Transaction } from '@ledget/shared-features';
import { Section } from './types';
import {
  DollarCents,
  Text,
  Seperator,
  Icon
} from '@ledget/native-ui';

const Row = (props: Partial<Transaction> & { section: Section }) => {
  return (
    <>
      <Seperator backgroundColor={props.section.index !== 0 ? 'lightseperator' : 'transparent'} />
      <View style={styles.transactionRow}>
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
                  : props.name
              }
            </Text>
          </View>
          <View style={styles.bottomRow}>
            <Text color='quaternaryText' fontSize={15}>
              {dayjs(props.date).format('M/D/YYYY')}
            </Text>
          </View>
        </View>
        <View style={styles.rightColumn}>
          <DollarCents
            fontSize={15}
            value={props.amount || 0}
            color={(props.amount || 0) < 0 ? 'greenText' : 'mainText'}
          />
        </View>
      </View>
    </>
  )
}

export default Row
