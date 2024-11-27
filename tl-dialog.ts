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
import { TlEvent } from "./tl-event";

@customElement("timeline-dialog")
export class TimelineDialog extends LitElementWw {

  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;
  @property({ type: String }) accessor label = "";
  @property({ type: String }) accessor id = "";
  @property({ type: String }) accessor value = "";
  @property({ type: String }) accessor placeholder = "";
  @property({ type: Boolean, reflect: true }) accessor required = false;
  @property({ type: String }) accessor type: "input" | "textarea";
  @property({ type: Boolean }) accessor readyToFill = false;
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

      .dialog-input-container {
        display: grid;
        grid-template-columns: 1fr 1fr; 
        gap: 16px;
        width: 100%;
      }

      dialog-input {
        width: 100%;
        min-width: 0; 
      }
      dialog-date-picker {
        width: 100%;
        min-width: 0; 
      }

      @media (max-width: 600px) {
        .inputs-container {
          grid-template-columns: 1fr; 
          gap: 8px;
        }
      }

      dialog-input[disabled] {
        --sl-input-label-color: #888888;
      }
      dialog-date-picker[disabled] {
        --sl-input-label-color: #888888;
      }
      .endDate-disabled{
        color: grey;
      }
      .text-error {
        font-size: var(--sl-input-help-text-font-size-medium);
        color: var(--sl-color-danger-700);
      }
  `;


  static get scopedElements() {
    return { 
      "dialog-date-picker":DialogDatePicker,    
      "dialog-input": DialogInput,
      "dialog-toggle": DialogToggle,
      
      "event-container": EventContainer,
      "event-manager": EventManager,
      
      "sl-button": SlButton,
      "sl-checkbox": SlCheckbox,
      "sl-dialog": SlDialog,
      "sl-switch": SlSwitch,
      "sl-input": SlInput,
      "sl-alert": SlAlert, 
      "sl-icon": SlIcon,
    };
  }

  private datePicker = new DialogDatePicker();

  connectedCallback() {
    super.connectedCallback();
    // this.addEventListener('dd-yyyy-formate-error', this.showFormateError);

    this.addEventListener('show-day-validation-error', this.showDayError);
    this.addEventListener('hide-day-validation-error', this.hideDayError);

    this.addEventListener('show-month-validation-error', this.showMonthError);
    this.addEventListener('hide-month-validation-error', this.hideMonthError);
    
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('show-day-validation-error', this.showDayError);
    this.removeEventListener('hide-day-validation-error', this.hideDayError);

    this.removeEventListener('show-month-validation-error', this.showMonthError);
    this.removeEventListener('hide-month-validation-error', this.hideMonthError);

  }

  render() {
    return html`
      <sl-dialog id="timelineID" class="dialog-width" label="Add a Timeline Event" style="--width: 50vw;">
        <dialog-input type="input" label="Title" id="eventTitle" @sl-change=${this.enableSaveButton} placeholder="Enter the title" required> </dialog-input>
        <div class="text-error" id="titleError" hidden></div>
        <br />
        <div class="container">
          <dialog-toggle id="time-period" .useTimePeriod="${this.useTimePeriod}"
            @toggle-change="${(e: CustomEvent) => {
              this.useTimePeriod = e.detail.useTimePeriod;
              if (!this.useTimePeriod) {
                this.resetEndDate();
              }
            }}"
          ></dialog-toggle>
          <br />
          <div class="dialog-input-container">
            <dialog-date-picker .useTimePeriod="${this.useTimePeriod}" label=${this.useTimePeriod ? "Start date" : "Date"} id="eventStartDate" @sl-change=${this.enableSaveButton}></dialog-date-picker>
            <dialog-date-picker .useTimePeriod="${this.useTimePeriod}" class="${!this.useTimePeriod ? 'endDate-disabled' : ''}" label="End Date" id="eventEndDate"   @sl-change=${this.enableSaveButton} endDate="true"></dialog-date-picker>
          </div>
        </div>            
        <div class="text-error" id="dayError" hidden></div>
        <div class="text-error" id="monthError" hidden></div>
        <div class="text-error" id="formateError" hidden></div>

        <sl-button class="dialog-footer" id="resetButton" slot="footer" variant="default"  @click="${this.resetDialog}">Reset</sl-button>
        <sl-button id="savingButton" slot="footer" variant="primary" ?disabled="${!this.readyToFill}" @click="${() => this.addEvent()}">Add Event</sl-button>
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
    const inputs = this.shadowRoot?.querySelectorAll("dialog-input");
    const dates = this.shadowRoot?.querySelectorAll("dialog-date-picker");
    const titleError = this.shadowRoot.getElementById('titleError');
    const dayError = this.shadowRoot.getElementById('dayError');
    const monthError = this.shadowRoot.getElementById('monthError');
    const formateError = this.shadowRoot.getElementById('formateError');

    // reset toggle
    this.useTimePeriod = false;

    // reset all error messages
    titleError.textContent = "";
    dayError.textContent = "";
    monthError.textContent = "";
    formateError.textContent = "";

    titleError.hidden = true;
    dayError.hidden = true;
    monthError.hidden = true;
    formateError.hidden = true;

    // reset title ... and if used other input elements (adjust if only title will be used)
    inputs.forEach((input: DialogInput ) => {
      input.value = ""; 
    });

    // reset start and end dates
    dates.forEach((date: DialogDatePicker) => {
      date.reset(); 
    }); 
  }

  // seperate reset function to call if on toggle change
  resetEndDate(){
    const formateError = this.shadowRoot.getElementById('formateError');
    const endDate= this.shadowRoot.querySelector("#eventEndDate") as DialogDatePicker;

    formateError.textContent = "";
    formateError.hidden = true;
    endDate.reset();
  }

  //check if input values are empty, if not readToFill = true and #saveButton not disabled
  enableSaveButton(){
    this.evaluateTitleError();
    const input_title = this.shadowRoot?.getElementById("eventTitle") as DialogInput;
    const input_startDate = this.shadowRoot?.getElementById("eventStartDate") as DialogDatePicker;
    const datePicker = this.shadowRoot.querySelector('dialog-date-picker') as DialogDatePicker;

    const dayValidation = datePicker.validateDay();
    const monthValidation = datePicker.validateMonth();
    
    const yearValidation = datePicker.validateYear();
    const titleValid = input_title.value !== "";
    const startDateValid = input_startDate.year !== "";
    
    const isValid = dayValidation.valid && monthValidation.valid && yearValidation &&  input_title.value !== "" && input_startDate.year !== "";
    
    if(this.showFormateError() == true){
      this.readyToFill = isValid
    } else  {
      this.readyToFill = false; 
    } 
  }

  // check if title is empty, give errer message if so
  evaluateTitleError(){
    const input_title = this.shadowRoot?.getElementById("eventTitle") as DialogInput;
    const titleError = this.shadowRoot.getElementById('titleError');

    if (input_title.value == "") {
      titleError.textContent = "Error: Please enter a title";
      titleError.hidden = false;
    } else {
      titleError.textContent = "";
      titleError.hidden = true;
    }
  }

  // show error message for invalid day 
  showDayError(e){
    const datePicker = this.shadowRoot.querySelector('dialog-date-picker') as DialogDatePicker;
    const dayError = this.shadowRoot.getElementById('dayError');
    const dayValidation = datePicker.validateDay();

    if (dayValidation.valid == false) {
      dayError.textContent = "Error: " + e.detail.errorMessage;
      dayError.hidden = false;
    }
  }
  
  // hide error message for valid day 
  hideDayError(){
    const datePicker = this.shadowRoot.querySelector('dialog-date-picker') as DialogDatePicker;
    const dayError = this.shadowRoot.getElementById('dayError');
    const dayValidation = datePicker.validateDay();

    if (dayValidation.valid == true) {
      dayError.textContent = "";
      dayError.hidden = true;
    }
  }
  
  // show error message for invalid month 
  showMonthError(e){
    const datePicker = this.shadowRoot.querySelector('dialog-date-picker') as DialogDatePicker;
    const monthError = this.shadowRoot.getElementById('monthError');
    const monthValidation = datePicker.validateMonth();

    if (monthValidation.valid == false) {
      monthError.textContent = "Error: " + e.detail.errorMessage;
      monthError.hidden = false;
    } 
  }

  // hide error message for valid month 
  hideMonthError(){
    const datePicker = this.shadowRoot.querySelector('dialog-date-picker') as DialogDatePicker;
    const monthError = this.shadowRoot.getElementById('monthError');
    const monthValidation = datePicker.validateMonth();

    if (monthValidation.valid == true) {
      monthError.textContent = "";
      monthError.hidden = true;
    }
  }
  
  //  check if end date is before start date and check if only dd and yyyy have been added
  showFormateError(): Boolean {
    const startDate = this.shadowRoot.querySelector("#eventStartDate") as DialogDatePicker;
    const endDate= this.shadowRoot.querySelector("#eventEndDate") as DialogDatePicker;
    const formateError = this.shadowRoot.getElementById('formateError');

    const start= Date.parse(`${startDate.year ? `${startDate.year}` : ''}${startDate.month ? `-${startDate.month}` : ''}${startDate.day ? `-${startDate.day}` : ''}`);
    const end= Date.parse(`${endDate.year ? `${endDate.year}` : ''}${endDate.month ? `-${endDate.month}` : ''}${endDate.day ? `-${endDate.day}` : ''}`);

    if(start > end && this.useTimePeriod == true && !((startDate.day && !startDate.month && startDate.year)||(endDate.day && !endDate.month && endDate.year))){
      formateError.textContent = "Error: Invalid format, Start date after end date";
      formateError.hidden = false;
      return false;
    } else if(start > end && this.useTimePeriod == true && ((startDate.day && !startDate.month  && startDate.year)||(endDate.day && !endDate.month && endDate.year))){
      formateError.textContent = "Error: Invalid format (dd/yyyy) please enter a month and start date after end date.";
      formateError.hidden = false;
      return false;
    } else if ((startDate.day && !startDate.month && startDate.year)||(endDate.day && !endDate.month && endDate.year)){
      formateError.textContent = "Error: Invalid format (dd/yyyy), enter a month.";
      formateError.hidden = false;
      return false;
    } else {
      formateError.textContent= "";
      formateError.hidden = true;
      return true;
    }
  }

  // disable save button, called if warnings occur
  disableSaveButton(){
    this.readyToFill =false;
  }

  // dispatch add request to timeline component 
  addEvent() {
    const title = this.shadowRoot.querySelector("#eventTitle") as DialogInput;
    const startDate = this.shadowRoot.querySelector("#eventStartDate") as DialogDatePicker;
    const endDate= this.shadowRoot.querySelector("#eventEndDate") as DialogDatePicker;

    // TO DO: let eventDetails: TlEvent = {
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
    // console.log("Add request started: " + this.id);
  }
}