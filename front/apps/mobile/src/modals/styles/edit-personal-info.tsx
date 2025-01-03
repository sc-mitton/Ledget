import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  modalBackground: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 12,
  },
  headerContainer: {
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splitInputs: {
    flexDirection: 'row',
    gap: 8,
  },
  splitInput: {
    flex: 1,
  },
});
