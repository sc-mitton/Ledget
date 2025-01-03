import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  trashIconContainer: {
    position: 'absolute',
    alignItems: 'center',
    gap: 4,
    flexDirection: 'row',
    zIndex: -1,
    right: 12,
    top: '50%',
  },
  trashIcon: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    right: 0,
  },
  container: {
    position: 'relative',
    marginVertical: 4,
  },
});

export default styles;
