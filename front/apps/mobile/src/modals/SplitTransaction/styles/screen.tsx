import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    marginVertical: 12,
    marginLeft: 12,
    gap: 4
  },
  formLabel: {
    marginBottom: 8,
    marginTop: 16
  },
  form: {
    justifyContent: 'space-between',
    marginBottom: 96
  },
  field: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 2,
    marginBottom: -8
  },
  categoryInput: {
    flex: 3,
  },
  amountInput: {
    flex: 2,
  },
  plusIcon: {
    marginLeft: 4
  },
  addSplitButton: {
    marginTop: -8,
    justifyContent: 'flex-start',
  },
  saveButton: {
    marginTop: 4
  }
});

export default styles;
