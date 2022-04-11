import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './pages/Home'
import Survey from './pages/Survey'
import Results from './pages/Results'
import Freelances from './pages/Freelances'
import Profile from './pages/Profile'
import Header from './components/Header'
import Footer from './components/Footer'
import Error from './components/Error'
import GlobalStyle from './utils/style/GlobalStyle'
import { Provider } from 'react-redux'
import store from './utils/store'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

const defaultQueryFn = async({queryKey}) => {
  if (queryKey.length <= 1) {
    const data = await fetch(`http://localhost:8000/${queryKey[0]}`)
    return data.json()
  } else {
    let keys = ''
    queryKey.forEach((key, index) => {
      keys += index === 0 ? `${key}/` : `?id=${key}`
    })
    const data = await fetch(`http://localhost:8000/${keys}`)
    return data.json()
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    }
  }
})

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <React.StrictMode>
        <Router>
          <GlobalStyle />
          <Header />
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/survey/:questionNumber">
              <Survey />
            </Route>
            <Route path="/results">
              <Results />
            </Route>
            <Route path="/freelances">
              <Freelances />
            </Route>
            <Route
              path="/profile/:id"
              render={(props) => <Profile {...props} />}
            />
            <Route path="*">
              <Error />
            </Route>
          </Switch>
          <Footer />
        </Router>
      </React.StrictMode>
    </Provider>
    <ReactQueryDevtools initialIsOpen={true} />
  </QueryClientProvider>,
  document.getElementById('root')
)
