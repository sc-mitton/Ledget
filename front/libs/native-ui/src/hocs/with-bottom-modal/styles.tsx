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
  },
  bottomModal: {
    bottom: 0,
    left: 0,
    right: 0,
  },
  centerModal: {
    top: '50%',
    left: '50%',
  },
  topModal: {
    top: 0,
    left: 0,
    right: 0,
  },
  bottomModalContent: {
    paddingHorizontal: 16,
    paddingBottom: 64
  },
  topModalContent: {
    paddingHorizontal: 16,
    paddingTop: 64,
  },
  centerModalContent: {
    paddingHorizontal: 32,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  bottomModalBackground: {
    borderTopEndRadius: 24,
    borderTopStartRadius: 24,
  },
  topModalBackground: {
    borderBottomEndRadius: 24,
    borderBottomStartRadius: 24,
  },
  centerModalBackground: {
    borderRadius: 24,
  },
});
