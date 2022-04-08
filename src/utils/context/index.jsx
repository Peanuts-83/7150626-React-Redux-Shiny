import React, { useState, createContext } from 'react'
import { useSelector } from 'react-redux'
import { getTheme } from '../../utils/selectors'
import { toggleTheme } from '../../features/theme'

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const theme = useSelector(getTheme)

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const SurveyContext = createContext()

export const SurveyProvider = ({ children }) => {
  const [answers, setAnswers] = useState({})
  const saveAnswers = (newAnswers) => {
    setAnswers({ ...answers, ...newAnswers })
  }

  return (
    <SurveyContext.Provider value={{ answers, saveAnswers }}>
      {children}
    </SurveyContext.Provider>
  )
}
