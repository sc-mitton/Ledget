import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    position: 'relative'
  },
  measuringItem: {
    position: 'absolute'
  },
  measuringItemContainer: {
    position: 'relative',
    width: '100%',
    opacity: 0
  },
  ghosts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    opacity: 0
  }
});

export default styles;
