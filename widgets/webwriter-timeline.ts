import {LitElement, html, PropertyValues, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property} from "lit/decorators.js"
import { TempusDominus } from '@eonasdan/tempus-dominus';
import '@eonasdan/tempus-dominus/dist/css/tempus-dominus.css';

import "@shoelace-style/shoelace/dist/themes/light.css";

import {
  SlButton,
  SlDialog,
  SlIcon,
} from "@shoelace-style/shoelace";

import { EventContainer } from "../event-container";
import { TimelineInput } from "../tl-input";
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

      .body {
        --dot-bg: white;
        --dot-color: gray;
        --dot-size: 1px;
        --dot-space: 22px;
        background:
        linear-gradient(90deg, var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space),
        linear-gradient(var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space),
        var(--dot-color);
        border: 1px solid lightgray;
        border-radius: 5px;
        min-height: 500px;
        width: 80%,
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

  protected firstUpdated(_changedProperties: PropertyValues): void {
  }

  render() {
    return html`
      <div class="border">
        <h4>   My Timeline</h4>       
        <div class="body" class="innerborder">
          <slot></slot>
        </div>
        <timeline-dialog id="timelineID"></timeline-dialog>
        
        <sl-button id="addButton" @click=${this.openingTLDialog} >Add Event</sl-button> <br />

        
      </div>
    `;
  }

  // open dialog, dealing with input and event storage in sub-structures
  openingTLDialog(){
    const dialog = this.shadowRoot?.querySelector("#timelineID") as TimelineDialog;
    dialog.showDialog();
  }

}