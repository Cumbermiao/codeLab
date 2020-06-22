//observer
function defineReactive(obj,key,value,){
    debugger
    var dep = new Dep()
    Object.defineProperty(obj,key,{
        get:function(){
            if(Dep.target){
                dep.addSub(Dep.target)
            }
            console.log('get')
            return value
        },
        set:function(newV){
            console.log(newV)
            if(newV === value){
                return
            }
            value = newV
            dep.notify()
        }
    })
}
function observe(data,vm){
    var keys = Object.keys(data)
    keys.forEach(function(key){
        defineReactive(vm,key,data[key])
    })
}
//dep
function Dep(){
    this.watcherList=[]
}
Dep.prototype.addSub = function(sub){
    this.watcherList.push(sub)
}
Dep.prototype.notify = function(){
    console.log('notify',this.watcherList)
    this.watcherList.forEach(function(watcher){
        watcher.update()
    })
}
//watcher
//key现在只是用来获取data中对应的value
function Watcher(vm,ele,key,type){
    Dep.target = this
    this.vm = vm
    this.ele=ele
    this.key = key
    this.type = type
    this.update()
    Dep.target = null
}
Watcher.prototype.update=function(){
    this.get()
    console.log(this.value)
    this.ele[this.type] = this.value
    //watch中对应key的 newV和oldV，使用call将this绑定到vm
    // this.cb.call(this.vm, value, oldVal);
}
Watcher.prototype.get=function(){
    // console.log(this.vm,this.key,this.vm[this.key])
    this.value = this.vm[this.key]
}
//compile

function Compile(node,vm){
    //HTML element
    if(node){
        var frag = document.createDocumentFragment(),firstChild;
        while(firstChild=node.firstChild){
            compileElement(firstChild,vm)
            frag.append(firstChild)
        }
    }
    return frag
}
function compileElement(ele,vm){
    var reg = /\{\{(.*)\}\}/;
    // console.dir(ele)
    if(ele.nodeType===1){
        var attrs = ele.attributes
        for(var i=0;i<attrs.length;i++){
            //nodeName 属性，nodeValue绑定的变量
            if(attrs[i].nodeName==='v-model'){
                var key = attrs[i].nodeValue
                ele.addEventListener('input',function(e){
                    console.log('input',vm)
                    vm[key] = e.target.value;
                })
                // ele.value = vm.data[key]
                new Watcher(vm, ele, key, 'value');
            }

        }
    }else if(ele.nodeType ===3){
        if(reg.test(ele.nodeValue)){
            var key = RegExp.$1
            key = key.trim()
            ele.nodeValue = vm[key]
            new Watcher(vm, ele, key, 'nodeValue');
        }
    }
}


function Vue(options){
    this.el = options.el;
    this.data = options.data
    var root = document.getElementById(this.el)
    observe(this.data,this)
    
    root.appendChild(Compile(root,this))
}
