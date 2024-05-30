
import { Window } from '@ledget/ui'
import List from './List'
import styles from './styles.module.scss'


// Filters for bills and categories

const ColumnView = () => (
    <div className={styles.columns}>
        <Window>
            <List period='month' />
        </Window>
        <Window>
            <List period='year' />
        </Window>
    </div>
)

const SpendingCategories = () => (
    <div className={styles.container}>
        <h2>Categories</h2>
        <ColumnView />
    </div>
)

export default SpendingCategories
