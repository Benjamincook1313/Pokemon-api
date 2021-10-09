import { createStore, /*combineReducers,*/ applyMiddleware } from 'redux'
import promiseMiddleware from 'redux-promise-middleware'
import reducer from './ducks/reducer'

// const rootReducer = combineReducers({
  
// })

// export default createStore(reducer, applyMiddleware(promiseMiddleware))