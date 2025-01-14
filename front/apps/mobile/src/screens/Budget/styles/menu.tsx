import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    right: 26,
    flexDirection: 'row',
    gap: 10,
  },
  iconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: 24,
  },
  buttonIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginHorizontal: 4,
  },
});

export default styles;
