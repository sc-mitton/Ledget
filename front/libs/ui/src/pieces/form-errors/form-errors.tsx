import { Fragment } from 'react';
import './form-errors.css';

import { Alert2 } from '@ledget/assets'

interface Error {
  message?: string,
  type?: 'required' | string
}

export const FormErrorTip = ({ errors }: { errors: Error[] }) => (
  <>
    {
      errors.some((error: any) => error.type === 'required' || error.message === 'required') &&
      <div className='error-tip'>
        <Alert2 />
      </div>
    }
  </>
)


export const FormError = ({ msg }: { msg: string | string[] }) => {

  const renderLines = (text: string) => {
    const lines = text.split('\n')
    return lines.map((line, index) => <Fragment key={index}>{line}<br /></Fragment>)
  }

  return (
    <>
      {(typeof msg === 'string')
        ?
        !msg.includes('required') &&
        <div className="form-error--container">
          <Alert2 />
          <div className="form-error">
            {renderLines(msg)}
          </div>
        </div>
        :
        msg.map((m, index) => (
          !m.includes('required') &&
          <div className="form-error--container" key={index}>
            <Alert2 />
            <div className="form-error">
              {renderLines(m)}
            </div>
          </div>
        ))
      }
    </>
  )
}
