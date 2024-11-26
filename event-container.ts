import {LitElement, html, PropertyValues, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property} from "lit/decorators.js"
import IconTextPlus from "@tabler/icons/outline/text-plus.svg";
import IconTrash from "@tabler/icons/outline/trash.svg";
import "@shoelace-style/shoelace/dist/themes/light.css";
import {
  SlButton,
  SlDetails,
  SlIcon
} from "@shoelace-style/shoelace";



@customElement("event-container")
export class EventContainer extends LitElementWw {

@property({type: String, attribute: true, reflect: true }) accessor event_id : string;
@property({type: String, attribute: true, reflect: true }) accessor event_title : string;
@property({type: String, attribute: true, reflect: true }) accessor event_description : string;

@property({type: String, attribute: true, reflect: true }) accessor event_startDay  : string;
@property({type: String, attribute: true, reflect: true }) accessor event_startMonth : string;
@property({type: String, attribute: true, reflect: true }) accessor event_startYear : string;
@property({type: String, attribute: true, reflect: true }) accessor event_startDate  : string;

@property({type: String, attribute: true, reflect: true }) accessor event_endDay  : string;
@property({type: String, attribute: true, reflect: true }) accessor event_endMonth : string;
@property({type: String, attribute: true, reflect: true }) accessor event_endYear : string;
@property({type: String, attribute: true, reflect: true }) accessor event_endDate  : string;

@property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;

constructor(
  title: string, 
  startDay: string,
  startMonth: string, 
  startYear: string, 
  startDate: string, 
  endDay: string = "", 
  endMonth: string = "", 
  endYear: string = "",
  endDate: string = "") {
    super();
    this.event_title = title;
    this.event_startDay = startDay; 
    this.event_startMonth = startMonth; 
    this.event_startYear = startYear; 
    this.event_startDate = startDate; 

    this.event_endDay = endDay; 
    this.event_endMonth = endMonth; 
    this.event_endYear = endYear; 
    this.event_endDate = endDate; 
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
  .position{
    margin-left: 10px;
  }
  :host(:not([contenteditable=true]):not([contenteditable=""])) .author-only {
        display: none;
  }
`}

static get scopedElements() {
  return {  
    "sl-details": SlDetails,
    "sl-button":SlButton,
    "sl-icon":SlIcon,
  };
}
// will run again in student view, TO DO: use other way to append new paragraph
protected firstUpdated(_changedProperties: PropertyValues): void {
  this.addParagraph();
 }

  render() {
    return html`
      <div class="position">
        <sl-details>
          <span slot="summary">
            <span class="title-style">${this.event_title}</span>
            <span class="date-style">${this.event_startDate}${this.event_endDate != "" ? "–" + this.event_endDate : ""}</span>
          </span>
            <slot>
              <!-- <p> <i>Click on button to add event content</i></p> -->
            </slot>
           
            <!-- <div class="author-only"> -->
              <sl-button variant="primary" outline @click="${this.addParagraph}">
                <sl-icon src=${IconTextPlus} slot="prefix"></sl-icon></sl-button>
              <sl-button variant="danger" outline @click="${this.removeEvent}">
                <sl-icon src=${IconTrash} slot="prefix"></sl-icon></sl-button>
              </sl-button>
            <!-- </div> -->
        </sl-details>  
      </div>
    `;
  } 
  
  // on button press a paragraph with "add description" is added to slot
  addParagraph(){
    const parDescription = document.createElement("p");
    parDescription.textContent = "Modify event content";
    this.appendChild(parDescription);  
  }

  // on button press event will be removed form slot
  removeEvent() {
    this.dispatchEvent(new CustomEvent("request-remove", {
      detail: { id: this.id },
      bubbles: true,  
      composed: true
    }));
    // console.log("Delete request started: " + this.id);
  }


  // convert string into date for sorting dates 
  getStartDate(): Date {
    let startDate = `${this.event_startYear}${this.event_startMonth ? `-${this.event_startMonth}` : ''}${this.event_startDay ? `-${this.event_startDay}` : ''}`;
    var d = new Date( Date.parse(startDate));
    // console.log(" start date is : ", d);
    return d; 
  }
}