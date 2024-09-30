import { StyleSheet } from "react-native";

export default StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 20,
  },
  bottomModalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
  },
  bottomFloatModalContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 48,
    justifyContent: 'flex-end',
  },
  centerFloatModalContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  topModalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  },
  bottomModal: {
    width: '100%',
    position: 'absolute',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  bottomFloatModal: {
    width: '100%',
    position: 'absolute',
    borderRadius: 16,
    padding: 16,
  },
  centerFloatModal: {
    width: '100%',
    position: 'absolute',
    borderRadius: 16,
    padding: 16,
  },
  topModal: {
    width: '100%',
    position: 'absolute',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 16,
  },
  overlay: {
    opacity: 0.7,
    position: 'absolute',
    top: '-100%',
    bottom: '-100%',
    left: 0,
    right: 0,

  }
});
