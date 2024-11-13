import {LitElement, html, PropertyValues, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property} from "lit/decorators.js"

import "@shoelace-style/shoelace/dist/themes/light.css";

import {
  SlButton,
  SlDialog,
  SlIcon,
} from "@shoelace-style/shoelace";

import { EventContainer } from "../event-container";
import { TimelineInput } from "../dialog-elements/d-input";
import{ TimelineDialog} from "../tl-dialog";
import { EventManager } from "../event-manager";

@customElement("webwriter-timeline")

export class WebWriterTimeline extends LitElementWw {
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;

  static get styles() {
    return css`
    .border {
      border: 1px solid lightgray;
      border-radius: 5px;
      min-height: 700px;
      width: 100%,
    }

    #parent >* {
      margin-left: 10px;
    }
    
    h4 {
      text-align: center; 
    }
    
  `;
  }

  static get scopedElements() {
    return {
      "event-manager": EventManager,
      "event-container": EventContainer,
      "timeline-input": TimelineInput,
      "timeline-dialog": TimelineDialog,
      
      "sl-button": SlButton,
    };
  }

  private eventManager = new EventManager();

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.addEventListener("request-add", (e) => this.eventManager.addEvent(e));
    this.addEventListener("request-remove", (e) => this.eventManager.removeEvent(e));
    // this.addEventListener("request-sort", () => this.eventManager.sortEvents());
  
    // add eventlistener here which looks for events added so sort can be called

  }


  render() {
    return html`
      <div class="border" id="parent">
        <h4>My Timeline</h4>       
        
        <timeline-dialog id="timelineID"></timeline-dialog>
        <slot name="event-slot">
          <!-- <input label="date" > <br />
          <input label="date" > -->
        </slot>
        <!-- <button @click=${this.sortEntries}></button> -->
        <hr/>
        <sl-button id="addButton" @click=${this.openingTLDialog} >Add Event</sl-button> <br />
      </div>
    `;
  }

  // open dialog, dealing with input and event storage in sub-structures
  openingTLDialog(){
    const dialog = this.shadowRoot?.querySelector("#timelineID") as TimelineDialog;
    dialog.showDialog();
  }


  sortEntries(){
    const list = this.shadowRoot.querySelector('slot[name="event-slot"]');
    debugger; 
    [...list.children]
      .sort((a:any, b:any) => a.date > b.date ? 1 : -1)
      .forEach(node => list.appendChild(node));
  }
}