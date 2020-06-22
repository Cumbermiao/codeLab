import React,{useState} from 'react'
import store from '../../store'


store.dispatch({type:'ADD_COUNT'})
export default function(){
  let [count,changeCount] = useState(0)

  const num = store.getState()
  console.log(store,num)



  return (
    <div>
      <p>current Count: {count}</p>
      <button onClick={()=>changeCount(count+1)}>add</button>
      <button onClick={()=>changeCount(count-1)}>minus</button>
    </div>
  )
}