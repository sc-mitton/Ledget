import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12
  },
  scrollView: {
    flex: 1
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
    gap: 12,
    flex: 1
  },
  scrollContent: {
    flex: 1
  }
});

export default styles;
