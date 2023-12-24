import { useEffect, useRef } from 'react';

import { Tab } from '@headlessui/react';
import { animated } from '@react-spring/web'

import './tab-nav-list.scss';
import { usePillAnimation } from '../../animations/use-pill-animation/use-pill-animation'
import useSchemeVar from '../../utils/hooks/use-scheme-var/use-scheme-var';


interface TabNavListBaseProps {
  labels: string[] | React.ReactNode[],
  className?: string
}

interface TabStyle {
  pillColor: string,
  pillBackgroundColor: string,
  tabColor: string,
  tabBackgroundColor: string,
}

interface TabNavListPropsWithoutTheme extends TabNavListBaseProps {
  theme?: never
}

interface TabNavListPropsWithTheme extends TabNavListBaseProps {
  theme: TabStyle | TabStyle[]
  selectedIndex: number,
}

export type TabNavListProps = TabNavListPropsWithoutTheme | TabNavListPropsWithTheme

export function TabNavList(props: TabNavListProps & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null)
  const { labels, className, theme, ...rest } = props
  const defaultBackgroundColor = useSchemeVar('--icon-hover-light-gray')

  const [pillProps, api] = usePillAnimation({
    ref: ref,
    querySelectall: '[role=tab]',
    update: theme ? [theme, props.selectedIndex] : [],
    refresh: [],
    styles: {
      zIndex: 1,
      borderRadius: 'var(--border-radius2)',
      backgroundColor: theme
        ? Array.isArray(theme) ? theme[props.selectedIndex]?.pillBackgroundColor : theme?.pillBackgroundColor
        : defaultBackgroundColor,
    },
    find: (element) => element.attributes.getNamedItem('aria-selected')?.value === 'true',
  })

  useEffect(() => {
    api.start({
      backgroundColor: theme
        ? Array.isArray(theme) ? theme[props.selectedIndex]?.pillBackgroundColor : theme?.pillBackgroundColor
        : defaultBackgroundColor,
    })
  }, [theme ? props.selectedIndex : null])

  return (
    <>
      <Tab.List
        ref={ref} {...rest}
        className={`tab-list-div ${className ? className : ''}`}
        style={{
          ...(theme && Array.isArray(theme)
            ? {
              color: theme[props.selectedIndex]?.tabColor,
              backgroundColor: theme[props.selectedIndex]?.tabBackgroundColor,
            }
            : theme ?
              {
                color: theme.tabColor,
                backgroundColor: theme.tabBackgroundColor,
              } : {}),
        }}
      >
        <>{labels.map((label, index) => (
          <Tab>{label}</Tab>
        ))}</>
        <animated.span style={pillProps} />
      </Tab.List>
    </>
  )
}

export default TabNavList;
