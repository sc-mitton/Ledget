import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '52%',
    left: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    transformOrigin: 'center',
    width: 20,
    height: 20,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  animatedRingContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  ring: {
    width: '100%',
    height: '100%',
    borderWidth: 1.5,
    borderRadius: 20,
  }
});

export default styles;
