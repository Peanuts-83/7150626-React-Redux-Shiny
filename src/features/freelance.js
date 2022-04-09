// PROFILE :id Reducer
import produce from "immer"
import { getFreelance } from "../utils/selectors"

// initState
const initState = {}

// Constantes
const FETCHING_ID = 'freelance/fetching'
const RESOLVED_ID = 'freelance/resolved'
const REJECTED_ID = 'freelance/rejected'

// Actions
const idFetching = (id) => ({ type: FETCHING_ID, payload: id })
const idResolved = (id, data) => ({ type: RESOLVED_ID, payload: { id, data } })
const idRejected = (id, error) => ({ type: REJECTED_ID, payload: { id, error } })


export async function fetchOrUpdateById(store, id) {
    console.log('START FETCHING')
    const selectFreelanceById = getFreelance(id)
    const status = selectFreelanceById(store.getState()).status
    if (status === 'pending' || status === 'updating') {
        return
    }

    store.dispatch(idFetching())
    try {
        const response = await fetch(`http://localhost:8000/freelance?id=${id}`)
        const data = await response.json()
        store.dispatch(idResolved(id, data))
    } catch (error) {
        store.dispatch(idRejected(id, error))
    }
}


// Reducer
export default function freelanceReducer(state = initState, action) {
    const {type, payload} = action
    return produce(state, draft => {
        if (type === RESOLVED_ID || type === FETCHING_ID || type === REJECTED_ID) {
            if (draft[payload.id] === undefined) {
                draft[payload.id] = {status: 'void'}
            }
        }

        switch (type) {
            case FETCHING_ID: {
                if (draft[payload.id].status === 'void') {
                    draft[payload.id].status = 'pending'
                    return
                }
                if (draft[payload.id].status === 'rejected') {
                    draft[payload.id].status = 'pending'
                    draft[payload.id].error = null
                    return
                }
                if (draft[payload.id].status === 'resolved') {
                    draft[payload.id].status = 'updating'
                    return
                }
                return
            }
            case RESOLVED_ID: {
                if (draft[payload.id].status === 'pending' || draft.status === 'updating') {
                    draft[payload.id].status = 'resolved'
                    draft[payload.id].data = payload.data
                    return
                }
                return
            }
            case REJECTED_ID:
                if (draft[payload.id].status === 'pending' || draft.status === 'updating') {
                    draft[payload.id].status = 'rejected'
                    draft[payload.id].data = null
                    draft[payload.id].error = payload.error
                    return
                }
                return
            default:
                return
        }
    })
}
