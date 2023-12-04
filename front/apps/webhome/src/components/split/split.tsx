import React, { useState } from 'react';

import { SubmitForm } from '@components/pieces';
import { Transaction } from '@features/transactionsSlice';
import { InputButton } from '@ledget/ui';
import { ControlledDollarInput } from '@components/inputs'
import { Plus, TrashIcon } from '@ledget/media'
import { FullSelectCategoryBill } from '@components/dropdowns'
import { FormErrorTip } from '@ledget/ui'
import './split.scss';

interface I {
  item: Transaction
  onCancel: () => void
}

const SplitAmount = ({ name }: { name: string }) => {
  const [amount, setAmount] = useState<string>('')

  return <ControlledDollarInput
    value={amount}
    setValue={setAmount}
    hasLabel={false}
  />
}

export function SplitTransactionInput({ item, onCancel }: I) {
  const [numberOfSplits, setNumberOfSplits] = useState<number>(
    item.categories
      ? item.categories.length === 1 ? 2 : item.categories.length
      : 2)
  const [formError, setFormError] = useState<string | undefined>(undefined)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log(e)
  }

  return (
    <div>
      <form id="split-transaction--form" onSubmit={handleSubmit}>
        <div>
          <div className="row">
            {Array.from({ length: numberOfSplits }).map((_, index) => (
              <>
                <FullSelectCategoryBill
                  name={`category[${index}]`}
                  includeBills={false}
                  SelectorComponent={InputButton}
                  month={new Date(item.datetime).getMonth() + 1}
                  year={new Date(item.datetime).getFullYear()}
                  {...(index === numberOfSplits - 1
                    ? { defaultValue: item.categories ? item.categories[item.categories.length - index] : undefined }
                    : {})}
                />
                <SplitAmount name={`amount[${index}]`} />
                {index === numberOfSplits - 1
                  ?
                  <InputButton
                    type='button'
                    className="add-split--button"
                    onClick={() => setNumberOfSplits(numberOfSplits + 1)}
                  >
                    <Plus size={'1em'} />
                  </InputButton>
                  :
                  <InputButton
                    type='button'
                    className="remove-split--button"
                    onClick={() => setNumberOfSplits(numberOfSplits - 1)}
                  >
                    <TrashIcon />
                  </InputButton>
                }
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
