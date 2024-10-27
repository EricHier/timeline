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
import { EventManager } from "./event-manager";
import { EventContainer } from "./event-container";
import { WebWriterTimeline } from "./widgets/webwriter-timeline";
 
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
      "event-container": EventContainer,
      "event-manager": EventManager,

      "sl-button": SlButton,
      "sl-checkbox": SlCheckbox,
      "sl-dialog": SlDialog,
    };
  }

  private eventManager = new EventManager();


  protected firstUpdated(_changedProperties: PropertyValues): void {
  }


  render() {
        return html`
          <sl-dialog id="timelineID" class="dialog-width" label="Add a Timline Event" style="--width: 50vw;">

                <timeline-input type="input" label="Title" id="eventTitle" @sl-change=${this.enableSaveButton} placeholder="Enter the title"> </timeline-input>
                
                <timeline-input  type="textarea" label="Description" id="eventDescription" @sl-change=${this.enableSaveButton} placeholder="Enter the description"> </timeline-input>
                
                <timeline-input label="Start date" id="eventStartDate" placeholder="Enter the date"> </timeline-input>

                <timeline-input label="End date" id="eventEndDate" placeholder="Enter the date" > </timeline-input>             

              <br />
              <sl-checkbox id="time-period">Add End Date</sl-checkbox>
  
              <sl-button id="savingButton" slot="footer" variant="primary" ?disabled="${!this.readToFill}" @click="${this.eventManager.addEvent}">Save</sl-button>
              <sl-button id="closingButton" slot="footer" variant="primary" @click="${this.hideDialog}">Close</sl-button>

          </sl-dialog>


         
        `;
      } 

      
  // show dialog to enter input
  public showDialog() {
    const dialog = this.shadowRoot?.querySelector(".dialog-width") as SlDialog;
    this.resetDialog();
    dialog.show();
  }

  //hide dialog after saving or closing, call resetDialog()
  public hideDialog() {
    const dialog = this.shadowRoot?.querySelector(".dialog-width") as SlDialog;
    dialog.hide();
  }

  //reset input values 
  resetDialog(){
    const input = this.shadowRoot?.querySelectorAll("timeline-input");

    input.forEach((input: TimelineInput) => {
      input.value = ""; 
    });
  }

  //check if input values are empty, if not readToFill = true and #saveButton not disabled
  enableSaveButton(){
    const input_title = this.shadowRoot?.getElementById("eventTitle") as TimelineInput;
    const input_description = this.shadowRoot?.getElementById("eventDescription") as TimelineInput;

    if (input_title.value !== "" && input_description.value !== "") {
      this.readToFill = true;
    } else {
      this.readToFill = false;
    }
  }


}
