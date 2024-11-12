import {LitElement, html, PropertyValues, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property} from "lit/decorators.js"

import "@shoelace-style/shoelace/dist/themes/light.css";
import {
  SlDetails,
} from "@shoelace-style/shoelace";



@customElement("event-container")
export class EventContainer extends LitElementWw {

@property({type: String, attribute: true, reflect: true }) accessor event_id : string;
@property({type: String, attribute: true, reflect: true }) accessor event_title : string;
@property({type: String, attribute: true, reflect: true }) accessor event_description : string;

@property({type: String, attribute: true, reflect: true }) accessor event_startDate : string;
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
`}

static get scopedElements() {
  return {  
    "sl-details": SlDetails,
  };
}

protected firstUpdated(_changedProperties: PropertyValues): void {
  this.addParagraph();
}

  render() {
    return html`
      <div class="position">
        <sl-details>
          <span slot="summary">
            <span class="title-style">${this.event_title}</span>
            <span class="date-style">${this.event_startDate}${this.event_endDate == undefined ? '-' + this.event_endDate : ''}</span>
          </span>
          <slot></slot>
          <sl-button @click="${this.addParagraph}">Add paragraph</sl-button>
          <sl-button  @click="${this.removeEvent}">Remove</sl-button>
        </sl-details>  
      </div>
    `;
  } 
  
  addParagraph(){
    const parDescription = document.createElement("p");
    parDescription.textContent = "Add a description";
    this.appendChild(parDescription);  
  }


  removeEvent() {
    this.dispatchEvent(new CustomEvent('request-remove', {
      detail: { title: this.event_title },
      bubbles: true,  
      composed: true
    }));
    console.log("Delete request started: " + this.event_title);
  }
}