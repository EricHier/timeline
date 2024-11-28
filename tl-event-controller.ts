import {ReactiveController, ReactiveControllerHost, LitElement, html, PropertyValues, css} from 'lit';
import { LitElementWw } from "@webwriter/lit";
import { customElement, property, query } from "lit/decorators.js";


export class EventController implements ReactiveController {
    host: ReactiveControllerHost;

    test: string;

    constructor(host: ReactiveControllerHost, test){
        this.test = test;
    }
    hostConnected(): void {
        console.log("connected host");
        this.host.requestUpdate();
    }
    hostDisconnected(): void {
        console.log("disconnected host");
    }
}