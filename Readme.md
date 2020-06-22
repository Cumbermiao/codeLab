# CodeLab

> write test code and new code here

## reduxL

> redux 学习， 重点： 中间件、异步中间件

middleware 只是报装了 dispatch 方法。

### createStore(reducer, [preloadedState], enhancer)

> enhancer 是经过 applyMiddlewares 合并过后的函数

```js
function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  // preloadedState enhancer 参数识别
  if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== "undefined") {
    /***
     * enhancer 存在执行 enhancer 函数，并传入参数
     * 此处可以看出 applyMiddleware 之后的函数接收参数为 createStore
     *
     */
    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== "function") {
    throw new Error("Expected the reducer to be a function.");
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  function getState() {
    return currentState;
  }

  function subscribe(listener) {
    if (typeof listener !== "function") {
      throw new Error("Expected the listener to be a function.");
    }
    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }
      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }

  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error(
        "Actions must be plain objects. " +
          "Use custom middleware for async actions."
      );
    }

    if (typeof action.type === "undefined") {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
          "Have you misspelled a constant?"
      );
    }

    if (isDispatching) {
      throw new Error("Reducers may not dispatch actions.");
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = (currentListeners = nextListeners);

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }

  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== "function") {
      throw new Error("Expected the nextReducer to be a function.");
    }

    currentReducer = nextReducer;

    dispatch({
      type: ActionTypes.REPLACE
    });
  }

  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return (
      (_ref = {
        subscribe: function subscribe(observer) {
          if (typeof observer !== "object" || observer === null) {
            throw new TypeError("Expected the observer to be an object.");
          }

          function observeState() {
            if (observer.next) {
              observer.next(getState());
            }
          }

          observeState();
          var unsubscribe = outerSubscribe(observeState);
          return {
            unsubscribe: unsubscribe
          };
        }
      }),
      (_ref[result] = function() {
        return this;
      }),
      _ref
    );
  }

  dispatch({
    type: ActionTypes.INIT
  });
  return (
    (_ref2 = {
      dispatch: dispatch,
      subscribe: subscribe,
      getState: getState,
      replaceReducer: replaceReducer
    }),
    (_ref2[result] = observable),
    _ref2
  );
}
```

### applyMiddleware

#### middleware 写法

```js
function loggerHi( middlewareAPI ) {
  return function(next) {
    return function(action) {
      console.log("hello", action);
      let returnValue = next(action);
      return returnValue;
    };
  };
}

function loggerBye( middlewareAPI ) {
  return function(next) {
    return function(action) {
      console.log("bye", action);
      let returnValue = next(action);
      return returnValue;
    };
  };
}
```
### applyMiddleware 做了什么
```js
export default function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args);
    let dispatch = () => {
      throw new Error(
        "Dispatching while constructing your middleware is not allowed. " +
          "Other middleware would not be applied to this dispatch."
      );
    };

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    };

    //传入 middlewareAPI ， loggerHi 执行后变成 next=>action=>{...} 的形式
    const chain = middlewares.map(middleware => middleware(middlewareAPI));

    //compose 之后，变成 loggerHi 包裹 loggerBye，格式如下
    // (...args)=>{
    //   loggerHi(loggerBye(...args))
    // }
    dispatch = compose(...chain)(store.dispatch);

    // 重写列 dispatch 方法
    return {
      ...store,
      dispatch
    };
  };
}

export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
```

```js
function a(name) {
  console.log("name of a is", a);
}
function b(age) {
  console.log("age of b is", b);
}

[a, b].reduce((a, b) => (...args) => {});
```

### 此处重点有两个操作
1. `const chain = middlewares.map(middleware => middleware(middlewareAPI));` 为所有的 middleware 注入 middlewareAPI

2. `compose`