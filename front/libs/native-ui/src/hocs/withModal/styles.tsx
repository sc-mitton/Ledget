import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    zIndex: 100,
  },
  floatedContentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  topModal: {
    top: 0,
    left: 0,
    right: 0,
  },
  floatModal: {
    left: 24,
    right: 24,
    bottom: 64
  },
  bottomModalContent: {
    paddingHorizontal: 16,
    paddingTop: 24
  },
  topModalContent: {
    paddingHorizontal: 12,
    paddingTop: 64,
  },
  floatModalContent: {
    padding: 24,
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
  floatModalBackground: {
    borderRadius: 24,
  },
});
