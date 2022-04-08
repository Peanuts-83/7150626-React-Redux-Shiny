import { createStore, combineReducers } from "redux";
import themeReducer from "../features/theme";
import freelancesReducer from "../features/freelances";
import idReducer from "../features/profile"


// actions



/* reducer
*  @state {
        theme: themeReducer
    }
*/
const reducer = combineReducers({
    theme: themeReducer,
    freelances: freelancesReducer,
    freelanceId: idReducer,
})

// Store
const reduxDevtools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
export const store = createStore(reducer, reduxDevtools)

// Watch Global store
store.subscribe(() => {
    console.log(store.getState())
})