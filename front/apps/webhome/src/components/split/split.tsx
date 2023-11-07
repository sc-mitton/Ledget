import { useState, useEffect } from 'react';

import { useTransition, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

import './split.scss';
import { CloseButton, PlusPill, CheckCircleButton, DollarCents, DropAnimation } from '@ledget/ui';
import { Category, isCategory } from '@features/categorySlice';
import { SelectCategoryBill as SelectCategory } from '@components/dropdowns'


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
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>();

  useEffect(() => {
    if (defaultCategory) {
      setCategories([defaultCategory]);
    }
  }, [defaultCategory]);

  const transitions = useTransition(categories, {
    from: (item, index) => ({
      opacity: 0,
      height: '1em',
      top: '0%',
      transform: 'translateY(-50%)',
      left: '0%',
      right: '100%',
      borderRadius: '0.5em',
      position: 'absolute',
      backgroundColor: item.period === 'month' ? 'var(--green-hlight2)' : 'var(--blue-hlight3)',
    }),
    enter: (item, index) => ({
      opacity: 1,
      left: `${splits[index].start}%`,
      right: `${100 - splits[index].end}%`,
    }),
    leave: (item, index) => ({
      opacity: 0,
      left: `${splits[index].start}%`,
      right: `${100 - splits[index].end}%`,
    }),
    config: { mass: 1.1, tension: 240, friction: 19 },
  });

  return (
    <div id="split-item--container">
      <CloseButton onClick={() => { onClose() }} size={'.8em'} />
      <div className="header">
        <h4>{`${title}`}</h4>
        <div><DollarCents value={amount} /></div>
      </div>
      <div className="splitter--container">
        <div className="splitter">
          {transitions((style, item, t, index) => (
            <animated.div style={style} className="section" key={index} />
          ))}
        </div>
        <div>
          <PlusPill
            styled={'green'}
            onClick={() => { setShowCategorySelect(!showCategorySelect) }}
          />
          <DropAnimation
            placement={'middle'}
            visible={showCategorySelect}
            className='select-category--dropdown'
          >
            <SelectCategory
              includeBills={false}
              value={selectedCategory}
              onChange={(value) => { isCategory(value) && setSelectedCategory(value) }}
            />
          </DropAnimation>
        </div>
        <CheckCircleButton
          styled={'green'}
          onClick={() => { console.log('check') }}
        />
      </div>
    </div>
  );
}

export default Split;
