import { StyleSheet } from "react-native";

export default StyleSheet.create({
  header: {
    paddingBottom: 8,
    position: 'relative',
    zIndex: 5
  },
  userInfoContainer: {
    gap: 20,
    paddingRight: 26
  },
  userInfo: {
    flex: 3,
    marginVertical: 6,
    marginLeft: 8
  },
  background: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
  },
});
