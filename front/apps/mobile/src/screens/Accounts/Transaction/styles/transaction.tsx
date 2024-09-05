import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
  },
  tableLabels: {
    marginRight: 24
  },
  accountData: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  tableColumn: {
    gap: 8
  },
  budgetItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  }
});

export default styles;
