
import { Window } from '@ledget/ui'
import List from './List'


// Filters for bills and categories

const ColumnView = () => (
    <div id='spending-categories--columns'>
        <Window>
            <List period='month' />
        </Window>
        <Window>
            <List period='year' />
        </Window>
    </div>
)

const SpendingCategories = () => (
    <div id='spending-categories'>
        <h2>Categories</h2>
        <ColumnView />
    </div>
)

export default SpendingCategories
