import React, { useState, useEffect } from 'react';

import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form'

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


interface Splits {
  [key: `category[${number}]`]: string
  [key: `amount[${number}]`]: string
}

type SplitZodFields = {
  [key in keyof Splits]: ZodType<Splits[key]>
}

function createZodSchema(index: number) {
  const fields: SplitZodFields = {} as SplitZodFields

  for (let i = 0; i < index; i++) {
    fields[`category[${i}]`] = z.string()
    fields[`amount[${i}]`] = z.string()
  }

  return z.object(fields)
}

export function SplitTransactionInput({ item, onCancel }: I) {
  const [schema, setSchema] = useState<ZodType<Splits>>()

  const [numberOfSplits, setNumberOfSplits] = useState<number>(item.categories ? item.categories.length : 1)

  // Setting schema
  useEffect(() => {
    const schema = createZodSchema(numberOfSplits)
    setSchema(schema)
  }, [numberOfSplits])

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
                    ? { defaultValue: item.categories ? item.categories[index] : undefined }
                    : {})}
                />
                <SplitAmount name={`amount[${index}]`} />
                {index === numberOfSplits - 1
                  ? <InputButton type='button'
                    className="add-split--button"
                    onClick={() => setNumberOfSplits(numberOfSplits + 1)}
                  >
                    <Plus size={'1em'} />
                  </InputButton>
                  : <InputButton
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
