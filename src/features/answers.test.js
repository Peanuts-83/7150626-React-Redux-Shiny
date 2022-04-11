import { saveAnswer } from "./answers";
import answersReducer from "./answers"

describe('Answers action & reducer', () => {
    it('should return correct type & payload', () => {
        expect(saveAnswer()).toEqual({
            type: 'answers/saveAnswer'
        })
    })
})

describe('Answers reducer', () => {
    it('should return correct answers & numbers', () => {
        expect(answersReducer({}, ({
            type: 'answers/saveAnswer',
            payload: { questionNumber: 1, answer: 'oui' }
        }))).toEqual({1: 'oui'})
        expect(answersReducer({0: 'peut-etre'}, ({
            type: 'answers/saveAnswer',
            payload: { questionNumber: 1, answer: 'oui' }
        }))).toEqual({0: 'peut-etre', 1: 'oui'})
    })
})