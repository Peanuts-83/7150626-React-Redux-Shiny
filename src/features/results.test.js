import * as resultsActions from './results'
import resultsReducer from './results'

const { fetching, resolved, rejected } = resultsActions

describe('Results actions', () => {
    it('should return proper action type with payload', () => {
        expect(fetching('params')).toEqual({ type: 'results/fetching', payload: { params: 'params' } })
        expect(resolved('params', 'data')).toEqual({ type: 'results/resolved', payload: { params: 'params', data: 'data' } })
        expect(rejected('params', 'error')).toEqual({ type: 'results/rejected', payload: { params: 'params', error: 'error' } })
    })
})

const initialState = {
    status: 'void',
    data: null,
    error: null,
    params: null,
}

describe('Results reducer', () => {
    it('should return "pending" or "updating" status with params on fetching action', () => {
        expect(resultsReducer(initialState, fetching('params'))).toEqual({
            "data": null,
            "error": null,
            "params": 'params',
            "status": "pending"
        })
        expect(resultsReducer({ ...initialState, status: 'pending' }, fetching('params'))).toEqual({
            "data": null,
            "error": null,
            "params": 'params',
            "status": "updating"
        })
        expect(resultsReducer({ ...initialState, status: 'resolved' }, fetching('params'))).toEqual({
            "data": null,
            "error": null,
            "params": 'params',
            "status": "updating"
        })
        expect(resultsReducer({ ...initialState, status: 'rejected' }, fetching('params'))).toEqual({
            "data": null,
            "error": null,
            "params": 'params',
            "status": "updating"
        })
    })
    it('should return "pending" status with invalid params on resolved action with incorrect params', () => {
        expect(resultsReducer({ ...initialState, status: "pending", params: 'invalidParams' }, resolved('params', 'data'))).toEqual({
            "data": null,
            "error": null,
            "params": 'invalidParams',
            "status": "pending"
        })
    })
    it('should return "resolved" status with params & data on resolved action', () => {
        expect(resultsReducer({ ...initialState, status: "pending", params: 'params' }, resolved('params', 'data'))).toEqual({
            "data": 'data',
            "error": null,
            "params": 'params',
            "status": "resolved"
        })
        expect(resultsReducer({ ...initialState, status: "updating", params: 'params' }, resolved('params', 'data'))).toEqual({
            "data": 'data',
            "error": null,
            "params": 'params',
            "status": "resolved"
        })
    })
    it('should return "pending" status with invalid params on rejected action with incorrect params', () => {
        expect(resultsReducer({ ...initialState, status: "pending", params: 'invalidParams' }, rejected('params', 'data'))).toEqual({
            "data": null,
            "error": null,
            "params": 'invalidParams',
            "status": "pending"
        })
    })
    it('should return "rejected" status with params & error on rejected action', () => {
        expect(resultsReducer({ ...initialState, status: "pending", params: 'params' }, rejected('params', 'error'))).toEqual({
            "data": null,
            "error": 'error',
            "params": 'params',
            "status": "rejected"
        })
        expect(resultsReducer({ ...initialState, status: "updating", params: 'params' }, rejected('params', 'error'))).toEqual({
            "data": null,
            "error": 'error',
            "params": 'params',
            "status": "rejected"
        })
    })
})