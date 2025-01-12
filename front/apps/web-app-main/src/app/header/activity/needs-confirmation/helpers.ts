// Sizing (in ems)
const translate = 1;
const expandedTranslate = 6.25;
const scale = 0.1;
const stackMax = 2;

const _getOpacity = (index: number) => {
  const belowStackMax = index > stackMax;
  return belowStackMax && index !== 0 ? 0 : 1;
};

const _getY = (index: number, loaded = true) => {
  if (!loaded) {
    return `${index ** 2 * 0.3125 + 1.875}em`;
  }

  if (index === 0) {
    return `${index * expandedTranslate + 0.5}em`;
  } else {
    if (index > stackMax) {
      return `${stackMax * translate + 0.5}em`;
    } else {
      return `${index * translate + 0.5}em`;
    }
  }
};

export { _getOpacity, _getY };
