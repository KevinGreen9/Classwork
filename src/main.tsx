import {createRoot} from 'react-dom/client'
import './index.css'
import {AppWithRedux} from "./App/AppHttpRequests.tsx";
import {Provider} from "react-redux";
import {store} from "./App/store.ts";
import {App} from "./App/App.tsx";

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        {/*<AppWithRedux/>*/}
        <App/>
    </Provider>

)
