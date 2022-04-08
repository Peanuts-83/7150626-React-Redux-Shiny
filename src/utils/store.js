import { createStore, combineReducers } from "redux";
import themeReducer from "../features/theme";


// actions



/* reducer
*  @state {
        theme: themeReducer
    }
*/
const reducer = combineReducers({
    theme: themeReducer,
})

// Store
const reduxDevtools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
export const store = createStore(reducer, reduxDevtools)

// Watch Global store
store.subscribe(() => {
    console.log(store.getState())
})