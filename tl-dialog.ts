import {LitElement, html, PropertyValues, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property} from "lit/decorators.js"

import "@shoelace-style/shoelace/dist/themes/light.css";
import {
  SlButton,
  SlCheckbox,
  SlDialog,
} from "@shoelace-style/shoelace";

import { TimelineInput } from "./tl-input";

@customElement("timeline-dialog")
export class TimelineDialog extends LitElementWw {

  @property({ type: String }) accessor label = "";
  @property({ type: String }) accessor id = "";
  @property({ type: String }) accessor value = "";
  @property({ type: String }) accessor placeholder = "";
  @property({ type: Boolean, reflect: true }) accessor required = false;
  @property({ type: String }) accessor type: "input" | "textarea";
  @property({ type: Boolean }) accessor readToFill;



  static styles = css`
   
   sl-dialog::part(base) {
    position: absolute;
    height: 700px;
  }

  sl-dialog::part(overlay) {
    position: absolute;
  }
  `;

  static get scopedElements() {
    return {      
      "timeline-input": TimelineInput,

      "sl-button": SlButton,
      "sl-checkbox": SlCheckbox,
      "sl-dialog": SlDialog,
    };
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
  }


  render() {
        return html`
          <sl-dialog class="dialog-width" label="Add a Timline Event" style="--width: 50vw;">

                <timeline-input type="input" label="Title" id="eventTitle" @sl-change=${this.checkActivation} placeholder="Enter the title"> </timeline-input>
                
                <timeline-input  type="textarea" label="Description" id="eventDescription" @sl-change=${this.checkActivation} placeholder="Enter the description"> </timeline-input>
                
                <timeline-input label="Start date" id="eventStartDate" placeholder="Enter the date"> </timeline-input>

                <timeline-input label="End date" id="eventEndDate" placeholder="Enter the date" > </timeline-input>             

              <br />
              <sl-checkbox id="time-period">Add End Date</sl-checkbox>
  
              <sl-button id="savingButton" slot="footer" variant="primary" ?disabled="${!this.readToFill}">Save</sl-button>
              <sl-button id="closingButton" slot="footer" variant="primary" @click="${this.hideDialog}">Close</sl-button>

          </sl-dialog>


         
        `;
      } 

      

  // show dialog to enter input
  showDialog() {
    const dialog = this.shadowRoot?.querySelector(".dialog-width") as SlDialog;
    this.resetDialog();
    console.log("reset before show");
    dialog.show();
  }

  //hide dialog after saving or closing, call resetDialog()
  hideDialog() {
    const dialog = this.shadowRoot?.querySelector(".dialog-width") as SlDialog;
    
    dialog.hide();

    // dialog.addEventListener("sl-after-hide", () => {
    // this.resetDialog();
    // });
  }

  //reset input values 
  resetDialog(){
    const input = this.shadowRoot?.querySelectorAll("timeline-input");

    input.forEach((input: TimelineInput) => {
      input.value = ""; 
    });
  }


  // check for correct input
  checkInput(){
    const dialog = this.shadowRoot?.querySelector(".dialog-width");
    console.log("input checking");
  }

  checkActivation() {
    const input_title = this.shadowRoot?.getElementById("eventTitle") as TimelineInput;
    const input_description = this.shadowRoot?.getElementById("eventDescription") as TimelineInput;

    if (input_title.value !== "" && input_description.value !== "") {
      this.readToFill = true;
    } else {
      this.readToFill = false;
    }
  }

}
