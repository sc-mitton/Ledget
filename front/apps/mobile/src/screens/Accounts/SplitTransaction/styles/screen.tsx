import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 16
  },
  formLabel: {
    marginBottom: 8,
    marginTop: 16
  },
  form: {
    flex: 1,
  },
  field: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 2,
    marginBottom: -8
  },
  categoryInput: {
    flex: 1,
  },
  amountInput: {
    flex: 1,
  },
  submitButtonContainer: {
    flex: 1,
    justifyContent: 'center',
  }
});

export default styles;
