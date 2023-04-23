import React from 'react'
import './NewItems.css'

const testItems = [
    'Pizza', 'Movies', 'Gas', 'Rent', 'Clothes',
    'Pizza', 'Movies', 'Gas', 'Rent', 'Clothes',
]

const NewItemsStack = ({ item }) => {
    return (
        <div className='new-items-container' >
            {
                testItems.map((item, index) => {
                    return (
                        <div key={index} className={`new-item`} >
                            <div>{item}</div>
                        </div>
                    )
                })
            }
        </div>
    )
}

function NewItems() {
    return (
        <div className="window" id="new-items-window" >
            <div className='window-header' id="new-items-header">
            </div>
            <NewItemsStack />
        </div>
    )
}

export default NewItems
