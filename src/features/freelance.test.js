import * as freelanceActions from './freelance'
import freelanceReducer from './freelance'

const { fetching, resolved, rejected } = freelanceActions
describe('Freelance actions', () => {
    it('should return correct type & payload', () => {
        expect(fetching(12)).toEqual({
            type: 'freelance/fetching',
            payload: {freelanceId: 12}
        })
        expect(resolved(12, 'data')).toEqual({
            type: 'freelance/resolved',
            payload: {freelanceId: 12, data: 'data'}
        })
        expect(rejected(12, 'error')).toEqual({
            type: 'freelance/rejected',
            payload: {freelanceId: 12, error: 'error'}
        })
    })
})

const testState = {
    12: {
        status: 'void',
        error: null,
        data: null
    }
}
describe('Freelance reducer', () => {
    it('should return "pending" or "updating" status on fetching action, or "void" if undefined state', () => {
        expect(freelanceReducer(undefined, resolved(12, 'data'))).toEqual({
            12: {
                status: 'void'
            }})
        expect(freelanceReducer({}, fetching(12))).toEqual({
            12: {
                status: "pending"
            }})
        expect(freelanceReducer(testState, fetching(12))).toEqual({
            12: {
                error: null,
                data: null,
                status: "pending",
            }})
        expect(freelanceReducer({...testState, 12:{...testState[12], status: 'resolved'}}, fetching(12))).toEqual({
            12: {
                error: null,
                data: null,
                status: "updating"
            }})
        expect(freelanceReducer({...testState, 12:{...testState[12], status: 'rejected'}}, fetching(12))).toEqual({
            12: {
                error: null,
                data: null,
                status: "pending"
            }})
    })
    it('should return "resolved" status with data on resolved action, or previous state if not "pending" or "updating" status, or "void" if undefined state', () => {
        expect(freelanceReducer(undefined, resolved(12, 'data'))).toEqual({
            12: {
                status: 'void'
            }
        })
        expect(freelanceReducer({...testState, 12:{...testState[12], status: 'pending'}}, resolved(12, 'data'))).toEqual({
            12: {
                error: null,
                data: 'data',
                status: 'resolved'
            }
        })
        expect(freelanceReducer({...testState, 12:{...testState[12], status: 'updating'}}, resolved(12, 'data'))).toEqual({
            12: {
                error: null,
                data: 'data',
                status: 'resolved'
            }
        })
        expect(freelanceReducer({...testState, 12:{...testState[12], status: 'rejected'}}, resolved(12, 'data'))).toEqual({
            12: {
                error: null,
                data: null,
                status: 'rejected'
            }
        })
    })
    it('should return "rejected" status with error on rejected action, or previous state if not "pending" or "updating" status, or "void status if undefined state', () => {
        expect(freelanceReducer(undefined, rejected(12, 'error'))).toEqual({
            12: {
                status: 'void'
            }
        })
        expect(freelanceReducer({...testState, 12:{...testState[12], status: 'pending'}}, rejected(12, 'error'))).toEqual({
            12: {
                error: 'error',
                data: null,
                status: 'rejected'
            }
        })
        expect(freelanceReducer({...testState, 12:{...testState[12], status: 'updating'}}, rejected(12, 'error'))).toEqual({
            12: {
                error: 'error',
                data: null,
                status: 'rejected'
            }
        })
        expect(freelanceReducer({...testState, 12:{...testState[12], status: 'resolved'}}, rejected(12, 'error'))).toEqual({
            12: {
                error: null,
                data: null,
                status: 'resolved'
            }
        })
    })
})