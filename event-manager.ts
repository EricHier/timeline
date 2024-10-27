import {LitElement, html, PropertyValues, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property} from "lit/decorators.js"

import "@shoelace-style/shoelace/dist/themes/light.css";

import { EventContainer } from "./event-container";
import { TimelineInput } from "./tl-input";
import{ TimelineDialog} from "./tl-dialog";
import { WebWriterTimeline } from "./widgets/webwriter-timeline";

@customElement("event-manager")

export class EventManager extends LitElementWw {  
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;

  static styles = css`
  `;

  static get scopedElements() {
    return {      
      "event-container": EventContainer,
      "timeline-input": TimelineInput,
      "timeline-dialog": TimelineDialog,
      "webwriter-timelin": WebWriterTimeline,
    };
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
  }


  render() {
        return html`
        `;
      } 

//adding event to webwriter-timeline slot by creating event-container, enddate is optional
  addEvent(isChecked){
    const eventDisplayElement = document.querySelector('webwriter-timeline') as WebWriterTimeline;
    const tldialog = eventDisplayElement.shadowRoot.querySelector("timeline-dialog") as TimelineDialog;
    const timeline_event = new EventContainer();
   
    var input_title = tldialog.shadowRoot.querySelector("#eventTitle") as TimelineInput;
    var input_description = tldialog.shadowRoot.querySelector("#eventDescription") as TimelineInput;
    var input_startDate = tldialog.shadowRoot.querySelector("#eventStartDate") as TimelineInput; 
    
    timeline_event.setAttribute("event_title", input_title.value);
    timeline_event.setAttribute("event_description", input_description.value);
    timeline_event.setAttribute("event_startDate", input_startDate.value);

    if(isChecked){
      var input_endDate = tldialog.shadowRoot.querySelector("#eventEndDate") as TimelineInput; 
      timeline_event.setAttribute("event_endDate", input_endDate.value);
    }

    eventDisplayElement.shadowRoot.querySelector("slot").appendChild(timeline_event);
    tldialog.hideDialog();
  }

}
