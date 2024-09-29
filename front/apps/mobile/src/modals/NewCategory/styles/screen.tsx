import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10
  },
  formHeader: {
    padding: 16
  },
  form: {
    paddingHorizontal: 16
  },
  row: {
    flexDirection: 'row',
    gap: 8
  },
  nameInput: {
    marginLeft: 72,
    marginTop: 8
  },
  emojiButton: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  }
});

export default styles;
