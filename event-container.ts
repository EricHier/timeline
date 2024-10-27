import {LitElement, html, PropertyValues, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property} from "lit/decorators.js"

import "@shoelace-style/shoelace/dist/themes/light.css";
import {
} from "@shoelace-style/shoelace";



@customElement("event-container")
export class EventContainer extends LitElementWw {

@property({type: String, attribute: true, reflect: true }) accessor event_title : string;
@property({type: String, attribute: true, reflect: true }) accessor event_description : string;

@property({type: String, attribute: true, reflect: true }) accessor event_startDate : string;
@property({type: String, attribute: true, reflect: true }) accessor event_endDate : string;

@property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;




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
    padding: 5px;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }
`}

// add properties to slot, each in a <p>
protected firstUpdated(_changedProperties: PropertyValues): void {
  const parTitle = document.createElement("p");
  parTitle.textContent = this.event_title;
  this.shadowRoot.querySelector('slot[name="eventSlot"]').appendChild(parTitle);

  const parDescription = document.createElement("p");
  parDescription.textContent = this.event_description;
  this.shadowRoot.querySelector('slot[name="eventSlot"]').appendChild(parDescription);

  const parStartDate = document.createElement("p");
  parStartDate.textContent = this.event_startDate;
  this.shadowRoot.querySelector('slot[name="eventSlot"]').appendChild(parStartDate);

  if(this.event_endDate !== undefined){
    const parEndDate = document.createElement("p");
    parEndDate.textContent = this.event_endDate;
    this.shadowRoot.querySelector('slot[name="eventSlot"]').appendChild(parEndDate);
  }
}

  render() {
    return html`
      <div class="border">
        <slot class="page" name="eventSlot"></slot>
      </div>
    `;
  }  

}