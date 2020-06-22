import {createStore,applyMiddleware,combineReducers} from 'redux'
//action 生成器
function addAction(data){
    return {
        type:"ADD",
        data
    }
}
function minusAction(data){
    return {
        type:"MINUS",
        data
    }
}
// data属性的reducer
const calc = function(state,action){
    switch (action.type){
        case "ADD":
            return Object.assign({},state,{data:data+action.data})
        case "MINUS":
            return Object.assign({},state,{data:data-action.data})
        default:
            return state
    }
}
// name属性的reducer
const changeName = function(state,action){
    return Object.assign({},state,{name:action.name})
}
const defaultState = {name:'t1',data:0}
const reducer = combineReducers({
    data:calc(state.data,action),
    name:changeName(state.name,action)
})
const store = createStore(reducer,initstate)