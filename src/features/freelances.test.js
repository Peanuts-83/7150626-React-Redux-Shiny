import * as freelancesActions from './freelances'
import freelancesReducer from './freelances'

const initialState = {
    status: 'void',
    data: null,
    error: null,
}
const { fetching, resolved, rejected } = freelancesActions

describe('Freelances actions', () => {
    it('should return correct type & payload from action', () => {
        expect(fetching()).toEqual({
            payload: undefined,
            type: "freelances/fetching"
        })
        expect(resolved('data')).toEqual({
            payload: 'data',
            type: "freelances/resolved"
        })
        expect(rejected('error')).toEqual({
            payload: 'error',
            type: "freelances/rejected"
        })
    })
})

describe('Freelances reducer', () => {
    it('should return "pending" status on fetching action', () => {
        expect(freelancesReducer(initialState, fetching)).toEqual({
            data: null,
            error: null,
            status: 'pending'
        })
        expect(freelancesReducer({...initialState, status: 'pending'}, fetching)).toEqual({
            data: null,
            error: null,
            status: 'updating'
        })
        expect(freelancesReducer({...initialState, status: 'rejected'}, fetching)).toEqual({
            data: null,
            error: null,
            status: 'pending'
        })
        expect(freelancesReducer({...initialState, status: 'resolved'}, fetching)).toEqual({
            data: null,
            error: null,
            status: 'updating'
        })
    })
    it('should return "resolved" with data on resolved action, or "void" status if "void"', () => {
        expect(freelancesReducer({...initialState, status: 'pending'}, resolved('data'))).toEqual({
            data: 'data',
            error: null,
            status: 'resolved'
        })
        expect(freelancesReducer({...initialState, status: 'updating'}, resolved('data'))).toEqual({
            data: 'data',
            error: null,
            status: 'resolved'
        })
        expect(freelancesReducer({...initialState, status: 'void'}, resolved('data'))).toEqual({
            data: null,
            error: null,
            status: 'void'
        })
    })
    it('should return "rejected" status with error on rejected action or previous state if not "pending" or "updating" status', () => {
        expect(freelancesReducer({...initialState, status: 'pending'}, rejected('error'))).toEqual({
            data: null,
            error: 'error',
            status: 'rejected'
        })
        expect(freelancesReducer({...initialState, status: 'updating'}, rejected('error'))).toEqual({
            data: null,
            error: 'error',
            status: 'rejected'
        })
        expect(freelancesReducer({...initialState, status: 'resolved'}, rejected('error'))).toEqual({
            data: null,
            error: null,
            status: 'resolved'
        })
        expect(freelancesReducer({...initialState, status: 'void'}, rejected('error'))).toEqual({
            data: null,
            error: null,
            status: 'void'
        })
        expect(freelancesReducer({...initialState, status: 'rejected'}, rejected('error'))).toEqual({
            data: null,
            error: null,
            status: 'rejected'
        })
    })
})