import * as surveyActions from './survey'
import surveyReducer from './survey'

const { fetching, resolved, rejected } = surveyActions

describe('Survey actions', () => {
    it('should return proper type', () => {
        expect(fetching()).toEqual({ type: 'survey/fetching' })
        expect(resolved()).toEqual({ type: 'survey/resolved' })
        expect(rejected()).toEqual({ type: 'survey/rejected' })
    })
})

const initialState = {
    status: 'void',
    data: null,
    error: null,
}
describe('Survey reducer', () => {
    it('should return status "pending" or "updating" on fetching action', () => {
        expect(surveyReducer(initialState, fetching)).toEqual({
            "data": null,
            "error": null,
            "status": "pending"
        })
        expect(surveyReducer({ ...initialState, status: 'rejected' }, fetching)).toEqual({
            "data": null,
            "error": null,
            "status": "pending"
        })
        expect(surveyReducer({ ...initialState, status: 'resolved' }, fetching)).toEqual({
            "data": null,
            "error": null,
            "status": "updating"
        })
    })
    it('should return status "resolved" with data on resolved action', () => {
        expect(surveyReducer({ ...initialState, status: 'pending' }, resolved({ data: 'data' }))).toEqual({
            "data": { data: 'data' },
            "error": null,
            "status": "resolved"
        })
        expect(surveyReducer({ ...initialState, status: 'updating' }, resolved({ data: 'data' }))).toEqual({
            "data": { data: 'data' },
            "error": null,
            "status": "resolved"
        })
    })
    it('should return status "rejected" with error on rejected action', () => {
        expect(surveyReducer({ ...initialState, status: 'pending' }, rejected({ error: 'error' }))).toEqual({
            "data": null,
            "error": { error: 'error' },
            "status": "rejected"
        })
        expect(surveyReducer({ ...initialState, status: 'updating' }, rejected({ error: 'error' }))).toEqual({
            "data": null,
            "error": { error: 'error' },
            "status": "rejected"
        })
    })
    it('should return previous state on invalid action', () => {
        expect(surveyReducer({ ...initialState, status: 'void' }, { type: 'invalidAction' })).toEqual({
            "data": null,
            "error": null,
            "status": "void"
        })
        expect(surveyReducer({ ...initialState, status: 'pending' }, { type: 'invalidAction' })).toEqual({
            "data": null,
            "error": null,
            "status": "pending"
        })
        expect(surveyReducer({ ...initialState, status: 'updating' }, { type: 'invalidAction' })).toEqual({
            "data": null,
            "error": null,
            "status": "updating"
        })
    })
})
