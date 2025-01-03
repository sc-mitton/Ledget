import { Bell, Trash } from 'geist-native-icons';

import styles from './styles/reminders-box';
import { View } from 'react-native';
import { Bill } from '@ledget/shared-features';
import {
  Box,
  BoxHeader,
  CustomScrollView,
  Icon,
  Seperator,
  Text,
} from '@ledget/native-ui';

const Reminders = ({ bill }: { bill: Bill }) => {
  return (
    <>
      <BoxHeader>
        <View style={styles.bellIcon}>
          <Icon icon={Bell} size={16} color="tertiaryText" />
        </View>
        Reminders
      </BoxHeader>
      {bill.reminders?.length === 0 ? (
        <Box variant="nestedContainer" style={styles.emptyBox}>
          <Text color="tertiaryText">No reminders set</Text>
        </Box>
      ) : (
        <Box
          variant="nestedContainer"
          marginBottom="navHeight"
          style={styles.box}
        >
          <CustomScrollView
            peekabooScrollIndicator={true}
            style={styles.scrollView}
          >
            {bill.reminders?.map((reminder, index) => (
              <>
                {index !== 0 && (
                  <Seperator backgroundColor="nestedContainerSeperator" />
                )}
                <View style={styles.alert}>
                  <Box
                    backgroundColor="quinaryText"
                    borderRadius="circle"
                    padding="xs"
                    style={styles.alertCircle}
                  >
                    <Text color="secondaryText" style={styles.alertIndex}>
                      {index + 1}
                    </Text>
                  </Box>
                  <Text color="secondaryText">
                    {reminder.offset}
                    &nbsp;
                    {`${reminder.period}${reminder.offset > 1 ? 's' : ''}`}
                    &nbsp;
                    {'before'}
                  </Text>
                  <View style={styles.trashButton}>
                    <Icon icon={Trash} color="alert" />
                  </View>
                </View>
              </>
            ))}
          </CustomScrollView>
        </Box>
      )}
    </>
  );
};

export default Reminders;
