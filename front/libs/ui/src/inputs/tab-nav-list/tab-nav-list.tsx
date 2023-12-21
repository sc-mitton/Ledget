import { useEffect, useRef, useState } from 'react';

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
}

export type TabNavListProps = TabNavListPropsWithoutTheme | TabNavListPropsWithTheme

export function TabNavList(props: TabNavListProps & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null)
  const { labels, className, theme, ...rest } = props
  const defaultBackgroundColor = useSchemeVar('--icon-hover-light-gray')
  const [indexTracker, setIndexTracker] = useState(0)

  const { props: pillProps } = usePillAnimation({
    ref: ref,
    querySelectall: '[role=tab]',
    update: [indexTracker, theme],
    refresh: [],
    styles: {
      zIndex: 1,
      borderRadius: 'var(--border-radius2)',
      backgroundColor: theme
        ? Array.isArray(theme) ? theme[indexTracker]?.pillBackgroundColor : theme?.pillBackgroundColor
        : defaultBackgroundColor,
    },
    find: (element) => element.attributes.getNamedItem('aria-selected')?.value === 'true',
  })

  return (
    <>
      <Tab.List
        ref={ref} {...rest}
        className={`tab-list-div ${className ? className : ''}`}
        style={{
          ...(theme && Array.isArray(theme)
            ? {
              color: theme[indexTracker]?.tabColor,
              backgroundColor: theme[indexTracker]?.tabBackgroundColor,
            }
            : theme ?
              {
                color: theme.tabColor,
                backgroundColor: theme.tabBackgroundColor,
              } : {}),
        }}
      >
        <>
          {({ selectedIndex }: { selectedIndex: number }) => {
            setIndexTracker(selectedIndex)

            return (labels.map((label, index) => (
              <Tab>{label}</Tab>
            )))
          }}
        </>
        <animated.span style={pillProps} />
      </Tab.List>
    </>
  )
}

export default TabNavList;
