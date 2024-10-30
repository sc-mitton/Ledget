import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  windowButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    transform: [{ translateY: 2 }],
    alignItems: 'center',
    gap: 6,
  },
  squareTitleContainer: {
    alignItems: 'flex-start',
    gap: 4,
    marginTop: 4,
    marginLeft: 6
  },
  rectangleTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
    marginHorizontal: 6
  },
  squareTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: -4
  },
  rectangleTitle: {
    marginTop: 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8
  },
});

export default styles;
