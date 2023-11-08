import { useState, useEffect, useRef } from 'react';

import { useTransition, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import Big from 'big.js';

import './split.scss';
import { CloseButton, PlusPill, CheckCircleButton, DollarCents, DropAnimation, Tooltip, clamp } from '@ledget/ui';
import { Category, isCategory } from '@features/categorySlice';
import { SelectCategoryBill as SelectCategory } from '@components/dropdowns'


export interface SplitProps {
  title: string;
  onClose: () => void;
  amount: number;
  defaultCategory?: Category;
}

export function Split(props: SplitProps) {
  const { title, amount, defaultCategory, onClose } = props
  const [loaded, setLoaded] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [showCategorySelect, setShowCategorySelect] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category>()
  const [amounts, setAmounts] = useState<number[]>([amount])
  const splitterRef = useRef<HTMLDivElement>(null)

  const [splits, setSplits] = useState<({ start: number, end: number })[]>([{ start: 0, end: 1 }])
  const splitsSlice = useRef<({ start: number, end: number })[]>()

  const transitions = useTransition(categories, {
    from: (item, index) => ({
      opacity: 0,
      height: '1em',
      top: '0%',
      transform: 'translateY(-50%)',
      left: `${100 * splits[index].start}%`,
      right: `${100 - splits[index].end}%`,
      borderRadius: '0.5em',
      position: 'absolute',
      marginLeft: index > 0 ? '0.25em' : '0',
      marginRight: '0.25em',
      backgroundColor: item.period === 'month' ? 'var(--green-hlight2)' : 'var(--blue-hlight2)',
    }),
    enter: (item, index) => ({
      opacity: 1,
      left: `${100 * splits[index].start}%`,
      right: `${100 - (100 * splits[index].end)}%`,
    }),
    update: (item, index) => ({
      left: `${100 * splits[index].start}%`,
      right: `${100 - (100 * splits[index].end)}%`,
    }),
    leave: (item, index) => ({
      opacity: 0,
      left: `${100 * splits[index].start}%`,
      right: `${100 - (100 * splits[index].end)}%`,
    }),
    config: { duration: loaded ? 0 : 200 },
  })

  // The amount that the item is dragged make it grow or shrink,
  // and the space being taken/given is distributed to the other items proportionally evenly
  const bind = useDrag(({ args: [index], active, movement: [mx, my] }) => {
    if (!document.activeElement || !document.activeElement.getAttribute('draggable-item') || categories.length <= 1) {
      return
    }

    if (!active) {
      splitsSlice.current = undefined
    } else if (splitsSlice.current === undefined) {
      splitsSlice.current = splits
    }

    const percentWidth = Big(splits[index].end).minus(splits[index].start).toNumber()
    const percentWidthSaved = Big(splitsSlice.current![index].end).minus(splitsSlice.current![index].start)
    const splitSectionWidth = Big(splitterRef.current?.clientWidth || 1).times(percentWidthSaved || percentWidth)
    const percentDragged = Big(mx).div(splitSectionWidth)

    if (splitsSlice.current) {
      setSplits(splitsSlice.current.map((split, i) => {
        const pct = percentDragged.div(splits.length - 1).round(2)
        const halfPct = percentDragged.div(splits.length - 1).div(2).round(2)

        if (i === index) {
          return ({
            start: i === 0
              ? split.start
              : (i === splits.length - 1)
                ? clamp(0, percentDragged.add(split.start).round(2).toNumber(), 1)
                : clamp(0, percentDragged.div(2).add(split.start).round(2).toNumber(), 1),
            end: i === 0
              ? clamp(0, percentDragged.add(split.end).round(2).toNumber(), 1)
              : (i === splits.length - 1)
                ? split.end
                : clamp(0, percentDragged.add(split.end).round(2).toNumber(), 1)
          })
        } else {
          return ({
            start: i === 0
              ? split.start
              : (i === splits.length - 1)
                ? clamp(0, pct.add(split.start).round(2).toNumber(), 1)
                : clamp(0, halfPct.add(split.start).round(2).toNumber(), 1),
            end: (i === splits.length - 1)
              ? split.end
              : i === 0
                ? clamp(0, pct.add(split.end).round(2).toNumber(), 1)
                : clamp(0, halfPct.add(split.end).round(2).toNumber(), 1)
          })
        }
      }))
    }
  })

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoaded(true)
    }, 1000)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (defaultCategory && categories.length === 0) {
      setCategories([defaultCategory])
    }
  }, [defaultCategory])

  // Adding new category:
  // Push new category onto category list, then adjust the splits accordingly
  // by subtracting a proportional amount from each current split. Splits that are
  // already smaller will have to give up a smaller amount to make room for the new split.
  useEffect(() => {
    if (selectedCategory && !categories.includes(selectedCategory)) {
      setCategories([...categories, selectedCategory]);
      setSplits((prev) => {
        const newSplits = prev.map((split, index) => {
          const sectionPercentage = (split.end - split.start)
          if (index === 0) {
            return ({
              start: split.start,
              end: parseFloat((split.end - sectionPercentage * (1 / (prev.length + 1))).toFixed(2))
            })
          } else {
            return ({
              start: parseFloat((split.start - sectionPercentage * (1 / (prev.length + 1))).toFixed(2)),
              end: parseFloat((split.end - sectionPercentage * (2 / (prev.length + 1))).toFixed(2))
            })
          }
        })
        const addedSplit = { end: 1, start: parseFloat((1 - (1 / (prev.length + 1))).toFixed(2)) }
        return [...newSplits, addedSplit]
      })
      setShowCategorySelect(false)
      setSelectedCategory(undefined)
    }
  }, [selectedCategory])

  // Update amounts when splits change
  useEffect(() => {
    const amounts = splits.map((split) => {
      const percent = Big(split.end).minus(split.start)
      return Big(amount).times(percent).round(2).times(100).toNumber()
    })
    setAmounts(amounts)
  }, [splits])

  return (
    <div id="split-item--container">
      <CloseButton onClick={() => { onClose() }} size={'.8em'} />
      <div className="header">
        <h2>{`${title}`}</h2>
      </div>
      <div className="splitter--container">
        <div className="splitter" ref={splitterRef} >
          {transitions((style, item, t, index) => (
            <animated.div
              {...bind(index)}
              style={style}
              className="section" key={index}
            >
              <button
                className="handle"
                draggable-item="true"
                aria-label={`Drag to change ${item.name} amount`}
              >
                <Tooltip
                  msg={`${item.name}`}
                  aria-label={`${item.name} ${item.period === 'month' ? 'monthly' : 'yearly'}`}
                >
                  {item.emoji}
                </Tooltip>
              </button>
              <div className="amount">
                <DollarCents value={amounts[index]} />
              </div>
            </animated.div>
          ))}
        </div>
        {categories.length < 3 && (
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
        )}
        <CheckCircleButton
          styled={'green'}
          onClick={() => { console.log('check') }}
        />
      </div>
    </div>
  );
}

export default Split;
