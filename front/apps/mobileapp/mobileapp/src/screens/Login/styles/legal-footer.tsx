import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  legalFooter: {
    position: 'absolute',
    bottom: 0,
    zIndex: 100,
    paddingBottom: 28,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    opacity: .3,
    transform: [{ scale: .9 }]
  }
});

export default styles;
