import React, { useState, useRef } from 'react'

import { usePillAnimation } from '@utils/hooks'
import withFormModal from './with/withFormModal'
import Checkbox from '@components/inputs/Checkbox'
import Plus from '@assets/icons/Plus'
import './styles/CreateCategory.css'

const SliderRadios = () => {
    const containerRef = useRef(null)
    // const springStyles = usePillAnimation({
    //     ref: containerRef,
    //     role: 'radio',
    //     style: {
    //         backgroundColor: 'var(--green-highlight)',
    //     }
    // })

    return (
        <div className="slider-radios-container" ref={containerRef}>

        </div>
    )
}

const CreateCategory = (props) => {
    const [isRange, setIsRange] = useState(false)
    const [lowerLimit, setLowerLimit] = useState('')
    const [upperLimit, setUpperLimit] = useState('')

    const handleChange = (event) => {
        const { name, value } = event.target
        const newValue = value.replace(/[^0-9.]/g, '')

        if (name === 'lowerLimit') {
            setLowerLimit(`$${newValue}`)
        } else if (name === 'upperLimit') {
            setUpperLimit(`$${newValue}`)
        }
    }



    return (
        <div className="create-form" id='category-form'>
            <h2>New Category</h2>
            <form>
                {/* row 1 */}
                <div className="responsive-inputs-row-container">
                    <div>
                        <label htmlFor="name">Name</label>
                        <div className="input-container" id="category-name-input-container">
                            <input
                                type="text"
                                name="emoji"
                                id="emoji-input"
                                placeholder="☺"
                                required
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
                        <label htmlFor="limit" style={{ visibility: 'hidden' }}>Limit</label>
                        <div className="input-container" id="limit-input-container">
                            {
                                isRange &&
                                <input
                                    type="text"
                                    name="lowerLimit"
                                    id="lowerLimit"
                                    placeholder="$0"
                                    value={lowerLimit}
                                    onChange={handleChange}
                                    onBlur={(e) => e.target.value.length <= 1 && setLowerLimit('')}
                                    size="4"
                                    required
                                />
                            }
                            <input
                                type="text"
                                name="upperLimit"
                                id="upperLimit"
                                placeholder="$0"
                                value={upperLimit}
                                onChange={handleChange}
                                onBlur={(e) => e.target.value.length <= 1 && setUpperLimit('')}
                                size="4"
                                required
                            />
                        </div>
                    </div>
                </div>
                {/* row 2 */}
                <div className='inputs-row-container'>
                    <button className="btn-primary-gray" id="add-alert-btn">
                        Alert
                        <Plus height={'.8em'} width={'.8em'} />
                    </button>
                    <Checkbox
                        label="Make Private"
                        name="private"
                        id="private"
                        checked={false}
                    />
                </div>
                {/* row 3 */}
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
            </form>

        </div>
    )
}

export default withFormModal(CreateCategory)
