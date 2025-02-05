import { useEffect } from 'react';

import styles from './styles/screen';
import Menu from './Menu';
import RemindersBox from './RemindersBox';
import DetailsBox from './DetailsBox';
import HistoryBox from './HistoryBox';
import Header from './Header';
import { BudgetScreenProps } from '@types';
import { Box } from '@ledget/native-ui';
import { ScrollView } from 'react-native';

const Bill = (props: BudgetScreenProps<'Bill'>) => {
  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => <Menu {...props} />,
    });
  }, []);

  return (
    <Box variant="nestedScreen">
      <Header bill={props.route.params.bill} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <DetailsBox bill={props.route.params.bill} />
        <HistoryBox bill={props.route.params.bill} />
        <RemindersBox bill={props.route.params.bill} />
      </ScrollView>
    </Box>
  );
};
export default Bill;
