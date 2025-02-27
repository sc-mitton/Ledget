import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  form: {
    justifyContent: 'center',
    flex: 1,
    flexGrow: 1,
  },
  bottomButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 48,
  },
  questionMark: {
    position: 'absolute',
    top: 4,
    left: 8,
    transform: [{ scale: 0.6 }],
  },
  forgotIconContainer: {
    position: 'relative',
  },
});

export default styles;
