import { useState, useRef, useEffect } from 'react'

import { ArrowDown, ArrowUp } from '@geist-ui/icons'

import './styles/Footer.scss'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { setBudgetItemsSort, selectBudgetItemsSort } from '@features/uiSlice'
import { EditBudgetCategories, EditBudgetBills } from '@modals/index'
import { PillOptionButton, FadedTextButton, IconButton3, Tooltip } from '@ledget/ui'
import { FilterLines } from '@ledget/media'

const Footer = () => {
    const dispatch = useAppDispatch()
    const budgetItemSorting = useAppSelector(selectBudgetItemsSort)
    const [modal, setModal] = useState<'categories' | 'bills' | ''>('')
    const filterButtonsContainer = useRef<HTMLDivElement>(null)
    const [showFilterButtons, setShowFilterButtons] = useState(false)

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (filterButtonsContainer.current && !filterButtonsContainer.current.contains(e.target as Node)) {
                setShowFilterButtons(false)
            }
        }
        document.addEventListener('click', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [filterButtonsContainer])

    return (
        <>
            {modal === 'categories' && <EditBudgetCategories onClose={() => { setModal('') }} />}
            {modal === 'bills' && <EditBudgetBills onClose={() => { setModal('') }} />}
            <div id="budget-footer">
                <div>
                    <span>View All</span>
                    <div>
                        <FadedTextButton onClick={() => setModal('categories')}>
                            Categories
                        </FadedTextButton>
                        <FadedTextButton onClick={() => setModal('bills')}>
                            Bills
                        </FadedTextButton>
                    </div>
                </div>
                <div ref={filterButtonsContainer}>
                    <div id='filter-buttons' className={`${showFilterButtons ? 'show' : ''}`}>
                        <PillOptionButton
                            isSelected={budgetItemSorting && ['amount-desc', 'amount-asc'].includes(budgetItemSorting)}
                            onClick={() => {
                                if (!budgetItemSorting) {
                                    dispatch(setBudgetItemsSort('amount-des'))
                                } else if (budgetItemSorting === 'amount-des') {
                                    dispatch(setBudgetItemsSort('amount-asc'))
                                } else {
                                    dispatch(setBudgetItemsSort('default'))
                                }
                            }}
                        >
                            <span>$</span>
                            {budgetItemSorting === 'amount-des'
                                ? <ArrowDown size={'1em'} strokeWidth={1.5} />
                                : <ArrowUp size={'1em'} strokeWidth={1.5} />}
                        </PillOptionButton>
                        <PillOptionButton
                            aria-label="Sort bills by amount"
                            isSelected={budgetItemSorting && ['alpha-desc', 'alpha-asc'].includes(budgetItemSorting)}
                            onClick={() => {
                                if (!budgetItemSorting) {
                                    dispatch(setBudgetItemsSort('alpha-des'))
                                } else if (budgetItemSorting === 'alpha-des') {
                                    dispatch(setBudgetItemsSort('alpha-asc'))
                                } else {
                                    dispatch(setBudgetItemsSort('default'))
                                }
                            }}
                        >
                            {budgetItemSorting === 'alpha-des' ? 'z-a' : 'a-z'}
                        </PillOptionButton>
                    </div>
                    <Tooltip msg="Filter" ariaLabel="Filter">
                        <IconButton3
                            onClick={() => { setShowFilterButtons(!showFilterButtons) }}>
                            <FilterLines stroke={(budgetItemSorting !== 'default') ? 'var(--blue-sat)' : 'currentColor'} />
                        </IconButton3>
                    </Tooltip>
                </div>
            </div>
        </>
    )
}

export default Footer
