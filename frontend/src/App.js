import React, { useState } from 'react';
import Gateway from './pages/Gateway';
import Dashboard from './pages/Dashboard';

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <div>
            {loggedIn ? <Dashboard /> : <Gateway setLoggedIn={setLoggedIn} />}
        </div>
    )
}

export default App
