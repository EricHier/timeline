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
  addEvent(event){
    const { title, startDate, endDate } = event.detail;
    const timeline = document.querySelector('webwriter-timeline') as WebWriterTimeline;
    const tldialog = timeline.shadowRoot.querySelector("timeline-dialog") as TimelineDialog;

    const timeline_event = new EventContainer(title.value, startDate.date, endDate.date);

    //needed because webwriter slot initialization
    timeline_event.setAttribute("event_title", title.value);
    timeline_event.setAttribute("event_startDate", startDate.date);
    timeline_event.setAttribute("event_endDate", endDate.date);
   
    timeline.appendChild(timeline_event);

    tldialog.hideDialog();
    // add event listener for custom event signal and sort entries  and cases like scaling time axis
    // timeline_event.addEventListener(event){
    // }

    // this.sortEntries(); //check ob überflüssig mit eventlistener
  }
  
  removeEvent(event){ 
    const eventToRemove = event.detail.title; 
    console.log("Delete request delivered: "+ eventToRemove);
    const timeline = document.querySelector('webwriter-timeline') as WebWriterTimeline;
    const eventContainer = timeline.querySelector(`event-container[id="${eventToRemove}"]`);
    
    if (eventContainer) {
      timeline.removeChild(eventContainer);
    }
  }

  // sortEntries(){
  //   const list = this.shadowRoot.querySelector('slot[name="event-slot"]');

  //   [...list.children]
  //     .sort((a:any, b:any) => a.date > b.date ? 1 : -1)
  //     .forEach(node => list.appendChild(node));
  // }
}
