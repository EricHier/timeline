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

export class DatetManager extends LitElementWw {  
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

  protected firstUpdated(_changedProperties: PropertyValues): void {
  }

  render() {
    return html`
    `;
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

  // getMonthName() {
  //   const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  //   return months[parseInt() - 1] || this.month;
  // }

  validateDate(){

  }

  checkLeapYear(){

  }
}
