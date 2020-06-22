/**
 * @fileoverview setFilter reducer
 */

export const todos = (state='All',action)=>{
  switch (action.type){
    case 'SET_FILTER':
    return action.filter;
    default:
    return state;
  }
}