import { createAction, createReducer }  from '@reduxjs/toolkit'

// action creators
export const toggleTheme = createAction('toggleTheme')
export const setTheme = createAction('setTheme')

// Le reducer
export default createReducer('light', builder => {
  builder
    .addCase(toggleTheme, state => {
      return state === 'light' ? 'dark' : 'light'
    })
    .addCase(setTheme, (state, action) => {
      return action.payload
    })
})