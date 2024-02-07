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
                <div id='filter-buttons'>
                    <div>
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
                    <div>
                        <Tooltip msg="Filter" ariaLabel="Filter">
                            <FilterLines stroke={(budgetItemSorting !== 'default') ? 'var(--blue-sat)' : 'currentColor'} />
                        </Tooltip>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer
