import { StyleSheet } from "react-native";

export default StyleSheet.create({
  avatar: {
    borderRadius: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  background: {
    position: 'absolute',
    borderRadius: 200,
  },
  initials: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sCircle: {
    width: 32,
    height: 32,
  },
  mCircle: {
    width: 48,
    height: 48,
  },
  lCircle: {
    width: 54,
    height: 54,
  },
  s: {
    fontSize: 14,
    padding: 2
  },
  m: {
    fontSize: 20,
    padding: 4
  },
  l: {
    fontSize: 24,
    padding: 8
  }
});
