import { StyleSheet } from "react-native";

export default StyleSheet.create({
  full: {
    flex: 1
  },
  header: {
    paddingBottom: 8,
  },
  scrollView: {
    position: 'relative',
  },
  animatedHeader: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    width: "100%",
    overflow: "hidden",
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
  optionsContainer: {
    flexDirection: 'column',
    marginLeft: 20,
    marginRight: 24,
    marginVertical: 20,
    gap: 8,
    paddingVertical: 16,
  }
});
