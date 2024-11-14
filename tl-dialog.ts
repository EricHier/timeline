import {LitElement, html, PropertyValues, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property} from "lit/decorators.js"

import "@shoelace-style/shoelace/dist/themes/light.css";
import {
  SlButton,
  SlCheckbox,
  SlDialog,
  SlSwitch,
  SlInput,
  SlAlert,
  SlIcon,
} from "@shoelace-style/shoelace";

import { DialogInput } from "./dialog-elements/d-input";
import { EventManager } from "./event-manager";
import { EventContainer } from "./event-container";
import { WebWriterTimeline } from "./widgets/webwriter-timeline";
import { DialogToggle } from "./dialog-elements/d-toggle";
import {DialogDatePicker } from "./dialog-elements/d-datepicker";

@customElement("timeline-dialog")
export class TimelineDialog extends LitElementWw {

  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;
  @property({ type: String }) accessor label = "";
  @property({ type: String }) accessor id = "";
  @property({ type: String }) accessor value = "";
  @property({ type: String }) accessor placeholder = "";
  @property({ type: Boolean, reflect: true }) accessor required = false;
  @property({ type: String }) accessor type: "input" | "textarea";
  @property({ type: Boolean }) accessor readToFill = false;
  @property({ type: Boolean }) accessor useTimePeriod = false;

  static styles = css` 

      sl-dialog::part(base) {
        position: absolute;
        height: 700px;
      }

      sl-dialog::part(overlay) {
        position: absolute;
      }

      .dialog-width{
        width: 100%,
      }

      .timeline-input-container {
        display: grid;
        grid-template-columns: 1fr 1fr; 
        gap: 16px;
        width: 100%;
      }

      timeline-input {
        width: 100%;
        min-width: 0; 
      }
      custom-date-picker {
        width: 100%;
        min-width: 0; 
      }

      @media (max-width: 600px) {
        .inputs-container {
          grid-template-columns: 1fr; 
          gap: 8px;
        }
      }

      timeline-input[disabled] {
        --sl-input-label-color: #888888;
      }
      custom-date-picker[disabled] {
        --sl-input-label-color: #888888;
      }
      .endDate-disabled{
        color: grey;
      }
      
  `;


  static get scopedElements() {
    return {      
      "timeline-input": DialogInput,
      "timeline-toggle": DialogToggle,
      "event-container": EventContainer,
      "event-manager": EventManager,
      "custom-date-picker":DialogDatePicker,

      "sl-button": SlButton,
      "sl-checkbox": SlCheckbox,
      "sl-dialog": SlDialog,
      "sl-switch": SlSwitch,
      "sl-input": SlInput,
      "sl-alert": SlAlert, 
      "sl-icon": SlIcon,
    };

    
  }

  

  protected firstUpdated(_changedProperties: PropertyValues): void {}

  render() {
    return html`
      <sl-dialog id="timelineID" class="dialog-width" label="Add a Timeline Event" style="--width: 50vw;">
        <timeline-input type="input" label="Title" id="eventTitle" @sl-change=${this.enableSaveButton} placeholder="Enter the title" required> </timeline-input>
        <br />

        <div class="container">
          <timeline-toggle id="#time-period" .useTimePeriod="${this.useTimePeriod}" @toggle-change="${(e: CustomEvent) => {this.useTimePeriod = e.detail.useTimePeriod;}}"></timeline-toggle>
          <br />
          <div class="timeline-input-container">
            <custom-date-picker .useTimePeriod="${this.useTimePeriod}" label=${this.useTimePeriod ? "Start date" : "Date"} id="eventStartDate" @sl-change=${this.enableSaveButton}></custom-date-picker>
            <custom-date-picker .useTimePeriod="${this.useTimePeriod}" class="${!this.useTimePeriod ? 'endDate-disabled' : ''}" label="End Date" id="eventEndDate" endDate="true"></custom-date-picker>
          </div>
        </div>            

        <sl-button class="dialog-footer" id="resetButton" slot="footer" variant="default"  @click="${this.resetDialog}">Reset</sl-button>
        <sl-button id="savingButton" slot="footer" variant="primary"  ?disabled="${!this.readToFill}" @click="${() => this.addEvent()}">Add Event</sl-button>
        <!-- <div class="alert-toast">

          <sl-alert variant="danger" duration="3000" closable>
            <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
            <strong>Invalid Date</strong><br /> sth.
          </sl-alert>
        </div> -->
      </sl-dialog>  
    `;
  } 
      
  // show dialog to enter input
  public showDialog() {
    const dialog = this.shadowRoot?.querySelector(".dialog-width") as SlDialog;
    this.resetDialog();
    dialog.show();
  }

  //hide dialog after saving or closing
  public hideDialog() {
    const dialog = this.shadowRoot?.querySelector(".dialog-width") as SlDialog;
    dialog.hide();
  }

  //reset input values before showing new dialog
  resetDialog(){
    const inputs = this.shadowRoot?.querySelectorAll("timeline-input");
    const dates = this.shadowRoot?.querySelectorAll("custom-date-picker");

    this.useTimePeriod = false;

    // reset title ... and if used other input elements (adjust if only title will be used)
    inputs.forEach((input: DialogInput ) => {
      input.value = ""; 
    });

    // reset start and end dates
    dates.forEach((date: DialogDatePicker) => {
      date.reset(); 
    }); 
  }

  //check if input values are empty, if not readToFill = true and #saveButton not disabled
  enableSaveButton(){
    const input_title = this.shadowRoot?.getElementById("eventTitle") as DialogInput;
    const input_startDate = this.shadowRoot?.getElementById("eventStartDate") as DialogDatePicker;

    (input_title.value !== "" && input_startDate.year !== "") 
    ?this.readToFill = true
    :this.readToFill = false; 
  }

  // dispatch add request to timeline component 
  addEvent() {
    const title = this.shadowRoot.querySelector("#eventTitle") as DialogInput;
    const startDate = this.shadowRoot.querySelector("#eventStartDate") as DialogDatePicker;
    const endDate= this.shadowRoot.querySelector("#eventEndDate") as DialogDatePicker;

    let eventDetails = {
        title: title.value,
        startDay: startDate.day,
        startMonth: startDate.month,
        startYear: startDate.year,
    };

    if (this.useTimePeriod) {
      eventDetails['endDay'] = endDate.day;
      eventDetails['endMonth'] = endDate.month;
      eventDetails['endYear'] = endDate.year;
    }
    this.dispatchEvent(new CustomEvent("request-add", {
        detail: eventDetails,
        bubbles: true,
        composed: true
    }));

    console.log("Add request started: " + this.id);
  }
 
  // showWarning(){
  //   const container = document.querySelector('.alert-toast');

  //   ['primary', 'success', 'neutral', 'warning', 'danger'].map(variant => {
  //     const button = container.querySelector(`sl-button[variant="${variant}"]`);
  //     const alert = container.querySelector(`sl-alert[variant="${variant}"]`);
  
  //     // button.addEventListener('click', () => alert.toast());
  //   });
  // }
}
