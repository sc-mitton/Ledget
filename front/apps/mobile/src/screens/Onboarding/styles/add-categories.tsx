import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  blurViewContainer: {
    zIndex: 10,
  },
  blurView: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  floatingAmountInput: {
    width: '100%'
  },
  form: {
    flexDirection: 'column',
    width: '100%',
    marginTop: 8,
    paddingHorizontal: 6,
    paddingBottom: 6,
    paddingTop: 12,
    overflow: 'hidden',
  },
  suggestionsFlatListContainer: {
    marginTop: -16
  },
  tabsBox: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 16
  },
  suggestionsGrid: {
    width: '100%',
    alignItems: 'center',
  },
  suggestionOption: {
    paddingVertical: 4,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 10,
    zIndex: 20
  },
  customButton: {
    marginTop: -12,
    alignItems: 'center',
    width: '100%',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 16,
    marginLeft: 4
  },
  flatList: {
    maxHeight: 375,
    paddingRight: 12,
    marginRight: -12,
  }
});

export default styles;
