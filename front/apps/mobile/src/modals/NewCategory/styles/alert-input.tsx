import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  alerts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 16,
    paddingTop: 4,
    paddingBottom: 12,
  },
  indexCircle: {
    borderRadius: 24,
    padding: 2,
    width: 24,
    height: 24,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexText: {
    transform: [{ translateY: -1 }]
  },
  plusIcon: {
    marginLeft: 4
  },
  modalContent: {
    marginBottom: -24,
  },
  sliderContainer: {
    marginVertical: 16,
    paddingHorizontal: 6
  },
  animatedNumbersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16
  },
  animatedNumbers: {
    fontFamily: 'SourceSans3-Regular',
    fontSize: 36,
    color: 'white',
  },
  container: {
    gap: 8,
  },
  alert: {
    flexDirection: 'row',
    marginRight: 2
  },
  addButton: {
    flexDirection: 'row',
    gap: 8
  },
  clearButton: {
    justifyContent: 'flex-end',
  }
});

export default styles;
