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
  cardWrapperBorderOuter: {
    position: 'absolute',
    top: -11.5,
    left: -11,
    right: -11,
    bottom: -11.5
  },
  cardWrapperBorderInner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cardsContainer: {
    flex: 1,
    position: 'relative',
  },
  gridContainerViewStyle: {
    paddingVertical: 32,
  },
  gridContainer: {
    paddingVertical: 0
  },
  spacer: {
    height: 0
  }
});

export default styles;
