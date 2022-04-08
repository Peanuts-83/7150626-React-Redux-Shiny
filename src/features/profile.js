// PROFILE :id Reducer
import produce from "immer"

// initState
const initState = {
    status: 'void',
    data: null,
    error: null
}

// Constantes
const FETCHING_ID = 'id/fetching'
const RESOLVED_ID = 'id/resolved'
const REJECTED_ID = 'id/rejected'

// Actions
const idFetching = () => ({ type: FETCHING_ID })
const idResolved = (data) => ({ type: RESOLVED_ID, payload: data })
const idRejected = (error) => ({ type: REJECTED_ID, payload: error })

// Reducer
export default function idReducer(state = initState, action) {
    return produce(state, draft => {
        switch (action.type) {
            case FETCHING_ID: {
                if (draft.status === 'void') {
                    draft.status = 'pending'
                    return
                }
                if (draft.status === 'rejected') {
                    draft.status = 'pending'
                    draft.error = null
                    return
                }
                if (draft.status === 'resolved') {
                    draft.status = 'updating'
                    return
                }
                return
            }
            case RESOLVED_ID: {
                if (draft.status === 'pending' || draft.status === 'updating') {
                    draft.data = action.payload
                    draft.status = 'resolved'
                    return
                }
                return
            }
            case REJECTED_ID:
                if (draft.status === 'pending' || draft.status === 'updating') {
                    draft.error = action.payload
                    draft.status = 'rejected'
                    return
                }
                return
            default:
                return
        }
    })
}

export async function fetchOrUpdateById(store, id) {
    const status = store.getState().status
    if (status === 'pending' || status === 'updating') {
        return
    }

    store.dispatch(idFetching())
    try {
        const response = await fetch(`http://localhost:8000/freelance/?id=${id}`)
        const data = await response.json()
        store.dispatch(idResolved(data))
    }catch(error) {
        store.dispatch(idRejected(error))
    }
}