import { selectFreelances } from '../utils/selectors'
import { createAction, createReducer } from '@reduxjs/toolkit'

const initialState = {
  status: 'void',
  data: null,
  error: null,
}

// actions
const freelancesFetching = createAction('freelances/fetching')
const freelancesResolved = createAction('freelances/resolved')
const freelancesRejected = createAction('freelances/rejected')

// reducer
export default createReducer(initialState, builder => {
  builder
    .addCase(freelancesFetching, (draft, action) => {
      if (draft.status === 'void') {
        // on passe en pending
        draft.status = 'pending'
        return
      }
      // si le statut est rejected
      if (draft.status === 'rejected') {
        // on supprime l'erreur et on passe en pending
        draft.error = null
        draft.status = 'pending'
        return
      }
      // si le statut est resolved
      if (draft.status === 'resolved') {
        // on passe en updating (requête en cours mais des données sont déjà présentent)
        draft.status = 'updating'
        return
      }
      // sinon l'action est ignorée
      return
    })
    .addCase(freelancesResolved, (draft, action) => {
      if (draft.status === 'pending' || draft.status === 'updating') {
        // on passe en resolved et on sauvegarde les données
        draft.data = action.payload
        draft.status = 'resolved'
        return
      }
      // sinon l'action est ignorée
      return
    })
    .addCase(freelancesRejected, (draft, action) => {
      if (draft.status === 'pending' || draft.status === 'updating') {
        // on passe en rejected, on sauvegarde l'erreur et on supprime les données
        draft.status = 'rejected'
        draft.error = action.payload
        draft.data = null
        return
      }
      return
    })
})

// Redux-Thunk
export async function fetchOrUpdateFreelances(dispatch, getState) {
  // on peut lire le state actuel avec store.getState()
  const status = selectFreelances(getState()).status
  // si la requête est déjà en cours
  if (status === 'pending' || status === 'updating') {
    // on stop la fonction pour éviter de récupérer plusieurs fois la même donnée
    return
  }
  // On peut modifier le state en envoyant des actions avec store.dispatch()
  // ici on indique que la requête est en cours
  dispatch(freelancesFetching())
  try {
    // on utilise fetch pour faire la requête
    const response = await fetch('http://localhost:8000/freelances')
    const data = await response.json()
    // si la requête fonctionne, on envoie les données à redux avec l'action resolved
    dispatch(freelancesResolved(data))
  } catch (error) {
    // en cas d'erreur on infirme le store avec l'action rejected
    dispatch(freelancesRejected(error))
  }
}
