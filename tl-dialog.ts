import {
	SlButton,
	SlDialog,
	SlInput,
} from "@shoelace-style/shoelace";
import "@shoelace-style/shoelace/dist/themes/light.css";
import { LitElementWw } from "@webwriter/lit";
import { css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { HelpOverlay, HelpPopup } from "@webwriter/wui/dist/helpSystem/helpSystem.js";
import { DialogDatePicker } from "./dialog-elements/d-datepicker";
import { DialogInput } from "./dialog-elements/d-input";
import { DialogToggle } from "./dialog-elements/d-toggle";
import { TlEventData } from "./tl-event-data";

@customElement("timeline-dialog")
export class TimelineDialog extends LitElementWw {
  @property({ type: Number, attribute: true, reflect: true })
  accessor tabIndex = -1;
  @property({ type: String }) accessor label = "";
  @property({ type: String }) accessor id = "";
  @property({ type: String }) accessor value = "";
  @property({ type: String }) accessor placeholder = "";
  @property({ type: Boolean, reflect: true }) accessor required = false;
  @property({ type: String }) accessor type: "input" | "textarea";
  @property({ type: Boolean }) accessor readyToFill = false;
  @property({ type: Boolean }) accessor useTimePeriod = false;

  // Error message properties
  @property({ type: String }) accessor titleErrorMessage = "";
  @property({ type: String }) accessor dayErrorMessage = "";
  @property({ type: String }) accessor monthErrorMessage = "";
  @property({ type: String }) accessor yearErrorMessage = "";
  @property({ type: String }) accessor formatErrorMessage = "";
  @property({ type: String }) accessor timeErrorMessage = "";

  @query("#timeline-dialog") accessor dialog: SlDialog;
  @query("#event-title") accessor eventTitle: DialogInput;
  @query("#event-start-date") accessor startDate: DialogDatePicker;
  @query("#event-end-date") accessor endDate: DialogDatePicker;

  static styles = css`
    sl-dialog::part(base) {
      position: absolute;
      height: 100%;
      width: 100%;
    }
    sl-dialog::part(overlay) {
      position: absolute;
      width: 100%;
    }
    sl-dialog::part(panel) {
      min-width: 350px;
    }
    .d-width {
      width: 100%;
    }
    .d-input-container {
      padding-top: 10px;
      padding-bottom: 10px;
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      width: 100%;
      box-sizing: border-box;
    }

    dialog-date-picker {
      flex: 1 1 45%;
      min-width: 270px;
      max-width: 100%;
      box-sizing: border-box;
      /* padding-top: 15px; */
    }
    @media (max-width: 600px) {
      .inputs-container {
        grid-template-columns: 1fr;
        gap: 8px;
      }
    }
    dialog-date-picker[disabled] {
      --sl-input-label-color: #888888;
    }
    .endDate-disabled {
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
      padding-bottom: 15px;
    }
    .button {
      padding-top: 5px;
      width: 100px;
    }
    .d-input {
      width: 100%;
      min-width: 0;
      padding-bottom: 15px;
    }
    #event-title[error] {
      width: 100%;
      min-width: 0;
      margin-bottom: 10px;
      --sl-input-border-color: var(--sl-color-danger-700);
      box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-color-danger-300);
      border-radius: 3px;
      outline: none;
      padding-bottom:0px; 
    }
    .text-error:not([hidden]) {
      padding-bottom: 15px;
    }

    .d-input[disabled] {
      --sl-input-label-color: #888888;
      padding-bottom: 15px;
    }
  `;

  static get scopedElements() {
    return {
      "dialog-date-picker": DialogDatePicker,
      "dialog-input": DialogInput,
      "dialog-toggle": DialogToggle,

      "sl-button": SlButton,
      "sl-dialog": SlDialog,
      "webwriter-helpoverlay": HelpOverlay,
      "webwriter-helppopup": HelpPopup,
    };
  }

  private datePicker = new DialogDatePicker();

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("show-day-validation-error", this.showDayError);
    this.addEventListener("hide-day-validation-error", this.hideDayError);

    this.addEventListener("show-month-validation-error", this.showMonthError);
    this.addEventListener("hide-month-validation-error", this.hideMonthError);

    this.addEventListener("show-year-validation-error", this.showYearError);
    this.addEventListener("hide-year-validation-error", this.hideYearError);

    this.addEventListener("show-format-validation-error", this.showFormatError);
    this.addEventListener("hide-format-validation-error", this.hideFormatError);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("show-day-validation-error", this.showDayError);
    this.removeEventListener("hide-day-validation-error", this.hideDayError);

    this.removeEventListener("show-month-validation-error", this.showMonthError);
    this.removeEventListener("hide-month-validation-error", this.hideMonthError);
    
    this.removeEventListener("show-year-validation-error", this.showYearError);
    this.removeEventListener("hide-year-validation-error", this.hideYearError);

    this.removeEventListener("show-format-validation-error", this.showFormatError);
    this.removeEventListener("hide-format-validation-error", this.hideFormatError);
  }

  render() {
    return html`
      <!-- not working helpoverlay  -->
      <!-- <webwriter-helpoverlay>
     
      <webwriter-helppopup
        slot="popupContainer"
        target="event-title"
      >
        <div slot="content">
          <h4>Event Title</h4>
          <p>Enter a title for the event.</p>
        </div>
      </webwriter-helppopup>

      <webwriter-helppopup
        slot="popupContainer"
        target="time-period"
      >
        <div slot="content">
          <h4>Time Period Toggle</h4>
          <p>Toggle me to use a single date or a time period for the event.</p>
        </div>
      </webwriter-helppopup>

       <webwriter-helppopup
        slot="popupContainer"
        target="event-start-date"
      >
        <div slot="content">
          <h4>Event (Start) Date</h4>
          <p>Enter a date for the event. Day and Month are optional. Years before the common era (BCE) must be entered with a "-".</p>
        </div>
      </webwriter-helppopup>

        <webwriter-helppopup
        slot="popupContainer"
        target="event-end-date"
      >
        <div slot="content">
          <h4>Event End Date</h4>
          <p>If a time period has been selected at the "Time Period Toggle", enter a end date for the event. Day and Month are optional. Years before the common era (BCE) must be entered with a "-".</p>
        </div>
      </webwriter-helppopup>
    </webwriter-helpoverlay> -->

      <sl-dialog
        id="timeline-dialog"
        class="d-width"
        label="Add a Timeline Event"
        style="--width: 50vw;"
      >
      <form>
        <dialog-input
          id="event-title"
          class="d-input"
          type="input"
          @sl-change=${this.enableSaveButton}
          placeholder="Enter the title"
          required
        >
        </dialog-input>
        <div class="text-error" ?hidden="${!this.titleErrorMessage}">${this.titleErrorMessage}</div>

        <dialog-toggle
          id="time-period"
          class="d-toggle"
          .useTimePeriod="${this.useTimePeriod}"
          @toggle-change="${(e: CustomEvent) => {
            this.useTimePeriod = e.detail.useTimePeriod;
            if (!this.useTimePeriod) {
              this.resetEndDate();
            }
          }}"
        >
        </dialog-toggle>

        <div class="d-input-container">
          <dialog-date-picker
            .useTimePeriod="${this.useTimePeriod}"
            label=${this.useTimePeriod ? "Start Date" : "Date"}
            id="event-start-date"
            @sl-change=${this.enableSaveButton}
          >
          </dialog-date-picker>

          <dialog-date-picker
            .useTimePeriod="${this.useTimePeriod}"
            class="${!this.useTimePeriod ? "endDate-disabled" : ""}"
            label="End Date"
            id="event-end-date"
            @sl-change=${this.enableSaveButton}
            useEndDate="true"
          >
          </dialog-date-picker>
        </div>

        <div class="text-error" ?hidden="${!this.dayErrorMessage}">${this.dayErrorMessage}</div>

        <div class="text-error" ?hidden="${!this.monthErrorMessage}">${this.monthErrorMessage}</div>

        <div class="text-error" ?hidden="${!this.yearErrorMessage}">${this.yearErrorMessage}</div>

        <div class="text-error" ?hidden="${!this.formatErrorMessage}">${this.formatErrorMessage}</div>

        <div class="text-error" ?hidden="${!this.timeErrorMessage}">${this.timeErrorMessage}</div>

        <div class="button-container">
          <sl-button
            class="button"
            id="resetButton"
            slot="footer"
            variant="default"
            @click="${this.resetDialog}"
            >Reset
          </sl-button>

          <sl-button
            class="button"
            id="savingButton"
            slot="footer"
            variant="primary"
            ?disabled="${!this.readyToFill}"
            @click="${() => this.dispatchAddEvent()}"
            >Add Event
          </sl-button>
        </div>
      </form>
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
  resetDialog() {
    const monthStartInput = this.startDate.shadowRoot.querySelector(
      "#month"
    ) as SlInput;
    const monthEndInput = this.startDate.shadowRoot.querySelector(
      "#month"
    ) as SlInput;

    this.useTimePeriod = false;

    // Reset error messages using reactive properties
    this.titleErrorMessage = "";
    this.dayErrorMessage = "";
    this.monthErrorMessage = "";
    this.yearErrorMessage = "";
    this.formatErrorMessage = "";
    this.timeErrorMessage = "";
    this.eventTitle.value = "";

    this.eventTitle.removeAttribute("error");
    monthStartInput.removeAttribute("invalid");
    monthEndInput.removeAttribute("invalid");

    this.startDate.reset();
    this.endDate.reset();
  }

  // seperate reset function to call if on toggle change
  resetEndDate() {
    this.formatErrorMessage = "";
    this.endDate.reset();
  }

  // check if input values are empty, if not readToFill = true and #saveButton not disabled
  enableSaveButton() {
    this.evaluateTitleError();

    // Validate each input separately
    const startDayValidation = this.startDate.validateDay();
    const startMonthValidation = this.startDate.validateMonth();
    const startYearValidation = this.startDate.validateYear();
    const startFormatValidation = this.startDate.validateFormat();

    const endDayValidation = this.useTimePeriod ? this.endDate.validateDay() : { valid: true };
    const endMonthValidation = this.useTimePeriod ? this.endDate.validateMonth() : { valid: true };
    const endYearValidation = this.useTimePeriod ? this.endDate.validateYear() : { valid: true };
    const endFormatValidation = this.useTimePeriod ? this.endDate.validateFormat() : { valid: true };

    // Update error display based on individual validations
    this.updateValidationErrors(startDayValidation, endDayValidation, startMonthValidation, endMonthValidation, 
                               startYearValidation, endYearValidation, startFormatValidation, endFormatValidation);

    // Check overall validity
    const dayValidation = startDayValidation.valid && endDayValidation.valid;
    const monthValidation = startMonthValidation.valid && endMonthValidation.valid;
    const yearValidation = startYearValidation.valid && endYearValidation.valid;
    const formatValidation = startFormatValidation.valid && endFormatValidation.valid;

    const titleValid = this.eventTitle.value !== "";
    const startDateValid = this.startDate.year !== "";

    const isValid =
      dayValidation &&
      monthValidation &&
      yearValidation &&
      formatValidation &&
      this.eventTitle.value !== "" &&
      this.startDate.year !== "";

    if (this.evaluateTimeError() === true) {
      this.readyToFill = isValid;
    } else {
      this.readyToFill = false;
    }
  }

  // Update error display based on individual validations
  private updateValidationErrors(startDayValidation: any, endDayValidation: any, startMonthValidation: any, endMonthValidation: any,
                                startYearValidation: any, endYearValidation: any, startFormatValidation: any, endFormatValidation: any) {
    // Day validation errors
    if (!startDayValidation.valid || !endDayValidation.valid) {
      const errorMessage = !startDayValidation.valid ? 
        (startDayValidation.errorMessage || "Invalid day") : 
        (endDayValidation.errorMessage || "Invalid day");
      this.dayErrorMessage = errorMessage;
    } else {
      this.dayErrorMessage = "";
    }

    // Month validation errors
    if (!startMonthValidation.valid || !endMonthValidation.valid) {
      const errorMessage = !startMonthValidation.valid ? 
        (startMonthValidation.errorMessage || "Invalid month") : 
        (endMonthValidation.errorMessage || "Invalid month");
      this.monthErrorMessage = errorMessage;
    } else {
      this.monthErrorMessage = "";
    }

    // Year validation errors
    if (!startYearValidation.valid || !endYearValidation.valid) {
      const errorMessage = !startYearValidation.valid ? 
        (startYearValidation.errorMessage || "Invalid year") : 
        (endYearValidation.errorMessage || "Invalid year");
      this.yearErrorMessage = errorMessage;
    } else {
      this.yearErrorMessage = "";
    }

    // Format validation errors
    if (!startFormatValidation.valid || !endFormatValidation.valid) {
      const errorMessage = !startFormatValidation.valid ? 
        (startFormatValidation.errorMessage || "Invalid format") : 
        (endFormatValidation.errorMessage || "Invalid format");
      this.formatErrorMessage = errorMessage;
    } else {
      this.formatErrorMessage = "";
    }
  }

  // disable save button, called if warnings occur
  disableSaveButton() {
    this.readyToFill = false;
  }

  // check if title is empty, give errer message if so
  evaluateTitleError() {
    if (this.eventTitle.value === "") {
      this.titleErrorMessage = "Please enter a title";
      this.eventTitle.setAttribute("error","true");
    } else {
      this.titleErrorMessage = "";
      this.eventTitle.removeAttribute("error");
    }
  }

  // show error message for invalid day
  showDayError(e) {
    // Check individual validations instead of combined
    const startDayValidation = this.startDate.validateDay();
    const endDayValidation = this.useTimePeriod ? this.endDate.validateDay() : { valid: true };

    if (!startDayValidation.valid || !endDayValidation.valid) {
      this.dayErrorMessage = e.detail.errorMessage;
    }
  }

  // hide error message for valid day
  hideDayError() {
    // Check individual validations instead of combined
    const startDayValidation = this.startDate.validateDay();
    const endDayValidation = this.useTimePeriod ? this.endDate.validateDay() : { valid: true };

    if (startDayValidation.valid && endDayValidation.valid) {
      this.dayErrorMessage = "";
    }
  }

  // show error message for invalid month
  showMonthError(e) {
    // Check individual validations instead of combined
    const startMonthValidation = this.startDate.validateMonth();
    const endMonthValidation = this.useTimePeriod ? this.endDate.validateMonth() : { valid: true };

    if (!startMonthValidation.valid || !endMonthValidation.valid) {
      this.monthErrorMessage = e.detail.errorMessage;
    }
  }

  // hide error message for valid month
  hideMonthError() {
    // Check individual validations instead of combined
    const startMonthValidation = this.startDate.validateMonth();
    const endMonthValidation = this.useTimePeriod ? this.endDate.validateMonth() : { valid: true };

    if (startMonthValidation.valid && endMonthValidation.valid) {
      this.monthErrorMessage = "";
    }
  }

  // show error message for invalid year
  showYearError(e) {
    // Check individual validations instead of combined
    const startYearValidation = this.startDate.validateYear();
    const endYearValidation = this.useTimePeriod ? this.endDate.validateYear() : { valid: true };

    if (!startYearValidation.valid || !endYearValidation.valid) {
      if (e.detail.errorMessage === "Please enter a year with maximum 4 digits") {
        this.yearErrorMessage = e.detail.errorMessage;
      } else if (e.detail.errorMessage === "Please enter a year") {
        setTimeout(() => {
          this.yearErrorMessage = e.detail.errorMessage;
        }, 4000);      
      }
    } else {
      this.hideYearError();
    }
  }

  // hide error message for valid year
  hideYearError() {
    // Check individual validations instead of combined
    const startYearValidation = this.startDate.validateYear();
    const endYearValidation = this.useTimePeriod ? this.endDate.validateYear() : { valid: true };

    if (startYearValidation.valid && endYearValidation.valid) {
      this.yearErrorMessage = "";
    }
  }

  // check if end date is before start date and check if only dd and yyyy have been added
  showFormatError(e) {
    // Check individual validations instead of combined
    const startFormatValidation = this.startDate.validateFormat();
    const endFormatValidation = this.useTimePeriod ? this.endDate.validateFormat() : { valid: true };

    if (!startFormatValidation.valid || !endFormatValidation.valid) {
      this.formatErrorMessage = e.detail.errorMessage;
    }
  }

  // hide error message if no format error
  hideFormatError() {
    // Check individual validations instead of combined
    const startFormatValidation = this.startDate.validateFormat();
    const endFormatValidation = this.useTimePeriod ? this.endDate.validateFormat() : { valid: true };

    if (startFormatValidation.valid && endFormatValidation.valid) {
      this.formatErrorMessage = "";
    }
  }

  // check if end date < start date and give error
  evaluateTimeError(): Boolean {
    const start = this.convertToMoment(this.startDate);
    const end = this.useTimePeriod
      ? this.convertToMoment(this.endDate)
      : undefined;
    if (( this.startDate.year.length > 0 && this.endDate.year.length > 0) &&
      this.useTimePeriod && 
      (start[0] > end[0] ||
        (start[0] === end[0] && start[1] > end[1]) ||
        (start[0] === end[0] && start[1] === end[1] && start[2] > end[2]))
    ) {
      this.timeErrorMessage = "Invalid format, Start date after end date";
      return false;
    } else {
      this.timeErrorMessage = "";
      return true;
    }
  }

  // dispatch add request to timeline component
  dispatchAddEvent() {
    let eventDetails: TlEventData = {
      title: this.eventTitle.value,

      startDate: this.convertToMoment(this.startDate),

      endDate: this.useTimePeriod
        ? this.convertToMoment(this.endDate)
        : undefined,
    };
    this.dispatchEvent(
      new CustomEvent("request-add", {
        detail: eventDetails,
        bubbles: true,
        composed: true,
      })
    );
  }

  // help function to convert date in interface [yyyy,mm,dd]format
  private convertToMoment(
    datePicker: DialogDatePicker
  ): TlEventData["startDate"] {
    const date: TlEventData["startDate"] = [
      Number(datePicker.year),
      undefined,
      undefined,
    ];
    if (datePicker.month) {
      date[1] = Number(datePicker.month);
    }
    if (datePicker.day) {
      date[2] = Number(datePicker.day);
    }
    return date;
  }
}