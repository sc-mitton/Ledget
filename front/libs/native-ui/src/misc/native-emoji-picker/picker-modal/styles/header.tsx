import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    position: 'absolute',
  },
  seperator: {
    width: '200%',
    transform: [{ translateX: -300 }],
  },
});

export default styles;
