import { forwardRef, HTMLProps } from 'react';

import stylesModule from './dropdowndiv.module.scss';
import { useTransition, animated } from '@react-spring/web';

interface IDropdownDiv {
  visible: boolean;
  placement?: 'middle' | 'left' | 'right';
  verticlePlacement?: 'top' | 'bottom';
  transformOrigin?: 'center' | 'left' | 'right';
  arrow?: 'right';
}

type VerticlePlacement = IDropdownDiv['verticlePlacement'];
type HorizontalPlacement = IDropdownDiv['placement'];

const _get_verticle_positioning = (verticlePlacement: VerticlePlacement) => {
  if (verticlePlacement === 'top') {
    return {
      bottom: '0%',
      y: '0%',
    };
  } else {
    return {
      top: '100%',
      y: '0%',
    };
  }
};

const _get_horizontal_positioning = (placement: HorizontalPlacement) => {
  if (placement === 'middle') {
    return {
      left: '50%',
      x: '-50%',
    };
  } else if (placement === 'left') {
    return {
      left: '0%',
      x: '0%',
    };
  } else {
    return {
      left: '100%',
      x: '-100%',
    };
  }
};

const _get_transform_origin = (
  verticlePlacement: VerticlePlacement,
  placement: HorizontalPlacement
) => {
  if (verticlePlacement === 'top') {
    if (placement === 'middle') {
      return 'center bottom';
    } else if (placement === 'left') {
      return 'left bottom';
    } else {
      return 'right bottom';
    }
  } else {
    if (placement === 'middle') {
      return 'center top';
    } else if (placement === 'left') {
      return 'left top';
    } else {
      return 'right top';
    }
  }
};

export const DropdownDiv = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement> & IDropdownDiv
>((props, ref) => {
  const {
    visible,
    children,
    placement = 'middle',
    verticlePlacement = 'bottom',
    transformOrigin,
    style = {},
    className,
    arrow,
    ...rest
  } = props;

  const transitions = useTransition(visible, {
    from: {
      opacity: 0,
      ..._get_verticle_positioning(verticlePlacement),
      ..._get_horizontal_positioning(placement),
      transform: 'scale(0.85)',
      transformOrigin:
        transformOrigin || _get_transform_origin(verticlePlacement, placement),
    },
    enter: {
      opacity: 1,
      transform: 'scale(1)',
      ...style,
    },
    leave: {
      transform: 'scale(0.85)',
      opacity: 0,
    },
    config: {
      tension: 500,
      friction: 28,
      mass: 1,
    },
  });

  return transitions(
    (styles, item) =>
      item && (
        <div
          className={stylesModule.dropdownContainer}
          data-verticle-position={verticlePlacement}
          data-position={placement}
        >
          <animated.div
            className={[stylesModule.dropdown, `${className}`].join(' ')}
            data-arrow={arrow}
            data-verticle-position={verticlePlacement}
            data-position={placement}
            style={styles}
            {...rest}
            ref={ref}
          >
            {children}
          </animated.div>
        </div>
      )
  );
});
