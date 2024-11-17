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

// @property({type: String, attribute: true, reflect: true }) accessor event_startDay  : string;
// @property({type: String, attribute: true, reflect: true }) accessor event_startMonth : string;
// @property({type: String, attribute: true, reflect: true }) accessor event_startYear : string;

@property({type: String, attribute: true, reflect: true }) accessor event_startDate : string;
@property({type: String, attribute: true, reflect: true }) accessor event_sort_startDate : string;

@property({type: String, attribute: true, reflect: true }) accessor event_endDate : string;
// @property({
//   hasChanged(newVal:string, oldVal: string){
//     console.log("End date has changed, new val: ", newVal, " , old val: ", oldVal);
//     // method to check for valid date and hasChanged inside and dispatch custom event (for start date)
//     return true; //hasChanged
//   },
//   type: String, attribute: true, reflect: true }) 
//   accessor event_startDate : string = "";


@property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;

constructor(title: string, description: string, startDate: string, endDate: string = "") {
  super();
  this.event_title = title;
  this.event_description = description;
  this.event_startDate = startDate; 
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
// will run again in student view so do not use it 
protected firstUpdated(_changedProperties: PropertyValues): void {
  // this.addParagraph();
  // console.log("first updated");
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
              <p> <i>Click on button to add event content</i></p>
            </slot>
           
            <div class="author-only">
              <sl-button variant="primary" outline @click="${this.addParagraph}">
                <sl-icon src=${IconTextPlus} slot="prefix"></sl-icon></sl-button>
              <sl-button variant="danger" outline @click="${this.removeEvent}">
                <sl-icon src=${IconTrash} slot="prefix"></sl-icon></sl-button>
              </sl-button>
            </div>
        </sl-details>  
      </div>
    `;
  } 
  
  // on button press a paragraoh with "add description" is added to slot
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
    console.log("Delete request started: " + this.id);
  }

  getStartDate(): Date {
    debugger; 
    const startDateElements = this.event_startDate.split(".", 3); // either: 01. 01. 2000 OR 01. 2000 OR 2000
    console.log("Get start date: ", startDateElements);
    let startDateOrder ="";
    if(startDateElements.length == 3){
      startDateOrder = startDateElements[2].trim() + "-" +startDateElements[1].trim() + "-" + startDateElements[0].trim();
      // d = new Date(parseInt(startDateElements[2]), parseInt(startDateElements[1])-1, parseInt(startDateElements[0])); //01. 01. 2000
      // console.log()
    } else if (startDateElements.length == 2){
      startDateOrder = startDateElements[1].trim() + "-" + startDateElements[0].trim();
      // d = new Date(parseInt(startDateElements[1]), parseInt(startDateElements[0])-1, parseInt("01")); // 01. 2000
    } else{
      startDateOrder =  startDateElements[0].trim();
      // d = new Date(parseInt(startDateElements[0]), parseInt("0"), parseInt("01")); // 2000
    } 
    var d = new Date( Date.parse(startDateOrder));
    console.log(" start date is : ", d, "Start date order is: ", startDateOrder);
    return d; 

  }

}