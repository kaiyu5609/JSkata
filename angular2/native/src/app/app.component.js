var { Component } = core = require("@angular/core");

var AppComponentService = require('./app.service');

module.exports = Component({
    selector: 'app-root',
    template: '<div *ngFor="let d of data">{{label}} {{d.color}}</div>'+
    '<input value="{{heroName}}" />'+
    '<input [(ngModel)]="heroName" />',
    styleUrls: ['./app.component.css'],
    providers: [AppComponentService]
})
.Class({
    constructor: [AppComponentService, function(AppComponentService) {
        console.log('AppComponent:', this);

        this.heroName = 'rocket';
        this.data = AppComponentService.getData();
        this.label = AppComponentService.say("hello");
    }]
});
