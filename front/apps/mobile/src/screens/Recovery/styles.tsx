import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  form: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 80,
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
    top: '50%',
    left: '50%',
    zIndex: 0,
    transform: [{ translateX: -27 }, { translateY: -27 }],
    justifyContent: 'center',
    alignContent: 'center',
  },
})

export default styles;
