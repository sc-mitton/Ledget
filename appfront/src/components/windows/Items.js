import React from 'react'
import './Items.css'

const testItems = [
    ' ', ' ', ' ', ' ', ' ',
    ' ', ' ', ' ', ' ', ' ',
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


function Items() {

    const Header = () => {
        return (
            <div className="window-header">
                <h2>Items</h2>
            </div>
        )
    }

    return (
        <div>
            <NewItemsStack />
            <div className='window' id='items-window'>
                <Header />
            </div>
        </div>
    )
}

export default Items
