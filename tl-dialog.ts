import { html, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property, query} from "lit/decorators.js"
import "@shoelace-style/shoelace/dist/themes/light.css";
import {
  SlButton,
  SlDialog,
  SlInput,
} from "@shoelace-style/shoelace";

import { DialogInput } from "./dialog-elements/d-input";
import { DialogToggle } from "./dialog-elements/d-toggle";
import { DialogDatePicker } from "./dialog-elements/d-datepicker";
import { TlEventData } from "./tl-event-data";
import { HelpOverlay, HelpPopup } from "@webwriter/wui/dist/helpSystem/helpSystem.js";

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

  @query("#timeline-dialog") accessor dialog: SlDialog;
  @query("#event-title") accessor eventTitle: DialogInput;
  @query("#event-start-date") accessor startDate: DialogDatePicker;
  @query("#event-end-date") accessor endDate: DialogDatePicker;

  @query("#title-error") accessor titleError: HTMLDivElement;
  @query("#day-error") accessor dayError: HTMLDivElement;
  @query("#month-error") accessor monthError: HTMLDivElement;
  @query("#year-error") accessor yearError: HTMLDivElement;
  @query("#format-error") accessor formatError: HTMLDivElement;
  @query("#time-error") accessor timeError: HTMLDivElement;

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
      color: var(--sl-color-warning-700);
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
    .d-input {
      width: 100%;
      min-width: 0;
      padding-bottom: 10px;
    }
    .d-input[disabled] {
      --sl-input-label-color: #888888;
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

        <div class="text-error" id="title-error" hidden></div>

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
            label=${this.useTimePeriod ? "Start date" : "Date"}
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

        <div class="text-error" id="day-error" hidden></div>

        <div class="text-error" id="month-error" hidden></div>

        <div class="text-error" id="year-error" hidden></div>

        <div class="text-error" id="format-error" hidden></div>

        <div class="text-error" id="time-error" hidden></div>

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

    this.titleError.textContent =
      this.dayError.textContent =
      this.monthError.textContent =
      this.yearError.textContent =
      this.formatError.textContent =
      this.eventTitle.value =
        "";

    this.titleError.hidden =
      this.dayError.hidden =
      this.monthError.hidden =
      this.yearError.hidden =
      this.formatError.hidden =
        true;

    monthStartInput.removeAttribute("invalid");
    monthEndInput.removeAttribute("invalid");

    this.startDate.reset();
    this.endDate.reset();
  }

  // seperate reset function to call if on toggle change
  resetEndDate() {
    this.formatError.textContent = "";
    this.formatError.hidden = true;
    this.endDate.reset();
  }

  // check if input values are empty, if not readToFill = true and #saveButton not disabled
  enableSaveButton() {
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

    const titleValid = this.eventTitle.value !== "";
    const startDateValid = this.startDate.year !== "";

    const isValid =
      dayValidation.valid &&
      monthValidation.valid &&
      yearValidation.valid &&
      formatValidation.valid &&
      this.eventTitle.value !== "" &&
      this.startDate.year !== "";

    if (this.evaluateTimeError() === true) {
      this.readyToFill = isValid;
    } else {
      this.readyToFill = false;
    }
  }

  // disable save button, called if warnings occur
  disableSaveButton() {
    this.readyToFill = false;
  }

  // check if title is empty, give errer message if so
  evaluateTitleError() {
    if (this.eventTitle.value === "") {
      this.titleError.textContent = "Please enter a title";
      this.titleError.hidden = false;
    } else {
      this.titleError.textContent = "";
      this.titleError.hidden = true;
    }
  }

  // show error message for invalid day
  showDayError(e) {
    const dayValidation = this.useTimePeriod
      ? this.startDate.validateDay() && this.endDate.validateDay()
      : this.startDate.validateDay();

    if (dayValidation.valid === false) {
      this.dayError.textContent =
        //"Day Error: " +
        e.detail.errorMessage;
      this.dayError.hidden = false;
    }
  }

  // hide error message for valid day
  hideDayError() {
    const dayValidation = this.useTimePeriod
      ? this.startDate.validateDay() && this.endDate.validateDay()
      : this.startDate.validateDay();

    if (dayValidation.valid === true) {
      this.dayError.textContent = "";
      this.dayError.hidden = true;
    }
  }

  // show error message for invalid month
  showMonthError(e) {
    const monthValidation = this.useTimePeriod
      ? this.startDate.validateMonth() && this.endDate.validateMonth()
      : this.startDate.validateMonth();

    if (monthValidation.valid === false) {
      this.monthError.textContent =
        //"Month Error: " +
        e.detail.errorMessage;
      this.monthError.hidden = false;
    }
  }

  // hide error message for valid month
  hideMonthError() {
    const monthValidation = this.useTimePeriod
      ? this.startDate.validateMonth() && this.endDate.validateMonth()
      : this.startDate.validateMonth();

    if (monthValidation.valid === true) {
      this.monthError.textContent = "";
      this.monthError.hidden = true;
    }
  }

  // show error message for invalid year
  showYearError(e) {
    const yearValidation = this.useTimePeriod
      ? this.startDate.validateYear() && this.endDate.validateYear()
      : this.startDate.validateYear();

    
    if (yearValidation.valid === false && e.detail.errorMessage === "Please enter a year with maximum 4 digits") {
      this.yearError.textContent = e.detail.errorMessage;
      this.yearError.hidden = false;
    } else if (yearValidation.valid === false && e.detail.errorMessage === "Please enter a year") {
      setTimeout(() => {
        this.yearError.textContent = e.detail.errorMessage;
        this.yearError.hidden = false;
      }, 4500);
    }
  }

  // hide error message for valid year
  hideYearError() {
    const yearValidation = this.useTimePeriod
      ? this.startDate.validateYear() && this.endDate.validateYear()
      : this.startDate.validateYear();

    if (yearValidation.valid === true) {
      this.yearError.textContent = "";
      this.yearError.hidden = true;
    }
  }

  // check if end date is before start date and check if only dd and yyyy have been added
  showFormatError(e) {
    const formatValidation = this.useTimePeriod
      ? this.startDate.validateFormat() && this.endDate.validateFormat()
      : this.startDate.validateFormat();

    if (formatValidation.valid == false) {
      this.formatError.textContent =
        //"Format Error: " +
        e.detail.errorMessage;
      this.formatError.hidden = false;
    }
  }

  // hide error message if no format error
  hideFormatError() {
    const formatValidation = this.useTimePeriod
      ? this.startDate.validateFormat() && this.endDate.validateFormat()
      : this.startDate.validateFormat();

    if (formatValidation.valid === true) {
      this.formatError.textContent = "";
      this.formatError.hidden = true;
    }
  }

  // check if end date < start date and give error
  evaluateTimeError(): Boolean {
    const start = this.convertToMoment(this.startDate);
    const end = this.useTimePeriod
      ? this.convertToMoment(this.endDate)
      : undefined;
    if (
      this.useTimePeriod &&
      (start[0] > end[0] ||
        (start[0] === end[0] && start[1] > end[1]) ||
        (start[0] === end[0] && start[1] === end[1] && start[2] > end[2]))
    ) {
      this.timeError.textContent =
        "Time Error: Invalid format, Start date after end date";
      this.timeError.hidden = false;
      return false;
    } else {
      this.timeError.textContent = "";
      this.timeError.hidden = true;
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