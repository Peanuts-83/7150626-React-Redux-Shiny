// FETCH REDUCER & State & Actions
import produce from 'immer'
import { getFreelances } from '../utils/selectors'

// InitState
const initState = {
    status: 'void', // void/pending/resolved/rejected/updating
    data: null,
    error: null
}

// Constantes
const FETCHING_FREELANCES = 'freelances/fetching'
const RESOLVED_FREELANCES = 'freelances/resolved'
const REJECTED_FREELANCES = 'freelances/rejected'

// Actions
const freelancesFetching = () => ({ type: FETCHING_FREELANCES })
const freelancesResolved = (data) => ({ type: RESOLVED_FREELANCES, payload: data })
const freelancesRejected = (error) => ({ type: REJECTED_FREELANCES, payload: error })

// Reducer
export default function freelancesReducer(state = initState, action) {
    return produce(state, draft => {
        switch (action.type) {
            case FETCHING_FREELANCES: {
                if (draft.status === 'void') {
                    draft.status = 'pending'
                    return
                }
                if (draft.status === 'rejected') {
                    draft.error = null
                    draft.status = 'pending'
                    return
                }
                if (draft.status === 'resolved') {
                    draft.status = 'updating'
                    return
                }
                return
            }
            case RESOLVED_FREELANCES: {
                if (draft.status === 'pending' || draft.status === 'updating') {
                    draft.data = action.payload
                    draft.status = 'resolved'
                    return
                }
                return
            }
            case REJECTED_FREELANCES: {
                if (draft.status === 'pending' || draft.status === 'updating') {
                    draft.error = action.payload
                    draft.status = 'rejected'
                    return
                }
                return
            }
            default:
                return
        }

    })
}

export async function fetchOrUpdateFreelances(store) {
    const status = getFreelances(store.getState()).status
    // console.log('BEGINNING ASYNC FUNC...', status)
    if (status === 'pending' || status === 'updating') {
        return
    }
    // console.log('DISPATCHING!!!')
    store.dispatch((freelancesFetching()))
    try {
        const response = await fetch('http://localhost:8000/freelances')
        const data = await response.json()
        store.dispatch(freelancesResolved(data))
    } catch (error) {
        // console.log('ERROR!!!', error)
        store.dispatch(freelancesRejected(error))
    }
}