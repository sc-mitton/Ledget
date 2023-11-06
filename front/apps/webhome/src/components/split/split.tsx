import { useState, useEffect } from 'react';

import { useTransition, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

import './split.scss';
import { useGetCategoriesQuery } from '@features/categorySlice';
import { CloseButton } from '@ledget/ui';
import { DollarCents } from '@ledget/ui';
import { Category } from '@features/categorySlice';


export interface SplitProps {
  title: string;
  onClose: () => void;
  amount: number;
  defaultCategory?: Category;
}

export function Split(props: SplitProps) {
  const { title, amount, defaultCategory, onClose } = props;
  const [splits, setSplits] = useState<({ start: number, end: number })[]>([{ start: 0, end: 100 }]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (defaultCategory) {
      setCategories([defaultCategory]);
    }
  }, [defaultCategory]);

  const transitions = useTransition(splits, {
    from: { opacity: 0, height: '.5em', width: 0 },
    enter: (item, index) => ({
      opacity: 1,
      height: '.5em',
      width: `${item.end - item.start}%`,
      transform: `translateX(${item.start}%)`,
    }),
    leave: { opacity: 0, height: '.5em' },
  });

  return (
    <div id="split-item--container">
      <CloseButton onClick={() => { onClose() }} size={'.8em'} />
      <div className="header">
        <h4>{`${title}`}</h4>
        <div><DollarCents value={amount} /></div>
      </div>
      <div className="splitter">
        {transitions((style, item, t, index) => (
          <animated.div style={style} className="section" key={index} />
        ))}
      </div>
    </div>
  );
}

export default Split;
