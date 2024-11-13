import {LitElement, html, PropertyValues, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property} from "lit/decorators.js"

import "@shoelace-style/shoelace/dist/themes/light.css";

import { EventContainer } from "./event-container";
import { DialogInput } from "./dialog-elements/d-input";
import{ TimelineDialog} from "./tl-dialog";
import { WebWriterTimeline } from "./widgets/webwriter-timeline";
import { DialogDatePicker } from "./dialog-elements/d-datepicker";

@customElement("event-manager")

export class EventManager extends LitElementWw {  
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;

  static styles = css`
  `;

  static get scopedElements() {
    return {      
      "event-container": EventContainer,
      "timeline-input": DialogInput,
      "timeline-dialog": TimelineDialog,
      "webwriter-timelin": WebWriterTimeline,
      "custom-datepicker":DialogDatePicker,
    };
  }

  render() {
    return html`
    `;
  } 


  //adding event to webwriter-timeline slot by creating event-container
  addEvent(event){
    const timeline = document.querySelector("webwriter-timeline") as WebWriterTimeline;
    const tldialog = timeline.shadowRoot.querySelector("timeline-dialog") as TimelineDialog;
    const { title, startDay, startMonth, startYear, endDay, endMonth, endYear } = event.detail;
    
    const startDate = startDay + ". " + startMonth + ". " + startYear;
    
    let endDate = "";
    if (endYear) {
        endDate = endDay + ". " + endMonth + ". " + endYear;
    }

    const timeline_event = new EventContainer(title, startDate, endDate);
      
    //needed because webwriter slot initialization, set input values to event container values
    timeline_event.setAttribute("event_title", title);
    timeline_event.setAttribute("event_startDate", startDate);
    timeline_event.setAttribute("event_endDate", endDate);
    timeline_event.setAttribute("slot", "event-slot");
    
    timeline.appendChild(timeline_event);
    tldialog.hideDialog();
    
    // this.sortEvents();
  }
  
  // dispatch remove request to timeline 
  removeEvent(event){ 
    const eventToRemove = event.detail.id; 
    console.log("Delete request delivered: "+ eventToRemove);
    const timeline = document.querySelector("webwriter-timeline") as WebWriterTimeline;
    const eventContainer = timeline.querySelector(`event-container[id="${eventToRemove}"]`);
    
    if (eventContainer) {
      timeline.removeChild(eventContainer);
    }
  }

  
}
