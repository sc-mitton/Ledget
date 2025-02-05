import React, {
  ComponentPropsWithoutRef,
  ElementType,
  useRef,
  HTMLProps,
  useEffect,
  forwardRef,
} from 'react';
import { PolymorphicComponentProps } from '../types/helpers';
import styles from './styles/containers.module.scss';
import styled, { keyframes } from 'styled-components';

export const ExpandableContainer = styled.div<{
  expanded?: boolean;
  maxHeight?: number;
}>`
  opacity: ${({ expanded }) => (expanded ? 1 : 0)};
  max-height: ${({ expanded, maxHeight = 60 }) =>
    expanded ? `${maxHeight}em` : 0};
  transition: all 0.3s ease;
`;

const fetch = keyframes`
  0% {
    opacity: 0;
    height: 0%;
    min-height: 0em;
    transform: translateY(calc(100% + 2em));
  }

  50% {
    opacity: .7;
  }

  100% {
    opacity: 0;
    height: 30%;
    min-height: 5em;
    transform: translateY(60%);
  }
`;

export const InfiniteScrollDiv = styled.div<{ animate?: boolean }>`
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    z-index: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    border-radius: 50%;
    background-color: var(--blue-light);
    animation: ${({ animate }) => (animate ? fetch : 'none')} 1s ease-in-out;
  }
`;

const getMaskImage = (string: 'top' | 'bottom' | 'bottom-top' | '') => {
  switch (string) {
    case 'top':
      return 'linear-gradient(to bottom, transparent 0%, black 12px, black calc(100% - 0px), transparent)';
    case 'bottom':
      return 'linear-gradient(to bottom, transparent 0%, black 0px, black calc(100% - 12px), transparent)';
    case 'bottom-top':
      return 'linear-gradient(to bottom, transparent 0%, black 12px, black calc(100% - 12px), transparent)';
    default:
      return '';
  }
};

export const ShadowScrollDiv = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
>(({ children, style, ...rest }, parentRef) => {
  const [shadow, setShadow] = React.useState<
    'top' | 'bottom' | 'bottom-top' | ''
  >('');
  const localRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      if (localRef.current) {
        const { scrollTop, scrollHeight, offsetHeight } =
          e.target as HTMLDivElement;
        // Update shadow based on scroll position
        if (scrollTop === 0 && scrollHeight === offsetHeight) {
          setShadow('');
        } else if (scrollTop === 0 && scrollHeight > offsetHeight) {
          setShadow('bottom');
        } else if (scrollTop > 0 && scrollTop + offsetHeight < scrollHeight) {
          setShadow('bottom-top');
        } else if (scrollTop + offsetHeight === scrollHeight) {
          setShadow('top');
        }
      }
    };

    localRef.current?.addEventListener('scroll', handleScroll);

    return () => {
      localRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      {...rest}
      style={{ maskImage: getMaskImage(shadow), ...style }}
      ref={(el) => {
        localRef.current = el;
        if (typeof parentRef === 'function') {
          parentRef(el);
        } else if (parentRef && 'current' in parentRef) {
          (parentRef as React.MutableRefObject<HTMLDivElement | null>).current =
            el;
        }
      }}
    >
      {children}
    </div>
  );
});

const growOn = keyframes`
  0% {
    max-height: 0;
    opacity: 0;
  }

  100% {
    max-height: 100vh;
    opacity: 1;
  }
`;

export const GrowOnDiv = styled.div<{ immediate?: boolean }>`
  transition: all 0.3s ease;
  transform: scale(0.95);
  opacity: 0;
  animation: ${({ immediate }) => (immediate ? 'none' : growOn)} 0.5s
    ease-in-out;
`;

type DropdownItemProps<C extends ElementType> = {
  active?: boolean;
  selected?: boolean;
} & ComponentPropsWithoutRef<C>;

type AcceptibleAs = 'li' | 'div' | 'button';

export const DropdownItem = <C extends AcceptibleAs>(
  props: PolymorphicComponentProps<C, DropdownItemProps<C>>
) => {
  const { children, active, selected, className, as, ...rest } = props;
  const Component = as || 'div';

  return (
    <Component
      {...rest}
      className={`${styles.dropdownItem} ${className}`}
      data-active={active}
      data-selected={selected}
    >
      {children}
    </Component>
  );
};
