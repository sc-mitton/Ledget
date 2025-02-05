import { View } from 'react-native';
import { CheckSquare, Info } from 'geist-native-icons';
import dayjs from 'dayjs';

import styles from './styles/details-box';
import { Box, Text, DollarCents, BoxHeader, Icon } from '@ledget/native-ui';
import { Bill } from '@ledget/shared-features';
import { getNextBillDate } from '@ledget/helpers';
import { getScheduleDescription } from '@helpers';

const DetailsBox = ({ bill }: { bill: Bill }) => {
  return (
    <View style={styles.container}>
      <BoxHeader>
        <View style={styles.infoIcon}>
          <Icon icon={Info} size={16} color="tertiaryText" />
        </View>
        Details
      </BoxHeader>
      <Box variant="nestedContainer">
        <View style={styles.column}>
          <Text color="tertiaryText">Amount</Text>
          <Text color="tertiaryText">Schedule</Text>
          <Text color="tertiaryText">Created</Text>
        </View>
        <View style={styles.column}>
          <Box flexDirection="row" gap={'s'}>
            {bill.lower_amount && <DollarCents value={bill.lower_amount} />}
            {bill.lower_amount && <Text>-</Text>}
            {bill.upper_amount && <DollarCents value={bill.upper_amount} />}
          </Box>
          <Text>{getScheduleDescription(bill)}</Text>
          <Text>{dayjs(bill.created).format('MMMM D, YYYY')}</Text>
        </View>
      </Box>
      <Box variant="nestedContainer" gap="xxl">
        <View style={styles.column}>
          <Text color="tertiaryText">Paid</Text>
          <Text color="tertiaryText">Next</Text>
          {bill.expires && <Text color="tertiaryText">Expires</Text>}
        </View>
        <View style={styles.column}>
          <Text color="tertiaryText">
            {bill.is_paid ? (
              <Box paddingTop="s">
                <Icon icon={CheckSquare} size={17} />
              </Box>
            ) : (
              '—'
            )}
          </Text>
          <Text>{getNextBillDate(bill)}</Text>
          {bill.expires && (
            <Text>{dayjs(bill.expires).format('MMMM D, YYYY')}</Text>
          )}
        </View>
      </Box>
    </View>
  );
};

export default DetailsBox;
