import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    height: 44,
    left: 0,
    right: 0,
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
    left: 0,
    right: 0,
    opacity: 0.9
  },
  menuContainer: {
    position: 'absolute',
    right: 26
  }
});

export default styles;
