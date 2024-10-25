import {LitElement, html, PropertyValues, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property} from "lit/decorators.js"

import "@shoelace-style/shoelace/dist/themes/light.css";
import {
  SlOption,
  SlSelect,
  SlButton,
  SlRange,
  SlCheckbox,
  SlInput,
  SlColorPicker,
  SlDivider,
  SlButtonGroup,
  SlIcon,
} from "@shoelace-style/shoelace";



@customElement("event-container")
export class EventContainer extends LitElementWw {

@property({type: String, attribute: true, reflect: true }) accessor event_title : string = 'Title';
@property({type: String, attribute: true, reflect: true }) accessor event_description : string = 'Description';
@property({type: String, attribute: true, reflect: true }) accessor event_date : string = 'Date';


@property({ type: Number, attribute: true, reflect: true })
accessor tabIndex = -1;

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
    const parTitle = document.createElement("p");
    parTitle.textContent = this.event_title;
    this.appendChild(parTitle)

    const parDescription = document.createElement("p");
    parDescription.textContent = this.event_description;
    this.appendChild(parDescription)

    const parDate = document.createElement("p");
    parDate.textContent = this.event_date;
    this.appendChild(parDate)
}



  render() {
    return html`
      <div class="border">
        <slot class = "page"> 
        </slot>
      </div>
    `;
  }
}