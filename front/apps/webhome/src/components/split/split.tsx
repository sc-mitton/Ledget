import { useState, useEffect } from 'react';

import Big from 'big.js';
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { object, string } from "yup"

import { SubmitForm } from '@components/pieces';
import { Category } from '@features/categorySlice';
import { Transaction } from '@features/transactionsSlice';
import { InputButton } from '@ledget/ui';
import { LimitAmountInput } from '@components/inputs'
import { FullSelectCategoryBill } from '@components/dropdowns'
import { FormErrorTip } from '@ledget/ui'
import './split.scss';

interface I {
  item: Transaction
  onCancel: () => void
}

export function SplitTransactionInput({ item, onCancel }: I) {
  const [categories, setCategories] = useState<(Category)[]>([])
  const [fractions, setFractions] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    if (item.categories?.length) {
      setCategories(item.categories)
      setFractions(
        item.categories.reduce((acc, cat) => {
          return {
            ...acc,
            [cat.id]: cat.fraction
          }
        }, {})
      )
    }
  }, [item])

  return (
    <div>
      <form id="split-transaction--form">
        <div>
          <div className="row">
            {categories.map((cat, index) => (
              <>
                <FullSelectCategoryBill
                  key={cat.id}
                  defaultValue={cat}
                  includeBills={false}
                  SelectorComponent={InputButton}
                  month={new Date(item.datetime).getMonth() + 1}
                  year={new Date(item.datetime).getFullYear()}
                />
                <div>
                  <LimitAmountInput
                    defaultValue={Big(item.amount).times(100).times(fractions[index]).toNumber()}

                  />
                </div>
              </>
            ))}
          </div>
        </div>
        <SubmitForm
          submitting={false}
          success={false}
          onCancel={onCancel}
        />
      </form>
    </div>
  )

}

export default SplitTransactionInput;
