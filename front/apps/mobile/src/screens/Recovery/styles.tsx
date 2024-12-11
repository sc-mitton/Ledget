import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  form: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  graphicContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
  },
  icon: {
    position: 'relative',
    zIndex: 1,
  },
  iconBackgroundContainer: {
    position: 'absolute',
    left: 2,
    top: 6,
    right: 2,
    bottom: 6,
    zIndex: -1,
    borderRadius: 12,
    justifyContent: 'center',
    alignContent: 'center',
  },
  header: {
    marginTop: 16
  }
})

export default styles;
