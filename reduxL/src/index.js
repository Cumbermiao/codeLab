/**
 * @fileoverview 实现一个todoList，组成部分:App 根组件，TodoList 展示todolist ，todo todo项 ，Link 带有 callback 回调功能的链接，Footer 一个允许用户改变可见 todo 过滤器的组件。
 */

 import React from 'react';
 import ReactDom,{render} from 'react-dom';
 import {Provider} from 'react-redux';
 import Footer from './components/Footer';

 render(<Footer/>,document.getElementById("app"));