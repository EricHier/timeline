import {LitElement, html, PropertyValues, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property} from "lit/decorators.js"

import "@shoelace-style/shoelace/dist/themes/light.css";

import { EventContainer } from "./event-container";
import { DialogInput } from "./dialog-elements/d-input";
import{ TimelineDialog} from "./tl-dialog";
import { WebWriterTimeline } from "./widgets/webwriter-timeline";
import { DialogDatePicker } from "./dialog-elements/d-datepicker";

@customElement("date-manager")

export class DateManager extends LitElementWw {  
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


  private tlDialog = new TimelineDialog();


  protected firstUpdated(_changedProperties: PropertyValues): void {
  }

  render() {
    return html`
    `;
  } 

  // creates array of timeline children elements (events) and sorts them via start date, re-append after
  sortEvents(timeline){
    // const timeline = document.querySelector("webwriter-timeline") as WebWriterTimeline;
    // console.log("sorting");
    [...timeline.children]
      .sort((a: EventContainer, b:EventContainer) => {return a.getStartDate() > b.getStartDate() ? 1 : -1})
      .forEach(node => timeline.appendChild(node));
      // console.log("sorted succesfully");
  }

  // get name of the month 
  getMonthName(month: string): string {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthIndex = typeof month === 'string' ? parseInt(month, 10) - 1 : month - 1;
    return monthNames[monthIndex] || month;
  }

  formatDate(year: string, month: string, day: string): string {
    return `${year}${month ? `-${month}` : ""}${day ? `-${day}` : ""}`;
  }

 formatDisplayDate(year: string, month: string, day: string, monthName: string): string {
    let yearName = year;
    if (year.includes("-")) {
        yearName = year.replace("-", "").padStart(4, "0") + " BCE";
    }
    return `${day ? `${day}. ` : ""}${month ? `${monthName}. ` : ""}${yearName}`;
  }
}
