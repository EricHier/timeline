import {LitElement, html, PropertyValues, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property} from "lit/decorators.js"

import "@shoelace-style/shoelace/dist/themes/light.css";

import { EventContainer } from "./event-container";
import { TimelineInput } from "./tl-input";
import{ TimelineDialog} from "./tl-dialog";
import { WebWriterTimeline } from "./widgets/webwriter-timeline";
import { CustomDatePicker } from "./custom-datepicker";

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
      "custom-datepicker":CustomDatePicker,
    };
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
  }


  render() {
    return html`
    `;
  } 

//adding event to webwriter-timeline slot by creating event-container, enddate is optional
  addEvent(){
    const eventDisplayElement = document.querySelector('webwriter-timeline') as WebWriterTimeline;
    const tldialog = eventDisplayElement.shadowRoot.querySelector("timeline-dialog") as TimelineDialog;
    
    var input_title = tldialog.shadowRoot.querySelector("#eventTitle") as TimelineInput;
    var input_startDate = tldialog.shadowRoot.querySelector("#eventStartDate") as CustomDatePicker; 
    var input_endDate = tldialog.shadowRoot.querySelector("#eventEndDate") as CustomDatePicker; 

    const timeline_event = new EventContainer(input_title.value, input_startDate.date, input_endDate.date);

    // this is needed because webwriter slot initialization
    timeline_event.setAttribute("event_title", input_title.value);
    timeline_event.setAttribute("event_startDate", input_startDate.date);
    timeline_event.setAttribute("event_endDate", input_endDate.date);
   
    eventDisplayElement.appendChild(timeline_event);
    tldialog.hideDialog();
  }

}
