import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: 'relative'
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 6,
    alignItems: 'flex-start',
    position: 'relative',
    zIndex: 10
  },
  totalBalanceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft: 2,
    gap: 8,
    marginTop: -4
  },
  cardWrapper: {
  },
  cardsContainer: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: 8,
  },
  gridContainer: {
    paddingVertical: 0,
  },
  spacer: {
    height: 0
  }
});

export default styles;
