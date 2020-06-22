import {createStore, applyMiddleware, compose} from 'redux'

const loggerHelloWare = function({getState,dispatch}){
  return function(next){
    return function(action){
      const state = getState();
      console.log('hello',next,action.type)
      next(action)
      return action
    }
  }
}

const loggerByeWare = function({getState,dispatch}){
  return function(next){
    return function(action){
      const state = getState();
      console.log('bye',next,action.type)
      next(action)
      return action
    }
  }
}



const enhancer = applyMiddleware(loggerHelloWare,loggerByeWare)

const countReducers = function(state={count:0},action){
  switch(action.type){
    case 'ADD_COUNT':
      return state.count+1
    case 'MINUS_COUNT':
      return state.count-1
  }
}

let store = createStore(countReducers,{count:0})

const middlewares = [loggerHelloWare,loggerByeWare].map(item=>item({...store}))

let dispatch = compose(...middlewares)(store.dispatch)
console.log(dispatch)
debugger
dispatch({type:'ADD'})


export default store