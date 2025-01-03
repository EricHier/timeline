import {LitElement, html, PropertyValues, css} from "lit"
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

  // @query('webwriter-timeline') accessor timeline: WebWriterTimeline;
  // @query('webwriter-timeline timeline-dialog') accessor dialog: TimelineDialog;
  // @query('webwriter-timeline slot[name="event-slot"]') accessor tlslot: HTMLSlotElement;


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
    // const timeline = document.querySelector("webwriter-timeline") as WebWriterTimeline;
    const tldialog = timeline?.shadowRoot?.querySelector("timeline-dialog") as TimelineDialog;

    if (!event.detail) {
      console.error("Event detail not received");
      return;
    }
    
    if (!timeline || !tldialog) {
      console.error("Cannot find timeline or dialog");
      return;  
    }

    const { title: title, startDate: startDate, endDate: endDate } = event.detail;
    const [startYear, startMonth, startDay] = startDate.split("-");
    const [endYear, endMonth, endDay] = endDate ? endDate.split("-") : [undefined, undefined, undefined];

    const startMonthName = startMonth ? this.dateManager.getMonthName(startMonth) : "";
    const endMonthName = endMonth ? this.dateManager.getMonthName(endMonth) : "";

    const displayStartDate = this.dateManager.formatDisplayDate(startYear, startMonth, startDay, startMonthName);
    const displayEndDate = endDate ? this.dateManager.formatDisplayDate(endYear, endMonth, endDay, endMonthName) : "";

    // TO DO: why cant I use the constructor ??
    // const timeline_event = new EventContainer({
    //   title: title,
    //   startDate: displayStartDate,
    //   endDate: displayEndDate
    // });
    const timeline_event = new EventContainer();
    timeline_event.setConstructorAttributes({
        title: title,
        startDate: displayStartDate,
        endDate: displayEndDate
    });
    timeline_event.setAttribute("event_title", title);
    timeline_event.setAttribute("event_startDate", displayStartDate);
    timeline_event.setAttribute("event_endDate", displayEndDate);
    timeline_event.setAttribute("slot", "event-slot");

    timeline.appendChild(timeline_event);

    // this.dispatchEvent(new CustomEvent("request-appendEvent", {
    //   detail: timeline_event,
    //   bubbles: true,
    //   composed: true
    // }));

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
