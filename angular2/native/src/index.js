var zone = require('../node_modules/zone.js/dist/zone');
var reflectMetadata = require('reflect-metadata');// decorators

var { NgModule, Component, enableProdMode, Input, Injectable } = core = require("@angular/core");
console.log('core:', core);
var { platformBrowserDynamic } = require('@angular/platform-browser-dynamic');
var { BrowserModule } = require('@angular/platform-browser');
var { FormsModule } = require('@angular/forms');
var { HttpModule } = require('@angular/http');

var AppComponent = require('./app/app.component');

var AppModule = NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule
    ],
    providers: [],
    bootstrap: [AppComponent]
}).Class({
    constructor: function() {}
});

document.addEventListener('DOMContentLoaded', function() {
    // if (environment.production) enableProdMode();
    enableProdMode();
    platformBrowserDynamic().bootstrapModule(AppModule);
});
