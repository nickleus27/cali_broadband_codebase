import { Component, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

/* Adaptor parent class to unsubscribe from all subscriptions OnDestroy */
@Component({
    template: ''
})
export abstract class UnSubscribeAdaptor implements OnDestroy {

    sub: SubSink;

    constructor() {
        this.sub = new SubSink();
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}