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

@property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;

constructor(title: string, description: string, startDate: string, endDate: string = "") {
        super();
        // this.event_id = id;
        this.event_title = title;
        this.event_description = description;
        this.event_startDate = startDate; 
        this.event_endDate = endDate;

        // this.setAttribute("event_title", title);
        // this.setAttribute("event_description", description);
        // this.setAttribute("event_startDate", startDate);
        // this.setAttribute("event_endDate", endDate);
}

static get styles() {
  return css`
  
  .border {
      border: 1px solid lightgray;
      width: 99%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 5px;
      
  }
  
  .page {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    height: 50%;
    background-color: white;
    border: grey;
    padding-left: 5px;

  }
`}

static get scopedElements() {
  return {  
    "sl-details": SlDetails,
  };
}

// add properties to slot, each in a <p>
protected firstUpdated(_changedProperties: PropertyValues): void {

  // const parStartDate = document.createElement("p");
  // parStartDate.textContent = this.event_startDate;
  // parStartDate.setAttribute("slot","eventSlot");
  // this.appendChild(parStartDate);

  // if(this.event_endDate !== ""){
  //   const parEndDate = document.createElement("p");
  //   parEndDate.textContent = this.event_endDate;
  //   parEndDate.setAttribute("slot","eventSlot");
  //   this.appendChild(parEndDate);
  // }

  // const parTitle = document.createElement("p");
  // parTitle.textContent = this.event_title;
  // parTitle.setAttribute("slot","eventSlot");
  // this.appendChild(parTitle);

  const parDescription = document.createElement("p");
  parDescription.textContent = this.event_description;
  // parDescription.setAttribute("slot","slot");
  this.appendChild(parDescription);
  
}

  render() {
    return html`
      <div class="border">
        <sl-details summary=${"Timeline Event: " + this.event_title + " Date: " + this.event_startDate + "-" + this.event_endDate}>
          <slot class="page"></slot>
        </sl-details>       
      </div>
    `;
  }  

}