import { useRef, useState } from 'react';

import { Tab } from '@headlessui/react';
import { animated } from '@react-spring/web'

import './tab-nav-list.scss';
import { usePillAnimation } from '../../animations/use-pill-animation/use-pill-animation'


/* eslint-disable-next-line */
export interface TabNavListProps {
  labels: string[]
  toggle: boolean,
  className?: string
}

export function TabNavList({ labels, toggle, className, ...rest }: TabNavListProps & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null)

  const { props: pillProps } = usePillAnimation({
    ref: ref,
    querySelectall: '[role=tab]',
    update: [toggle],
    refresh: [],
    styles: {
      zIndex: 1,
      backgroundColor: 'var(--btn-hover-light-gray)',
      borderRadius: 'var(--border-radius2)',
    },
    find: (element) => element.attributes.getNamedItem('aria-selected')?.value === 'true',
  })

  return (
    <Tab.List ref={ref} {...rest} className={`tab-list-div ${className}`}>
      {labels.map((label, index) => (
        <Tab>{label}</Tab>
      ))}
      <animated.span style={pillProps} />
    </Tab.List>
  )
}

export default TabNavList;
