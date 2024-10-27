import {LitElement, html, PropertyValues, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property} from "lit/decorators.js"

import "@shoelace-style/shoelace/dist/themes/light.css";
import {
} from "@shoelace-style/shoelace";



@customElement("event-container")
export class EventContainer extends LitElementWw {

@property({type: String, attribute: true, reflect: true }) accessor event_title : string = 'Title';
@property({type: String, attribute: true, reflect: true }) accessor event_description : string = 'Description';
@property({type: String, attribute: true, reflect: true }) accessor event_date : string = 'Date';

@property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;




static get styles() {
  return css`
  
  .border {
      border: 1px solid lightgray;
      width: 100%;
      min-height: xxpx;
      display: flex;
      align-items: center;
      justify-content: center;
  }
  
  .page {
    display: flex;
    flex-direction: column;
    gap: 10px; 
    padding: 10px;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }
`}

protected firstUpdated(_changedProperties: PropertyValues): void {

  // console.log("First updated called");
  // debugger; 
  
  // const parTitle = document.createElement("p");
  // parTitle.textContent = this.event_title;
  // this.shadowRoot.querySelector("slot").appendChild(parTitle);
  // debugger; 
  
  // const parDescription = document.createElement("p");
  // parDescription.textContent = this.event_description;
  // this.shadowRoot.querySelector("slot").appendChild(parDescription);
  
  // console.log("First updated complete");

}

  render() {
    return html`
      <div class="border">
        <p class ="page">${this.event_title}</p> <br />
        <p class ="page">${this.event_description}</p>
      </div>
    `;
  }
}