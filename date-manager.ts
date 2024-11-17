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

  sortEvents(){
    debugger;
    const timeline = document.querySelector("webwriter-timeline") as WebWriterTimeline;
    // const slot = timeline.shadowRoot.querySelector('slot[name="event-slot"]');   
    console.log("sorting");

    // [...slot.children] use if events are appended inside slot
  //     .sort((a: EventContainer, b:EventContainer) => {return a.getStartDate() > b.getStartDate() ? 1 : -1})
  //     .forEach(node => slot.appendChild(node));
  //     console.log("sorted succesfully");
    // }
    [...timeline.children]
      .sort((a: EventContainer, b:EventContainer) => {return a.getStartDate() > b.getStartDate() ? 1 : -1})
      .forEach(node => timeline.appendChild(node));
      console.log("sorted succesfully");
    }

  getMonthName(month: string): string {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthIndex = typeof month === 'string' ? parseInt(month, 10) - 1 : month - 1;
    return months[monthIndex] || month;
  }
}
