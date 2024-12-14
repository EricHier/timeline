import {LitElement, html, PropertyValues, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property, query, queryAll} from "lit/decorators.js"

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
import { DialogToggle } from "./dialog-elements/d-toggle";
import { DialogDatePicker } from "./dialog-elements/d-datepicker";
import { TlEventData } from "./tl-event-data";

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


  @query("#timelineID") accessor dialog: SlDialog;
  @query("#eventTitle") accessor event_title: DialogInput;
  @query("#eventStartDate") accessor startDate: DialogDatePicker;
  @query("#eventEndDate") accessor endDate: DialogDatePicker;

  @query("#titleError") accessor titleError;
  @query("#dayError") accessor dayError;
  @query("#monthError") accessor monthError;
  @query("#yearError") accessor yearError;
  @query("#formatError") accessor formatError;
  @query("#timeError") accessor timeError;


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
        padding-top: 10px; 

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
      .button-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }
      .button {
        padding-top: 5px; 
        width: 100px; 
      }
      /* .d-toggle {
        padding-top: 10px; 
      } */
      .d-input{
        padding-bottom: 10px; 
      }
  `;

  static get scopedElements() {
    return { 
      "dialog-date-picker":DialogDatePicker,    
      "dialog-input": DialogInput,
      "dialog-toggle": DialogToggle,
      
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
    
    this.addEventListener('show-year-validation-error', this.showYearError);
    this.addEventListener('hide-year-validation-error', this.hideYearError);

    this.addEventListener('show-format-validation-error', this.showFormatError);
    this.addEventListener('hide-format-validation-error', this.hideFormatError);
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
      <sl-dialog 
        id="timelineID" 
        class="dialog-width" 
        label="Add a Timeline Event"
        style="--width: 50vw;">

        <dialog-input 
          id="eventTitle" 
          class="d-input"
          type="input" 
          @sl-change=${this.enableSaveButton} 
          placeholder="Enter the title" 
          required> 
        </dialog-input>

        <div 
          class="text-error" 
          id="titleError" 
          hidden>
        </div>

        <dialog-toggle 
          id="time-period"
          class="d-toggle" 
          .useTimePeriod="${this.useTimePeriod}"
          @toggle-change="${(e: CustomEvent) => {
            this.useTimePeriod = e.detail.useTimePeriod;
            if (!this.useTimePeriod) {
              this.resetEndDate();
            }
          }}">
        </dialog-toggle>

        <div class="dialog-input-container">
          <dialog-date-picker 
            .useTimePeriod="${this.useTimePeriod}" 
            label=${this.useTimePeriod ? "Start date" : "Date"} 
            id="eventStartDate" 
            @sl-change=${this.enableSaveButton}>
          </dialog-date-picker>

          <dialog-date-picker .useTimePeriod="${this.useTimePeriod}" 
            class="${!this.useTimePeriod ? 'endDate-disabled' : ''}" 
            label="End Date" id="eventEndDate"   
            @sl-change=${this.enableSaveButton} 
            useEndDate="true">
          </dialog-date-picker>
        </div>
                 
        <div 
          class="text-error" 
          id="dayError" 
          hidden>
        </div>

        <div 
          class="text-error" 
          id="monthError" 
          hidden>
        </div>

        <div 
          class="text-error" 
          id="yearError" 
          hidden>
        </div>

        <div 
          class="text-error" 
          id="formatError" 
          hidden>
        </div>

        <div 
          class="text-error" 
          id="timeError" 
          hidden>
        </div>

        <div class="button-container">
          <sl-button 
            class="button" 
            id="resetButton" 
            slot="footer" 
            variant="default"  
            @click="${this.resetDialog}">Reset
          </sl-button>

          <sl-button 
            class="button" 
            id="savingButton" 
            slot="footer" 
            variant="primary" 
            ?disabled="${!this.readyToFill}" 
            @click="${() => this.dispatchAddEvent()}">Add Event
          </sl-button>
        </div>
      </sl-dialog>  
    `;
  } 
      
  // show dialog to enter input
  public showDialog() {
    this.resetDialog();
    this.dialog.show();
  }

  //hide dialog after saving or closing
  public hideDialog() {
    this.dialog.hide();
  }

  //reset input values and errors 
  resetDialog(){
    const monthStartInput = this.startDate.shadowRoot.querySelector('#month') as SlInput;
    const monthEndInput = this.startDate.shadowRoot.querySelector('#month') as SlInput;

    this.useTimePeriod = false;

    this.titleError.textContent = "";
    this.dayError.textContent = "";
    this.monthError.textContent = "";
    this.yearError.textContent = "";
    this.formatError.textContent = "";

    this.titleError.hidden = true;
    this.dayError.hidden = true;
    this.monthError.hidden = true;
    this.yearError.hidden = true; 
    this.formatError.hidden = true;

    monthStartInput.removeAttribute("invalid");
    monthEndInput.removeAttribute("invalid");

    this.event_title.value = "";

    this.startDate.reset();
    this.endDate.reset();

  }

  // seperate reset function to call if on toggle change
  resetEndDate(){
    this.formatError.textContent = "";
    this.formatError.hidden = true;
    this.endDate.reset();
  }

  //check if input values are empty, if not readToFill = true and #saveButton not disabled
  enableSaveButton(){
    this.evaluateTitleError();

    let dayValidation;
    let monthValidation;
    let yearValidation;
    let formatValidation;

    this.useTimePeriod
      ? (dayValidation =
          this.startDate.validateDay() && this.endDate.validateDay())
      : (dayValidation = this.startDate.validateDay());
    this.useTimePeriod
      ? (monthValidation =
          this.startDate.validateMonth() && this.endDate.validateMonth())
      : (monthValidation = this.startDate.validateMonth());
    this.useTimePeriod
      ? (yearValidation =
          this.startDate.validateYear() && this.endDate.validateYear())
      : (yearValidation = this.startDate.validateYear());
    this.useTimePeriod
      ? (formatValidation =
          this.startDate.validateFormat() && this.endDate.validateFormat())
      : (formatValidation = this.startDate.validateFormat());

    const titleValid = this.event_title.value !== "";
    const startDateValid = this.startDate.year !== "";
    
    const isValid =
      dayValidation.valid &&
      monthValidation.valid &&
      yearValidation.valid &&
      formatValidation.valid &&
      this.event_title.value !== "" &&
      this.startDate.year !== "";
    
    if(this.evaluateTimeError() === true){
      this.readyToFill = isValid
    } else  {
      this.readyToFill = false; 
    } 
  }

   // disable save button, called if warnings occur
   disableSaveButton(){
    this.readyToFill =false;
  }

  // check if title is empty, give errer message if so
  evaluateTitleError(){
    if (this.event_title.value === "") {
      this.titleError.textContent = "Error: Please enter a title";
      this.titleError.hidden = false;
    } else {
      this.titleError.textContent = "";
      this.titleError.hidden = true;
    }
  }

  // show error message for invalid day 
  showDayError(e){
    const dayValidation = this.useTimePeriod
    ? this.startDate.validateDay() && this.endDate.validateDay() 
    : this.startDate.validateDay();

    if (dayValidation.valid === false) {
      this.dayError.textContent = "Day Error: " + e.detail.errorMessage;
      this.dayError.hidden = false;
    }
  }
  
  // hide error message for valid day 
  hideDayError(){
    const dayValidation = this.useTimePeriod
    ? this.startDate.validateDay() && this.endDate.validateDay() 
    : this.startDate.validateDay();

    if (dayValidation.valid === true) {
      this.dayError.textContent = "";
      this.dayError.hidden = true;
    }
  }
  
  // show error message for invalid month 
  showMonthError(e){
    const monthValidation = this.useTimePeriod
    ? this.startDate.validateMonth() && this.endDate.validateMonth()
    : this.startDate.validateMonth();

    if (monthValidation.valid === false) {
      this.monthError.textContent = "Month Error: " + e.detail.errorMessage;
      this.monthError.hidden = false;
    } 
  }

  // hide error message for valid month 
  hideMonthError(){
    const monthValidation = this.useTimePeriod
      ? this.startDate.validateMonth() && this.endDate.validateMonth() 
      : this.startDate.validateMonth();

    if (monthValidation.valid === true) {
      this.monthError.textContent = "";
      this.monthError.hidden = true;
    }
  }
  
  // show error message for invalid year 
  showYearError(e){
    const yearValidation = this.useTimePeriod
      ? this.startDate.validateYear() && this.endDate.validateYear() 
      : this.startDate.validateYear();

    if (yearValidation.valid === false) {
      this.yearError.textContent = "Year Error: " + e.detail.errorMessage;
      this.yearError.hidden = false;
    } 
  }

  // hide error message for valid year 
  hideYearError(){
    const yearValidation = this.useTimePeriod
      ? this.startDate.validateYear() && this.endDate.validateYear() 
      : this.startDate.validateYear();

    if (yearValidation.valid === true) {
      this.yearError.textContent = "";
      this.yearError.hidden = true;
    }
  }

  //  check if end date is before start date and check if only dd and yyyy have been added
  showFormatError(e) {
    const formatValidation = this.useTimePeriod? this.startDate.validateFormat() && this.endDate.validateFormat() : this.startDate.validateFormat();

    if (formatValidation.valid == false) {
      this.formatError.textContent = "Format Error: " + e.detail.errorMessage;
      this.formatError.hidden = false;
    }
  }

  hideFormatError(){
    const formatValidation = this.useTimePeriod
      ? this.startDate.validateFormat() && this.endDate.validateFormat()
      : this.startDate.validateFormat();

    if (formatValidation.valid === true) {
      this.formatError.textContent = "";
      this.formatError.hidden = true;
    }
  }

  evaluateTimeError(): Boolean{
    const start = Date.parse(
      `${this.startDate.year ? `${this.startDate.year}` : ""}${
        this.startDate.month ? `-${this.startDate.month}` : ""
      }${this.startDate.day ? `-${this.startDate.day}` : ""}`
    );
    const end = Date.parse(
      `${this.endDate.year ? `${this.endDate.year}` : ""}${
        this.endDate.month ? `-${this.endDate.month}` : ""
      }${this.endDate.day ? `-${this.endDate.day}` : ""}`
    );

    if(start > end && this.useTimePeriod == true){
      this.timeError.textContent = "Time Error: Invalid format, Start date after end date";
      this.timeError.hidden = false;
      return false; 
    } else {
      this.timeError.textContent= "";
      this.timeError.hidden = true;
      return true; 
    }
  }

  // dispatch add request to timeline component 
  dispatchAddEvent() {
    let eventDetails: TlEventData = {
      title: this.event_title.value,

      startDate: `${this.startDate.year}${
        this.startDate.month ? `-${this.startDate.month}` : ""
      }${this.startDate.day ? `-${this.startDate.day}` : ""}`,

      endDate: this.useTimePeriod
        ? `${this.endDate.year}${
            this.endDate.month ? `-${this.endDate.month}` : ""
          }${this.endDate.day ? `-${this.endDate.day}` : ""}`
        : "",
    };

    this.dispatchEvent(new CustomEvent("request-add", {
      detail: eventDetails,
      bubbles: true,
      composed: true
    }));
    // console.log("Add request started: " + this.id);
  }
}