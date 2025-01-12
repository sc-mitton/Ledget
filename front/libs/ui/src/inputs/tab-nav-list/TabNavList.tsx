import { useEffect, useRef, useState } from 'react';

import { Tab } from '@headlessui/react';
import { animated, useSpringRef } from '@react-spring/web';
import { useSpring } from '@react-spring/web';

import stylesModule from './tab-nav-list.module.scss';
import { usePillAnimation } from '../../animations/use-pill-animation/use-pill-animation';
import useSchemeVar from '../../themes/hooks/use-scheme-var/use-scheme-var';

interface TabStyle {
  pillColor?: string;
  pillBackgroundColor: string;
  tabColor: string;
  tabBackgroundColor: string;
}

interface TabNavListProps {
  selectedIndex: number;
  labels: string[] | React.ReactNode[];
  className?: string;
  theme?: TabStyle | TabStyle[];
  size?: 'sm' | 'auto';
}

export function TabNavList(
  props: TabNavListProps & React.HTMLAttributes<HTMLDivElement>
) {
  const ref = useRef<HTMLDivElement>(null);
  const { labels, className, theme, size = 'auto', ...rest } = props;
  const defaultBackgroundColor = useSchemeVar('--default-pill-background');

  const [pillProps, api] = usePillAnimation({
    ref: ref,
    querySelectall: '[role=tab]',
    update: theme ? [theme, props.selectedIndex] : [props.selectedIndex],
    refresh: [],
    styles: {
      zIndex: 1,
      borderRadius: 'var(--border-radius2)',
      backgroundColor: theme
        ? Array.isArray(theme)
          ? theme[props.selectedIndex]?.pillBackgroundColor
          : theme?.pillBackgroundColor
        : defaultBackgroundColor,
    },
    find: (element) =>
      element.attributes.getNamedItem('aria-selected')?.value === 'true',
  });

  useEffect(() => {
    api.start({
      backgroundColor: theme
        ? Array.isArray(theme)
          ? theme[props.selectedIndex]?.pillBackgroundColor
          : theme?.pillBackgroundColor
        : defaultBackgroundColor,
    });
  }, [theme ? props.selectedIndex : null]);

  return (
    <>
      <Tab.List
        ref={ref}
        {...rest}
        className={stylesModule.tabListDiv}
        data-size={size}
        style={{
          ...(theme && Array.isArray(theme)
            ? {
                color: theme[props.selectedIndex]?.tabColor,
                backgroundColor: theme[props.selectedIndex]?.tabBackgroundColor,
              }
            : theme
            ? {
                color: theme.tabColor,
                backgroundColor: theme.tabBackgroundColor,
              }
            : {}),
        }}
      >
        <>
          {labels.map((label, index) => (
            <Tab>
              <span
                style={{
                  color: theme
                    ? Array.isArray(theme)
                      ? props.selectedIndex === index
                        ? theme[index]?.pillColor
                        : theme[index]?.tabColor
                      : props.selectedIndex === index
                      ? theme.pillColor
                      : theme.tabColor
                    : 'inherit',
                }}
              >
                {label}
              </span>
            </Tab>
          ))}
        </>
        <animated.span style={pillProps} />
      </Tab.List>
    </>
  );
}

export function TabNavListUnderlined(
  props: Omit<TabNavListProps, 'theme' | 'labels'> &
    React.HTMLAttributes<HTMLDivElement>
) {
  const [indicatorWidth, setIndicatorWidth] = useState<number>();
  const [indicatorLeft, setIndicatorLeft] = useState<number>();
  const backgroundColor = useSchemeVar('--blue-sat');
  const { children, selectedIndex, ...rest } = props;

  const ref = useRef<HTMLDivElement>(null);

  const api = useSpringRef();
  const styles = useSpring({
    from: { width: 0, left: 0, bottom: 0, backgroundColor },
    to: {
      width: indicatorWidth,
      left: indicatorLeft,
      height: '.2em',
      borderRadius: '8px 8px 0px 0px',
    },
    ref: api,
  });

  useEffect(() => {
    api.start();
  }, [indicatorWidth, indicatorLeft]);

  useEffect(() => {
    const activeTab = ref.current?.querySelector('[aria-selected=true]');
    if (activeTab) {
      setIndicatorWidth(activeTab.clientWidth + 12);
      setIndicatorLeft((activeTab as any).offsetLeft - 6);
    }
  }, [selectedIndex]);

  return (
    <Tab.List
      as="div"
      className={stylesModule.tabNavListUnderlined}
      ref={ref}
      {...rest}
    >
      {children}
      <animated.span style={styles} />
    </Tab.List>
  );
}

export default TabNavList;
