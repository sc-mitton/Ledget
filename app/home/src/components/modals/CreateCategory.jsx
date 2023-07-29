import React, { useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"

import { Radios } from '@components/inputs'
import withFormModal from './with/withFormModal'
import Checkbox from '@components/inputs/Checkbox'
import Plus from '@assets/icons/Plus'
import './styles/CreateCategory.css'

const schema = yup.object().shape({
    name: yup.string().required(),
    upperLimit: yup.number().required(),
})

const CreateCategory = (props) => {
    const [upperLimit, setUpperLimit] = useState('')

    return (
        <div className="create-form" id='category-form'>
            <h2>New Category</h2>
            <form>
                <Radios options={[
                    { name: 'categoryType', value: 'month', label: 'Month', default: true },
                    { name: 'categoryType', value: 'year', label: 'Year' },
                ]} />
                {/* row */}
                <div className="responsive-inputs-row-container">
                    <div>
                        <label htmlFor="name">Name</label>
                        <div className="input-container" id="category-name-input-container">
                            <input
                                type="text"
                                name="emoji"
                                id="emoji-input"
                                placeholder="☺"
                                style={{ fontSize: '16px', padding: '0 4px 0 0' }}
                            />
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Category name"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="limit" style={{ visibility: 'visible' }}>Limit</label>
                        <div className="input-container" id="limit-input-container">
                            <input
                                type="text"
                                name="upperLimit"
                                id="upperLimit"
                                placeholder="$0"
                                value={upperLimit}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9.]/g, '')
                                    const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                    setUpperLimit(`$${formattedValue}`)
                                }}
                                onBlur={(e) => e.target.value.length <= 1 && setUpperLimit('')}
                                size="4"
                                required
                            />
                        </div>
                    </div>
                </div>
                {/* row */}
                <div id='description-container'>
                    <label htmlFor="description" >Description</label>
                    <div className="input-container" id="limit-input-container">
                        <textarea
                            type="text"
                            name="description"
                            id="description"
                            rows="1"
                            placeholder="Add a description..."
                            required
                        />
                    </div>
                </div>
                {/* row */}
                <div
                    className='inputs-row-container'
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <button
                        id="add-alert-btn"
                        style={{
                            marginTop: '2px',
                            marginRight: '10px'
                        }}
                    >
                        Add Alert
                        <Plus stroke="var(--white-text)" height={'.9em'} width={'.9em'} />
                    </button>
                    <Checkbox
                        label="Private"
                        name="private"
                        id="private"
                        checked={false}
                    />
                </div>
            </form>

        </div>
    )
}

export default withFormModal(CreateCategory)
