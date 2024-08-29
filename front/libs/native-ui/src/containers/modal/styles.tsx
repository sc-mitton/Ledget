import { StyleSheet } from "react-native";

export default StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 20,
  },
  bottomModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  bottomFloatModal: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 48,
    borderRadius: 16,
    padding: 16,
  },
  topModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 16,
  },
  overlay: {
    opacity: 0.7,
  }
});
