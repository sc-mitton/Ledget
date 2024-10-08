import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  closeButton: {
    zIndex: 10,
    position: 'absolute',
    top: 16,
    right: 16,
  },
  formHeader: {
    padding: 16
  },
  saveButton: {
    marginTop: 12
  },
  form: {
    paddingHorizontal: 16
  },
  nameInput: {
    marginLeft: 72,
    marginTop: 8
  },
  emojiButton: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  moneyInputs: {
    flexDirection: 'row',
    gap: 12
  },
  checkBoxContainer: {
    marginLeft: 4
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16
  },
});

export default styles;
