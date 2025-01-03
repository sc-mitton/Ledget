import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  emojiContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  rectangleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: '100%',
    paddingLeft: 24,
  },
  squareContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: '100%',
  },
  rectangleCell: {
    height: '50%',
    width: '50%',
    justifyContent: 'center',
  },
  squareCell: {
    height: '50%',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

export default styles;
