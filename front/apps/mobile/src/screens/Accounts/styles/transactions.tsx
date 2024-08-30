import { StyleSheet } from "react-native";

export default StyleSheet.create({
  boxContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0
  },
  box: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    width: '100%',
    height: '100%',
  },
  dragBar: {
    width: 64,
    height: 5,
    borderRadius: 5,
    position: 'absolute',
    top: 10,
    left: '50%',
    transform: [
      { translateX: -32 },
      { translateY: -1.5 }
    ]
  },
  dragBarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 34,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  }
});
