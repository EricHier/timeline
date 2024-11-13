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
      
    //needed because webwriter slot initialization
    timeline_event.setAttribute("event_title", title);
    timeline_event.setAttribute("event_startDate", startDate);
    timeline_event.setAttribute("event_endDate", endDate);
    timeline_event.setAttribute("slot", "event-slot");
    
    debugger;
    timeline.appendChild(timeline_event);

    tldialog.hideDialog();
    
    // this.sortEvents();
  }
  
  // dispatch custom remove event request to timeline 
  removeEvent(event){ 
    const eventToRemove = event.detail.id; 
    console.log("Delete request delivered: "+ eventToRemove);
    const timeline = document.querySelector("webwriter-timeline") as WebWriterTimeline;
    const eventContainer = timeline.querySelector(`event-container[id="${eventToRemove}"]`);
    
    if (eventContainer) {
      timeline.removeChild(eventContainer);
    }
  }

  // dispatchSortEvents() {
  //   this.dispatchEvent(new CustomEvent("request-sort", {
  //     bubbles: true,  
  //     composed: true
  //   }));
  //   console.log("Sort request dispatched");
  // }


  sortEvents(){
    const timeline = document.querySelector("webwriter-timeline") as WebWriterTimeline;
    const list = timeline.shadowRoot.querySelector('slot[name="event-slot"]');   
    console.log("sorting");
    debugger;

    [...list.children]

      // .sort((a:EventContainer, b:EventContainer) => a.event_startDate > b.event_startDate ? 1 : -1)
      // .forEach(node => list.appendChild(node));
      console.log("sorted succesfully");
  }

}
