import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  pulseContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{ translateY: 32 }],
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  radialGradient: {
    position: 'absolute',
    borderRadius: 200,
  }
});

export default styles;
