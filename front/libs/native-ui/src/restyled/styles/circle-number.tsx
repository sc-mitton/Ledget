import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  circleNumberContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    zIndex: -1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleNumber: {
    position: "absolute",
    borderRadius: 100,
  }
});

export default styles;
