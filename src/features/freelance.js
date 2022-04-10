import { createSlice } from '@reduxjs/toolkit'
import { selectFreelance } from '../utils/selectors'

// le state initial de cette feature est un objet vide
const initialState = {
  // chaque propriété de cet objet correspond à l'Id d'un freelance
  // 3: { status: 'void' }
}

const {actions, reducer} = createSlice({
  name: 'freelance',
  initialState: initialState,
  reducers: {
    fetching: {
      prepare: (freelanceId) => ({payload: {freelanceId}}),
      reducer: (draft, action) => {
        const { payload } = action
        if (draft[payload.freelanceId] === undefined) {
          draft[payload.freelanceId] = { status: 'void' }
        }
        if (draft[payload.freelanceId].status === 'void') {
          draft[payload.freelanceId].status = 'pending'
          return
        }
        if (draft[payload.freelanceId].status === 'rejected') {
          draft[payload.freelanceId].error = null
          draft[payload.freelanceId].status = 'pending'
          return
        }
        if (draft[payload.freelanceId].status === 'resolved') {
          draft[payload.freelanceId].status = 'updating'
          return
        }
        return
      },
    },
    resolved: {
      prepare: (freelanceId, data) => ({payload: {freelanceId, data}}),
      reducer: (draft, action) => {
        const { payload } = action
        if (draft[payload.freelanceId].status === 'pending' || draft[payload.freelanceId].status === 'updating') {
          draft[payload.freelanceId].status = 'resolved'
          draft[payload.freelanceId].data = payload.data
          return
        }
        return
      },
    },
    rejected: {
      prepare: (freelanceId, error) => ({payload: {freelanceId, error}}),
      reducer: (draft, action) => {
        const { payload } = action
        if (draft[payload.freelanceId].status === 'pending' || draft[payload.freelanceId].status === 'updating') {
          draft[payload.freelanceId].status = 'rejected'
          draft[payload.freelanceId].data = null
          draft[payload.freelanceId].error = payload.error
          return
        }
        return
      },
    },
  }
})

// Redux-Thunk
export function fetchOrUpdateFreelance(freelanceId) {
  return async (dispatch, getState) => {
    const selectFreelanceById = selectFreelance(freelanceId)
    const status = selectFreelanceById(getState()).status
    if (status === 'pending' || status === 'updating') {
      return
    }
    dispatch(fetching(freelanceId))
    try {
      const response = await fetch(
        `http://localhost:8000/freelance?id=${freelanceId}`
      )
      const data = await response.json()
      dispatch(resolved(freelanceId, data))
    } catch (error) {
      dispatch(rejected(freelanceId, error))
    }
  }
}


const {fetching, resolved, rejected} = actions
export default reducer