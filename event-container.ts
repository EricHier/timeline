import { LitElement, html, PropertyValues, css } from "lit";
import { LitElementWw } from "@webwriter/lit";
import { customElement, property, query } from "lit/decorators.js";
import IconTextPlus from "@tabler/icons/outline/text-plus.svg";
import IconBook from "@tabler/icons/outline/book.svg";
import IconTrash from "@tabler/icons/outline/trash.svg";
import "@shoelace-style/shoelace/dist/themes/light.css";
import { SlButton, SlDetails, SlIcon } from "@shoelace-style/shoelace";
import { TlEventData } from "./tl-event-data";

@customElement("event-container")
export class EventContainer extends LitElementWw {

  @property({ type: String }) event_title;
  @property({ type: String }) event_startDate;
  @property({ type: String }) event_endDate;
  // @property({ type: Number, attribute: true, reflect: true })

  @query("#event_elements") accessor event_element;

  accessor tabIndex = -1;

  constructor() {
    super();
   
    // if(!eventData){
    //   console.warn("Event data is undefined");
    // }

  }
  
  static get styles() {
    return css`  
      .line { 
        height: 1px;
        width: 150px;     //to do: shouldnt have a fixed size but should be same length as date + padding left and right 5px;
        background: #484848;
        display: flex;
        justify-content: space-between;
        align-items: center;
        grid-column: 1;
        grid-row: 2;
      }

      .line::before {
        content: "\ ";
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #484848;
      }

      //to do: align date to the middle of the line
      .date-container{
        display: grid;
        align-items: center;

      }
      .event-container {
        display: flex;
        /* justify-content: space-between; */
        align-items: center;
        padding: 16px ;
        position: relative;
      }

      .event-date {
        font-size: 14px;
        font-weight: 700;
        color: #484848;
        margin-right: 16px;
        grid-column: 1;
        grid-row: 1;
      }

      .event-content {
        border: 3px solid #E0E0E0;
        border-radius: 5px;
        flex-grow: 1;
        display: flex; 
        align-items: center;
        justify-content: space-between;
      }

      .event-title {
        font-size: 16px;
        font-weight: 500;
        padding: 5px; 
        text-align: center;  
        color:  #484848;
      }
      //to do: is still showing the details arrow and label
      details summary {
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
    // this.addParagraph();
    // console.log('First update completed. Current properties:', this.event_title, this.event_startDate, this.event_endDate);
  }
  

  render() {
    return html`
      <div class="event-container">
        <div class="date-container">
          <div class="event-date">${this.event_startDate} ${this.event_endDate ? `- ${this.event_endDate}` : ''}</div>
          <div class="line"></div>
        </div>
        
        <div class="event-content">
          <div class="event-title">${this.event_title}</div>
          <sl-icon color=" text-red" src=${IconBook}  @click=${this.showEventContent} slot="prefix"></sl-icon>
          <div class="event-element" id="event_elements" hidden>
            <slot></slot>
              <sl-button variant="primary" outline @click="${this.addParagraph}">
                <sl-icon src=${IconTextPlus} slot="prefix"></sl-icon>
              </sl-button>
              <sl-button variant="danger" outline @click="${this.removeEvent}">
                <sl-icon src=${IconTrash} slot="prefix"></sl-icon>
              </sl-button>
          </div>
        </div>
      </div>
    `;
  }

  showEventContent(){
    if(this.event_element.hidden){
      this.event_element.hidden = false; 
    } else {
      this.event_element.hidden = true; 
    }
  }

  setConstructorAttributes(eventData: TlEventData){
    this.event_title = eventData.title;
    this.event_startDate = eventData.startDate;
    this.event_endDate = eventData.endDate;
    // console.log(`Initialized with title: ${this.event_title}, startDate: ${this.event_startDate}, endDate: ${this.event_endDate}`);
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
