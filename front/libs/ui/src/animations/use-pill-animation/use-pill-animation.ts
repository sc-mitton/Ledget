import { useEffect, useLayoutEffect, useState } from 'react';
import { useSpring, useSpringRef } from '@react-spring/web';
import { useSchemeVar } from '../../themes/hooks/use-scheme-var/use-scheme-var';

interface Props {
  ref: React.RefObject<HTMLElement>;
  find: (element: HTMLElement, index?: number) => boolean;
  querySelectall: string;
  update: any[];
  refresh?: any[];
  styles?: React.CSSProperties;
}

const borderWidth = 1.5;

/**
 * Custom hook for animating a pill element behind selected options.
 *
 * @param {Object} args - The configuration object containing the arguments.
 * @param {React.RefObject} args.ref - The React ref pointing to the container holding the options.
 * @param {Array} [args.update=[]] - An array of state variables that trigger element refresh for selection.
 * @param {Object} [args.styles] - An object with CSS styles to customize the appearance of the pill animation.
 * @param {Function} args.find - A callback function to filter and find the desired element from the list of selectors.
 * @param {string} args.querySelectAll - A string representing the CSS selector to query for the DOM elements to animate behind.
 * @returns {Object} An object containing the animated props from `useSpring`.
 */
export const usePillAnimation = ({
  ref,
  find,
  querySelectall,
  update = [],
  refresh = [],
  styles = {},
}: Props): any => {
  const [selectors, setSelectors] = useState<HTMLElement[]>([]);

  const [selectorWidth, setSelectorWidth] = useState<number>();
  const [selectorHeight, setSelectorHeight] = useState<number>();
  const [selectorLeft, setSelectorLeft] = useState<number>();
  const [selectorTop, setSelectorTop] = useState<number>();
  const backgroundColor = useSchemeVar(
    `--${styles.backgroundColor}` || '--btn-medium-gray-hover'
  );

  const baseStyles = {
    position: 'absolute',
    backgroundColor: backgroundColor,
    borderWidth: `${borderWidth}px`,
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: 'var(--border-radius3)',
    zIndex: 0,
    config: { tension: 200, friction: 22 },
  } as React.CSSProperties;

  const api = useSpringRef();
  const props = useSpring({
    from: { ...baseStyles, ...styles },
    to: {
      width: selectorWidth,
      left: selectorLeft,
      top: selectorTop,
      height: selectorHeight,
    },
    ref: api,
  });

  useEffect(() => {
    api.start({
      ...baseStyles,
      ...styles,
    });
  }, [styles]);

  useEffect(() => {
    api.start();
  }, [selectorWidth, selectorHeight, selectorLeft, selectorTop]);

  useLayoutEffect(() => {
    if (selectors.length > 0) {
      const element = selectors.find(find);
      if (element) {
        setSelectorHeight(element.offsetHeight - borderWidth * 2);
        setSelectorWidth(element.offsetWidth);
        setSelectorLeft(element.offsetLeft - borderWidth);
        setSelectorTop(element.offsetTop);
      }
    }
  }, [selectors, ...update]);

  useEffect(() => {
    setTimeout(() => {
      const elements = Array.from(
        ref.current
          ? ref.current.querySelectorAll<HTMLElement>(querySelectall)
          : []
      );
      elements.length > 0 && setSelectors(elements);
    }, 50);
  }, [...refresh]);

  return [props, api];
};

export default usePillAnimation;
