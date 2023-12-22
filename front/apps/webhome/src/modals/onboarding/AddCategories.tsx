
import { useCategoriesContext, ItemsProvider } from "./ItemsContext"

const Window = () => {

    return (
        <div className="window3" id="add-categories--window">
            <div>
                <h2>Budget Categories</h2>
            </div>
        </div>
    )
}

export default function () {
    return (
        <ItemsProvider itemType="category">
            <Window />
        </ItemsProvider>
    )
}
