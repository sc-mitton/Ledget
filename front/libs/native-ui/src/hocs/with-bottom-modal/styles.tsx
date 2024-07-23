import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    zIndex: 100,
  },
  full: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContent: {
    paddingHorizontal: 16,
    paddingBottom: 64
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  background: {
    borderTopEndRadius: 24,
    borderTopStartRadius: 24,
  }
});
