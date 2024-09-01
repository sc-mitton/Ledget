import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    height: 54,
    top: -16,
    left: 0,
    right: 0
  },
  title: {
    position: 'absolute'
  },
  backButton: {
    left: 16,
    position: 'absolute'
  },
  seperator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    opacity: 0.9
  }
});

export default styles;
