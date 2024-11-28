import { LitElement, html, PropertyValues, css } from "lit";
import { LitElementWw } from "@webwriter/lit";
import { customElement, property } from "lit/decorators.js";
import IconTextPlus from "@tabler/icons/outline/text-plus.svg";
import IconTrash from "@tabler/icons/outline/trash.svg";
import "@shoelace-style/shoelace/dist/themes/light.css";
import { SlButton, SlDetails, SlIcon } from "@shoelace-style/shoelace";
import { TlEventData } from "./tl-event-data";

@customElement("event-container")
export class EventContainer extends LitElementWw {

  @property({ type: String }) event_title = '1';
  @property({ type: String }) event_startDate = '2';
  @property({ type: String }) event_endDate = '3';
  @property({ type: Number, attribute: true, reflect: true })
  accessor tabIndex = -1;

  constructor(eventData?: TlEventData) {
    super();
    
    if (eventData) {
      this.event_title = eventData.title;
      this.event_startDate = eventData.startDate;
      this.event_endDate = eventData.endDate;
    }
    // if(!eventData){
    //   console.warn("Event data is undefined");
    // }
    
    console.log(`Initialized with title: ${this.event_title}, startDate: ${this.event_startDate}, endDate: ${this.event_endDate}`);
  }

  static create(eventData: TlEventData): EventContainer {
    return new EventContainer(eventData);
  }
  
  static get styles() {
    return css`
      .title-style {
        font-weight: bold;
        color: #333;
      }

      .date-style {
        color: #666;
      }
      .position {
        margin-left: 10px;
      }
      :host(:not([contenteditable="true"]):not([contenteditable=""]))
        .author-only {
        display: none;
      }
    `;
  }

  static get scopedElements() {
    return {
      "sl-details": SlDetails,
      "sl-button": SlButton,
      "sl-icon": SlIcon,
    };
  }
  // will run again in student view, TO DO: use other way to append new paragraph
  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.addParagraph();
    console.log('First update completed. Current properties:', this.event_title, this.event_startDate, this.event_endDate);
  }
  

  render() {
    return html`
        <div class="position">
      <sl-details>
        <span slot="summary">
          <span class="title-style">${this.event_title || 'Untitled Event'}</span>
          <span class="date-style">${this.event_startDate || 'No Start Date'}${this.event_endDate ? ` – ${this.event_endDate}` : ""}</span>
        </span>
        <slot></slot>
        <sl-button variant="primary" outline @click="${this.addParagraph}">
          <sl-icon src=${IconTextPlus} slot="prefix"></sl-icon>
        </sl-button>
        <sl-button variant="danger" outline @click="${this.removeEvent}">
          <sl-icon src=${IconTrash} slot="prefix"></sl-icon>
        </sl-button>
      </sl-details>  
    </div>
    `;
  }

  // on button press a paragraph with "add description" is added to slot
  addParagraph() {
    const parDescription = document.createElement("p");
    parDescription.textContent = "Modify event content";
    this.appendChild(parDescription);
  }

  // on button press event will be removed form slot
  removeEvent() {
    this.dispatchEvent(
      new CustomEvent("request-remove", {
        detail: { id: this.id },
        bubbles: true,
        composed: true,
      })
    );
    // console.log("Delete request started: " + this.id);
  }

  // convert string into date for sorting dates
  getStartDate(): Date {
    const parts:  String[] = this.event_startDate.split(". ", -1);
    const spaceCount: Number = parts.length - 1;
    let startDay, startMonth, startYear = "";
    if(spaceCount===0){
      startDay = "";
      startMonth = "";
      startYear = this.event_startDate;
    } else if( spaceCount === 1){
      startDay = "";
      [startMonth, startYear] = this.event_startDate.split(". ");
    } else if ( spaceCount === 2 ){
      [startDay, startMonth, startYear] = this.event_startDate.split(". ");
    }

    let sortStartDate = `${startYear}${
      startMonth ? `-${startMonth}` : ""
    }${startDay ? `-${startDay}` : ""}`;
    var d = new Date(Date.parse(sortStartDate));
    console.log(" start date is : ", d, " the parsed date is: ", sortStartDate);
    return d;
  }
}
