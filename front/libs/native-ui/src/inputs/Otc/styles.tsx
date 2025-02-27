import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  otcContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 2,
  },
  otcInputContainer2: {
    width: 48,
    height: 58,
    lineHeight: 36,
    borderRadius: 14,
    position: 'relative',
  },
  otcInputContainer1: {
    width: '100%',
    height: '100%',
    fontSize: 24,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
  },
  otcInput: {
    width: '100%',
    height: '100%',
    verticalAlign: 'middle',
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'SourceSans3Regular',
  },
  dash: {
    width: 8,
    height: 2,
    borderRadius: 8,
  },
});

export default styles;
