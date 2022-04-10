import { createAction, createReducer } from '@reduxjs/toolkit'
import { selectFreelance } from '../utils/selectors'

// le state initial de cette feature est un objet vide
const initialState = {
  // chaque propriété de cet objet correspond à l'Id d'un freelance
  // 3: { status: 'void' }
}

// les actions contiennent l'Id du freelance en payload
const freelanceFetching = createAction('freelance/fetching', freelanceId => ({
  payload: { freelanceId }
}))
const freelanceResolved = createAction('freelance/resolved', (freelanceId, data) => ({
  payload: { freelanceId, data }
}))
const freelanceRejected = createAction('freelance/rejected', (freelanceId, error) => ({
  payload: { freelanceId, error }
}))

// reducer
export default createReducer(initialState, builder => {
  builder
    .addCase(freelanceFetching, (draft, action) => {
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
    })
    .addCase(freelanceResolved, (draft, action) => {
      const { payload } = action
      if (draft[payload.freelanceId].status === 'pending' || draft[payload.freelanceId].status === 'updating') {
        draft[payload.freelanceId].status = 'resolved'
        draft[payload.freelanceId].data = payload.data
        return
      }
    })
    .addCase(freelanceRejected, (draft, action) => {
      const { payload } = action
      if (draft[payload.freelanceId].status === 'pending' || draft[payload.freelanceId].status === 'updating') {
        draft[payload.freelanceId].status = 'rejected'
        draft[payload.freelanceId].data = null
        draft[payload.freelanceId].error = payload.error
        return
      }

    })
})

/*
{
  const { type, payload } = action
  return produce(state, (draft) => {
    // si l'action est une des action de freelance

    if (type === 'freelance/fetching' || type === 'freelance/resolved' || type === 'freelance/rejected') {
      // on vérifie que le state contient la propriété correspondante à l'Id du freelance
      if (draft[payload.freelanceId] === undefined) {
        // si elle n'existe pas, on l'initialise avec void
        draft[payload.freelanceId] = { status: 'void' }
      }
    }
        return
      }
      case 'freelance/resolved': {
        if (
          draft[payload.freelanceId].status === 'pending' ||
          draft[payload.freelanceId].status === 'updating'
        ) {
          draft[payload.freelanceId].data = payload.data
          draft[payload.freelanceId].status = 'resolved'
          return
        }
        return
      }
      case 'freelance/rejected': {
        if (
          draft[payload.freelanceId].status === 'pending' ||
          draft[payload.freelanceId].status === 'updating'
        ) {
          draft[payload.freelanceId].error = payload.error
          draft[payload.freelanceId].data = null
          draft[payload.freelanceId].status = 'rejected'
          return
        }
        return
      }
      default:
        return
    }
  })
}
*/


// Redux-Thunk
export function fetchOrUpdateFreelance(freelanceId) {
  return async (dispatch, getState) => {
    const selectFreelanceById = selectFreelance(freelanceId)
    const status = selectFreelanceById(getState()).status
    if (status === 'pending' || status === 'updating') {
      return
    }
    dispatch(freelanceFetching(freelanceId))
    try {
      const response = await fetch(
        `http://localhost:8000/freelance?id=${freelanceId}`
      )
      const data = await response.json()
      dispatch(freelanceResolved(freelanceId, data))
    } catch (error) {
      dispatch(freelanceRejected(freelanceId, error))
    }
  }
}