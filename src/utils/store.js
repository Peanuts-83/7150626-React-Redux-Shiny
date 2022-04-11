import themeReducer from '../features/theme'
// import freelancesReducer from '../features/freelances'
// import surveyReducer from '../features/survey'
// import freelanceReducer from '../features/freelance'
// import resultsReducer from '../features/results'
import answersReducer from '../features/answers'
import { configureStore } from '@reduxjs/toolkit'

export default configureStore({
  reducer: {
    theme: themeReducer,
    answers: answersReducer,
  },
})
