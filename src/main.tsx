import {createRoot} from 'react-dom/client'
import './index.css'
import {Provider} from "react-redux";
import {store} from "./App/store.ts";
import {App} from "./App/App.tsx";

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <App/>
    </Provider>

)
