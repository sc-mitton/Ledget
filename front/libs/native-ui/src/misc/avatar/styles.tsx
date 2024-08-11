import { StyleSheet } from "react-native";

export default StyleSheet.create({
  avatar: {
    borderRadius: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexDirection: 'row',
    gap: 2,
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
  xlCircle: {
    width: 64,
    height: 64,
  },
  s: {
    fontSize: 14,
  },
  m: {
    fontSize: 20,
  },
  l: {
    fontSize: 24,
  },
  xl: {
    fontSize: 32,
  },
  sContainer: {
    padding: 2,
  },
  mContainer: {
    padding: 4,
  },
  lContainer: {
    padding: 8,
  },
  xlContainer: {
    padding: 12,
  },
});
