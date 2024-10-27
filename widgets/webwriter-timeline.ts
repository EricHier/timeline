import {LitElement, html, PropertyValues, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property} from "lit/decorators.js"
// import { TempusDominus } from "tempus-dominus";
// import "tempus-dominus/dist/css/tempus-dominus.css";

import "@shoelace-style/shoelace/dist/themes/light.css";

import {
  SlButton,
  SlDialog,
} from "@shoelace-style/shoelace";

import { EventContainer } from "../event-container";
import { TimelineInput } from "../tl-input";
import{ TimelineDialog} from "../tl-dialog";

@customElement("webwriter-timeline")

export class WebWriterTimeline extends LitElementWw {
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;
  


  static get styles() {
    return css`
    `;
  }

  static get scopedElements() {
    return {
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
      <div>
        <h4>My Timeline</h4>       
      
        <timeline-dialog id="timelineID"></timeline-dialog>

        <sl-button id="addButton"  @click=${this.openingTLDialog} >Add Event</sl-button>

        <slot></slot>
      </div>
    `;
  }



  //adding data in dialog, adding new event to timeline
  addEvent(){
    const dialog = this.shadowRoot?.querySelector(".dialog-width");
    const save_button = this.shadowRoot?.querySelector('sl-button[id="savingButton"]');
    const timeline_event = new EventContainer();
    var input_title = dialog.querySelector("#eventTitle") as TimelineInput;
    var input_description = dialog.querySelector("#eventDescription") as TimelineInput;

    timeline_event.setAttribute("event_title", input_title.value);
    timeline_event.setAttribute("event_description", input_description.value);    

    this.appendChild(timeline_event);

    dialog.addEventListener("sl-after-hide", () => {
      // this.resetInputValues();
    });

    (dialog as SlDialog).hide();
  }




  openingTLDialog(){
    const dialog = this.shadowRoot?.querySelector("#timelineID") as TimelineDialog;
    dialog.showDialog();
  }
}