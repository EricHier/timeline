import {LitElement, html, PropertyValues, css, defaultConverter} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property, query} from "lit/decorators.js"

import "@shoelace-style/shoelace/dist/themes/light.css";

import { EventContainer } from "./event-container";
import { DialogInput } from "./dialog-elements/d-input";
import{ TimelineDialog} from "./tl-dialog";
import { WebWriterTimeline } from "./widgets/webwriter-timeline";
import { DialogDatePicker } from "./dialog-elements/d-datepicker";
import { DateManager } from "./date-manager";
import { TlEventData } from "./tl-event-data";

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
      "date-manager": DateManager,
    };
  }

  private dateManager = new DateManager();

  render() {
    return html`
    `;
  } 

  // adding event to webwriter-timeline slot by creating event-container, 
  addEvent(event: CustomEvent<TlEventData>, timeline) {
    const tldialog = timeline?.shadowRoot?.querySelector("timeline-dialog") as TimelineDialog;
    const { title, startDate, endDate } = event.detail;
    const timeline_event = new EventContainer();

    timeline_event.setAttribute("event_title", title);
    timeline_event.setAttribute("event_startDate", JSON.stringify(startDate));
    if(endDate !== undefined){
      timeline_event.setAttribute("event_endDate", JSON.stringify(endDate));
    }
    timeline_event.setAttribute("slot", "event-slot");

    timeline.appendChild(timeline_event);

    this.dateManager.sortEvents(timeline); 

    tldialog.hideDialog(); 
  }

   // dispatch remove request of event to timeline 
  removeEvent(event){ 
    const eventToRemove = event.detail.id; 
    const timeline = document.querySelector("webwriter-timeline") as WebWriterTimeline;
    const tlslot =  timeline.shadowRoot.querySelector('slot[name="event-slot"]');
    const eventContainer = timeline.querySelector(`event-container[id="${eventToRemove}"]`);

    if (eventContainer) {
      timeline.removeChild(eventContainer);
    }
  }
}
