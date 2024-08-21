// Sizing (in ems)
const EXPANDED_GAP = 14;
const SCALE = .07;
const STACK_MAX = 2;

const _getOpacity = (index: number, expanded: boolean) => {
  if (expanded) {
    return 1
  } else {
    return index > STACK_MAX ? 0 : 1
  }
}

const _getScale = (index: number, expanded: boolean, loaded = true,) => {

  if (!loaded) {
    return 1 - ((index + 1) * SCALE * 2)
  }

  if (expanded) {
    return 1
  } else {
    if (index > STACK_MAX) {
      return 1 - (STACK_MAX * SCALE)
    } else {
      return 1 - (index * SCALE)
    }
  }
}

const _getY = (index: number, expanded: boolean, loaded = true, height: number) => {
  if (!loaded) {
    return (EXPANDED_GAP * 12) * index + 13
  }

  if (index === 0 || expanded) {
    return (EXPANDED_GAP + height) * index
  } else {
    if (index > STACK_MAX) {
      return (EXPANDED_GAP) * STACK_MAX
    } else {
      return (EXPANDED_GAP) * index
    }
  }
}

export {
  _getOpacity,
  _getScale,
  _getY,
  EXPANDED_GAP,
  SCALE,
  STACK_MAX
}
