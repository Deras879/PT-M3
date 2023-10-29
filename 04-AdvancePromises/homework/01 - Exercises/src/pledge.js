'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:

function $Promise(executor){
    if(typeof executor !== "function") throw new TypeError("El argumento executor no es una function")

    this._state = "pending"
    this._value = undefined
    this._handlerGroups = []


    this._internalResolve = (value) => {
        if(this._state === "fulfilled" || this._state === "rejected") return
        this._state = "fulfilled"
        this._value = value

        this._handlerGroups.forEach((handler) => {
            if (!handler.successCb) {
              handler.downstreamPromise._internalResolve(this._value)
            }else {
                try {
                    let result = handler.successCb(this._value)

                    if(result instanceof $Promise){
                        let sH = (value) => {
                            handler.downstreamPromise._internalResolve(value)
                        }
                        let eH = (err) => {
                            handler.downstreamPromise._internalReject(err)
                        }
                        result.then(sH, eH)
                    }else{
                        handler.downstreamPromise._internalResolve(result)
                    }
                  } catch (error) {
                    handler.downstreamPromise._internalReject(error)
                  }
            }
          });

          this._handlerGroups = [];
    }
    this._internalReject = (reason) => {
        if(this._state === "fulfilled" || this._state === "rejected") return
        this._state = "rejected";
        this._value = reason

        this._handlerGroups.forEach((handler) => {
            if (!handler.errorCb) {
              handler.downstreamPromise._internalReject(this._value)
            }else {
                try {
                    let result = handler.errorCb(this._value)

                    if(result instanceof $Promise){
                        let sH = (value) => {
                            handler.downstreamPromise._internalResolve(value)
                        }
                        let eH = (err) => {
                            handler.downstreamPromise._internalReject(err)
                        }
                        result.then(sH, eH)
                    }else{
                        handler.downstreamPromise._internalResolve(result)
                    }
                  } catch (error) {
                    handler.downstreamPromise._internalReject(error)
                  }
            }
          });
    }

    const resolve = (value) => {this._internalResolve(value)}
    const reject = (reason) => {this._internalReject(reason)}


    executor(resolve, reject);


    this.then = (successCb, errorCb) => {
        let downstreamPromise = new $Promise(() => {})

        if(typeof successCb !== "function") successCb = false;
        if(typeof errorCb !== "function") errorCb = false;

        if(this._state === "fulfilled" && successCb) {
            successCb(this._value)
            
            
            
        }
        if(this._state === "rejected" && errorCb) {
            errorCb(this._value)
        }

        let handlers = {
            successCb,
            errorCb,
            downstreamPromise
        }
        this._handlerGroups.push(handlers)


        return downstreamPromise;
    }


    this.catch = function(func) {
        return this.then(null, func)
    }
    

}





module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
