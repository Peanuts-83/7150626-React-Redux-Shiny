import { createSlice } from '@reduxjs/toolkit'

// CREATESLICE @param name, initialState, reducers
// REDUCERS @param actions
const { actions, reducer } = createSlice({
  name: 'theme',
  initialState: "light",
  reducers: {
    toggle: (draft) => {    // addCase(toggle, (draft) ...)
      return draft === 'light' ? 'dark' : 'light'
    },
    set: (draft, action) => {
      return action.payload
    },
  }
})
export const { toggle, set } = actions
export default reducer;

// OLD
// // action creators
// export const toggleTheme = createAction('toggleTheme')
// export const setTheme = createAction('setTheme')

// // Le reducer
// export default createReducer('light', builder => {
//   builder
//     .addCase(toggleTheme, state => {
//       return state === 'light' ? 'dark' : 'light'
//     })
//     .addCase(setTheme, (state, action) => {
//       return action.payload
//     })
// })