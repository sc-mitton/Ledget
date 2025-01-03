import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 24,
  },
  headerButtons: {
    position: 'absolute',
    top: 10,
    left: 0,
    transform: [{ translateX: 16 }],
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    zIndex: 100,
  },
  header: {
    marginVertical: 12,
    marginLeft: 12,
    gap: 4,
  },
  inputLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    marginLeft: 4,
    gap: 12,
  },
  splitModalHeader: {
    width: '100%',
    marginTop: 36,
    marginBottom: 8,
    alignItems: 'center',
  },
  formLabel: {
    marginBottom: 8,
    marginTop: 16,
  },
  form: {
    justifyContent: 'space-between',
    marginBottom: 96,
  },
  field: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 2,
    marginBottom: -8,
  },
  categoryInput: {
    flex: 3,
  },
  amountInputContainer: {
    flex: 2,
  },
  plusIcon: {
    marginLeft: 4,
  },
  addSplitButton: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 8,
  },
});

export default styles;
