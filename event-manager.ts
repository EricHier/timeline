import {LitElement, html, PropertyValues, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property} from "lit/decorators.js"

import "@shoelace-style/shoelace/dist/themes/light.css";

import { EventContainer } from "./event-container";
import { DialogInput } from "./dialog-elements/d-input";
import{ TimelineDialog} from "./tl-dialog";
import { WebWriterTimeline } from "./widgets/webwriter-timeline";
import { DialogDatePicker } from "./dialog-elements/d-datepicker";
import { DatetManager } from "./date-manager";
import { TlEvent } from "./tl-event";

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
      "date-manager": DatetManager,
    };
  }

  private dateManager = new DatetManager();

  render() {
    return html`
    `;
  } 

  // adding event to webwriter-timeline slot by creating event-container, 
  addEvent(event){
    const timeline = document.querySelector("webwriter-timeline") as WebWriterTimeline;
    const tldialog = timeline.shadowRoot.querySelector("timeline-dialog") as TimelineDialog;
    const tlslot =  timeline.shadowRoot.querySelector('slot[name="event-slot"]');

    const { title, startDay, startMonth, startYear, endDay, endMonth, endYear } = event.detail;

    let startDate = `${startYear}${startMonth ? `-${startMonth}` : ''}${startDay ? `-${startDay}` : ''}`;
    let endDate = "";
    let endMonthName = "";
    let startYearName = startYear;
    let endYearName = endYear;

    // if end date exists: look for end month name, parse to output string + check if end year is negative, if so change to BCE
    if (endYear){
      endDate = `${endYear ? `${endYear}` : ''}${endMonth ? `-${endMonth}` : ''}${endDay ? `-${endDay}` : ''}`;
      endMonthName = this.dateManager.getMonthName(endMonth);

      if (endYear.includes('-')) {
          endYearName = endYear.replace('-', '');
          endYearName = endYearName.padStart(4, '0') + ' BCE';
        }
      endDate= `${endDay ? `${endDay}. ` : ''}${endMonth ? `${endMonthName}. ` : ''}${endYearName}`;
    }   
   
    const startMonthName = this.dateManager.getMonthName(startMonth);

    if(startYear.includes('-')) {
      startYearName = startYear.replace('-', '');
      startYearName = startYearName.padStart(4, '0') + ' BCE';
    }

    startDate = `${startDay ? `${startDay}. ` : ''}${startMonth ? `${startMonthName}. ` : ''} ${startYearName}`;
    
    const timeline_event = new EventContainer(title, startDay, startMonth, startYear, startDate, endDay, endMonth, endYear, endDate);
      
    // needed because webwriter slot initialization, set input values to event container values
    timeline_event.setAttribute("event_title", title);

    timeline_event.setAttribute("event_startDay", startDay);
    timeline_event.setAttribute("event_startMonth", startMonth);
    timeline_event.setAttribute("event_startYear", startYear);
    timeline_event.setAttribute("event_startDate", startDate);

    timeline_event.setAttribute("event_endDay", endDay);
    timeline_event.setAttribute("event_endMonth", endMonth);
    timeline_event.setAttribute("event_endYear", endYear);
    timeline_event.setAttribute("event_endDate", endDate);

    timeline_event.setAttribute("slot", "event-slot");
  
    timeline.appendChild(timeline_event);

    this.dateManager.sortEvents();

    tldialog.hideDialog();
    }
  
  // dispatch remove request of event to timeline 
  removeEvent(event){ 
    const eventToRemove = event.detail.id; 
    // console.log("Delete request delivered: "+ eventToRemove);
    const timeline = document.querySelector("webwriter-timeline") as WebWriterTimeline;
    const tlslot =  timeline.shadowRoot.querySelector('slot[name="event-slot"]');
    const eventContainer = timeline.querySelector(`event-container[id="${eventToRemove}"]`);

    if (eventContainer) {
      timeline.removeChild(eventContainer);
    }
  }
}
