import { useRef } from 'react';

import { Tab } from '@headlessui/react';
import { animated } from '@react-spring/web'

import './tab-nav-list.scss';
import { usePillAnimation } from '../../animations/use-pill-animation/use-pill-animation'


interface TabNavListBaseProps {
  labels: string[] | React.ReactNode[],
  toggle: any,
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
  selectedIndex?: never
}

interface TabNavListPropsWithTheme extends TabNavListBaseProps {
  theme: TabStyle | TabStyle[]
  selectedIndex: number
}

export type TabNavListProps = TabNavListPropsWithoutTheme | TabNavListPropsWithTheme

export function TabNavList(props: TabNavListProps & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null)
  const { labels, toggle, className, theme, selectedIndex, ...rest } = props

  const { props: pillProps } = usePillAnimation({
    ref: ref,
    querySelectall: '[role=tab]',
    update: [toggle],
    refresh: [],
    styles: {
      zIndex: 1,
      backgroundColor: 'var(--btn-hover-light-gray)',
      borderRadius: 'var(--border-radius2)',
      ...(theme && Array.isArray(theme)
        ? {
          color: theme[selectedIndex]?.pillColor,
          backgroundColor: theme[selectedIndex]?.pillBackgroundColor,
        }
        : theme ?
          {
            color: theme.pillColor,
            backgroundColor: theme.pillBackgroundColor,
          } : {}
      )
    },
    find: (element) => element.attributes.getNamedItem('aria-selected')?.value === 'true',
  })

  return (
    <>
      <Tab.List
        ref={ref} {...rest}
        className={`tab-list-div ${className}`}
        style={{
          ...(theme && Array.isArray(theme)
            ? {
              color: theme[selectedIndex]?.tabColor,
              backgroundColor: theme[selectedIndex]?.tabBackgroundColor,
            }
            : theme ?
              {
                color: theme.tabColor,
                backgroundColor: theme.tabBackgroundColor,
              } : {}),
        }}
      >
        {labels.map((label, index) => (
          <Tab>
            {label}
          </Tab>
        ))}
        <animated.span style={pillProps} />
      </Tab.List>
    </>
  )
}

export default TabNavList;
