import {
  forwardRef,
  HTMLProps,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import stylesModule from './dropdowndiv.module.scss';
import { useTransition, animated } from '@react-spring/web';
import type {
  VerticlePlacement,
  HorizontalPlacement,
  IDropdownDiv,
} from './types';

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
  placement: HorizontalPlacement,
  verticlePlacement: VerticlePlacement
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

const _get_auto_placement_positioning = (pos: { x: number; y: number }) => {
  let horizontalPlacement: HorizontalPlacement;
  let verticlePlacement: VerticlePlacement;
  if (pos.x > window.innerWidth / 2) {
    horizontalPlacement = 'right';
  } else {
    horizontalPlacement = 'left';
  }

  if (pos.y < window.innerHeight / 2) {
    verticlePlacement = 'bottom';
  } else {
    verticlePlacement = 'top';
  }

  return [horizontalPlacement, verticlePlacement] as const;
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

  const measure = useRef<HTMLDivElement>(null);
  const [dropdownPlacement, setDropdownPlacement] = useState<
    [HorizontalPlacement, VerticlePlacement]
  >([placement, verticlePlacement]);

  useEffect(() => {
    if (placement !== 'auto') return;

    const handleResize = () => {
      const [autoHorizontal, autoVertical] = _get_auto_placement_positioning({
        x: measure.current?.getBoundingClientRect().left || 0,
        y: measure.current?.getBoundingClientRect().top || 0,
      });
      setDropdownPlacement([autoHorizontal, autoVertical]);
    };

    window.addEventListener('resize', handleResize);

    handleResize();
    const t = setTimeout(() => {
      handleResize();
    }, 200);

    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', handleResize);
    };
  }, [placement, measure.current]);

  useEffect(() => {
    if (placement !== 'auto') {
      setDropdownPlacement([placement, verticlePlacement]);
    }
  }, [placement, verticlePlacement]);

  const transitions = useTransition(visible, {
    from: {
      opacity: 0,
      ..._get_verticle_positioning(dropdownPlacement[1]),
      ..._get_horizontal_positioning(dropdownPlacement[0]),
      transform: 'scale(0.85)',
      transformOrigin:
        transformOrigin || _get_transform_origin(...dropdownPlacement),
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

  return (
    <>
      <span ref={measure} />
      {transitions((styles, item) =>
        item ? (
          <div
            className={stylesModule.dropdownContainer}
            data-verticle-position={verticlePlacement}
            data-position={placement}
          >
            <animated.div
              className={[
                stylesModule.dropdown,
                className || stylesModule.dropdownInner,
              ].join(' ')}
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
        ) : null
      )}
    </>
  );
});
