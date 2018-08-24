# Appolo Context
[![Build Status](https://travis-ci.org/shmoop207/appolo-context.svg?branch=master)](https://travis-ci.org/shmoop207/appolo-context)
[![npm](http://img.shields.io/npm/v/appolo-context.svg?style=flat-square)](https://www.npmjs.org/package/appolo-context)
[![Github Releases](https://img.shields.io/npm/dm/appolo-context.svg?style=flat-square)](https://github.com/shmoop207/appolo-context)
[![Known Vulnerabilities](https://snyk.io/test/github/shmoop207/appolo-context/badge.svg)](https://snyk.io/test/github/shmoop207/appolo-context)

nodejs async hooks context storage
can be used to create context per request

> Attention! This package is using the new [async hooks](https://nodejs.org/api/async_hooks.html) API, which is available from Node 8.9.0, but still experimental. It is strongly recommended NOT to use in production environments.


## Installation:

```javascript
npm install appolo-context --save
```

## Usage
```javascript
import {namespace} from "appolo-context";

let context = namespace.create("someName");
context.initialize();

class A {
 run(){
    let context = namespace.get("someName")

    context.set("id","someId")

    return Promise.resolve();
 }
}

class B {
 run(){
    let context = namespace.get("someName")

    let id = context.get("id");

    return Promise.resolve(id);
 }
}

context.scope(async()=>{
    await new A().run();
    let id  = await new B().run();

    console.log(id) // someId
})


```

### Express Usage
```javascript
import {context} from "appolo-context";
import * as express from "express";

context.initialize();

let app = express();
app.use((req,res,next)=>{
    context.scope(()=>{
        context.set("id",uuid.v1());
        next();
    })
})

app.use(async (req,res,next())=>{
    let reuslt  = await doSomethingAsync();
    res.send(reuslt)
})
```
Now you can retrieve the context in any file of function.
```javascript
import {context} from "appolo-context";

async function doSomethingAsync(){

    return context.get("id");
}

```

### Namespace

#### `create(name:string|Symbol):Context`
Create new context by given name
```javascript
import {namespace} from "appolo-context";

let context = namespace.create("someName");
context.initialize();
```

#### `get(name:string|Symbol):Context`
get context by given name
```javascript
import {namespace} from "appolo-context";

let context = namespace.get("someName");
context.get("someValue")
```

#### `delete(name:string|Symbol)`
delete context by given name and destroy it
```javascript
import {namespace} from "appolo-context";

let context = namespace.delete("someName");
```

#### `get context():Context`
get the default context
```javascript
import {namespace} from "appolo-context";

let context = namespace.context;

context.initialize()
```

### Context
#### `initialize()`
initialize the async hooks must be called before any get or set methods
this will create the async hooks and enable them.

### Context
#### `scope(fn:Function)`
create new context scope and triggers the given function
```javascript
import {context} from "appolo-context";
import * as express from "express";

context.initialize();

let app = express();
app.use((req,res,next)=>{
    context.scope(()=>{
        context.set("id",uuid.v1());
        next();
    })
})
```

#### `get(key:any):any`
get context value by key

#### `set(key:any,value:any)`
set context value by key

#### `enable()`
enable the async hooks

#### `destroy()`
destroy the context and clean all resources.
## License
MIT