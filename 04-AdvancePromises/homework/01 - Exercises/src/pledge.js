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
            if (handler.successCb) {
              handler.successCb(this._value);
            }
          });

          this._handlerGroups = [];
    }
    this._internalReject = (reason) => {
        if(this._state === "fulfilled" || this._state === "rejected") return
        this._state = "rejected";
        this._value = reason

        this._handlerGroups.forEach((handler) => {
            if (handler.errorCb) {
              handler.errorCb(this._value);
            }
          });
    }

    const resolve = (value) => {this._internalResolve(value)}
    const reject = (reason) => {this._internalReject(reason)}


    executor(resolve, reject);


    this.then = (successCb, errorCb) => {
       

        if(typeof successCb !== "function") successCb = false;
        if(typeof errorCb !== "function") errorCb = false;

        if(this._state === "fulfilled") {
                successCb(this._value)
        }

        if(this._state === "rejected" && errorCb) {
            errorCb(this._value)
        }

        let handlers = {
            successCb,
            errorCb
        }
        this._handlerGroups.push(handlers)

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
