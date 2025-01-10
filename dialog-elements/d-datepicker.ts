import { LitElement, html, css } from "lit";
import { customElement, property, query,queryAll } from "lit/decorators.js";
import IconCalendarMonth from "@tabler/icons/outline/calendar-month.svg";
import "@shoelace-style/shoelace/dist/themes/light.css";
import { SlInput } from "@shoelace-style/shoelace";
import { SlIcon } from "@shoelace-style/shoelace";


@customElement("dialog-date-picker")
export class DialogDatePicker extends LitElement {
  @property({ type: String }) day = "";
  @property({ type: String }) month = "";
  @property({ type: String }) year = "";
  @property({ type: String }) date = "";
  @property({ type: String }) label = "";
  @property({ type: Boolean }) accessor useEndDate;
  @property({ type: Boolean }) accessor useTimePeriod = false;
  @property({ type: Boolean }) accessor invalid = false;

  @queryAll("sl-input") accessor dates;


  @query("#day") accessor dayInput: SlInput;
  @query("#month") accessor monthInput: SlInput;
  @query("#year") accessor yearInput: SlInput;

  // TO DO: Adjust width of input fields if window is sized down
  static styles = css`
    .date-div,
    .date-div-disabled {
      display: flex;
      align-items: center;
      border: 1px solid #d6d6da;
      border-radius: 5px;
      background: white;
      width: 100%;
    }
    .date-div-disabled {
      background: #f7f7f8;
    }
    .divider {
      color: lightgray;
    }

    label {
      font-size: 1rem;
      font-weight: 400;
      margin-bottom: 0.5rem;
    }
    .date {
      --sl-input-border-color: transparent;
      --sl-input-border-width: 0;
      --sl-input-padding-vertical: 0;
      --sl-input-padding-horizontal: 1rem;
      max-width: 25%;
      text-align: center;
    }
    .date[disabled]{
      --sl-input-color: gray;
    }
    .date[invalid]{
      --sl-input-border-color: var(--sl-color-danger-600);
      box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-color-danger-300);
      outline: none;
    }
    .date[todo]::placeholder {
      --label-color: orange;
      font-size: 5rem;
      opacity: 1;
    }
  `;
  static get scopedElements() {
    return {
      "sl-icon": SlIcon,
      "sl-input": SlInput,
    };
  }

  render() {
    return html`
      <form class="validity-styles">
        <label>${this.label}</label> <br />
        <div
          class="${!this.useTimePeriod && this.useEndDate
            ? "date-div-disabled"
            : "date-div"}"
        >
          <sl-icon-button 
            src=${IconCalendarMonth}
            class="calender-icon">
          </sl-icon-button>
          <!-- day -->
          <sl-input
            class="date"
            type="text"
            id="day"
            .value="${this.day}"
            @sl-input="${(e: Event) => {
              const input = e.target as SlInput;
              this.day =
                input.value.length > 0 ? input.value.padStart(2, "0") : "";
            }}"
            @keypress="${this.validateInput}"
            @sl-blur="${this.validateForErrors}"
            placeholder="DD"
            ?disabled="${!this.useTimePeriod && this.useEndDate}"
            maxlength="2"
            valueAsString
          ></sl-input>
          <span class="divider">/</span>
          <!-- month -->
          <sl-input
           class="date"
            type="text"
            id="month"
            .value="${this.month}"
            @sl-input="${(e: Event) => {
              const input = e.target as SlInput;
              this.month =
                input.value.length > 0 ? input.value.padStart(2, "0") : "";
            }}"
            @keypress="${this.validateInput}"
            @sl-blur="${this.validateForErrors}"
            placeholder="MM"
            ?disabled="${!this.useTimePeriod && this.useEndDate}"
            maxlength="2"
            valueAsString
          ></sl-input>
          <span class="divider">/</span>

          <!-- year -->
          <sl-input
            class="date"
            type="text"
            id="year"
            .value="${this.year}"
            @sl-input="${(e: Event) => {
              const input = e.target as SlInput;
              this.year = input.value;
            }}"
            @keypress="${this.validateYearInput}"
            @sl-blur="${this.validateForErrors}"
            placeholder="* YYYY"
            ?disabled="${!this.useTimePeriod && this.useEndDate}"
            maxlength="5"
            valueAsString
            required
          ></sl-input>
        </div>
      </form>
    `;
  }

  // only numbers are allowed for input
  validateInput(e: KeyboardEvent) {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  }

  // for year input "-"" sign and numbers are allowed and string length is adjusted
  validateYearInput(e: KeyboardEvent) {
    if (
      !/[0-9]/.test(e.key) &&
      !(e.key === "-" && (e.target as SlInput).value === "")
    ) {
      e.preventDefault();
    }
  }

  // day is number 01-31, based on month day is restricted
  validateDay() {
    const day = parseInt(this.day);
    const month = parseInt(this.month);
    const year = parseInt(this.year);

    if (day < 1) {
      return { valid: false, errorMessage: "Days start at least by 1" };
    }

    if (day > 31) {
      return {
        valid: false,
        errorMessage: "There is no month with more than 31 days",
      };
    }

    if (month == 2) {
      const isLeapYear =
        (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      const maxDays = isLeapYear ? 29 : 28;
      if (day > maxDays) {
        if (this.year) {
          return {
            valid: false,
            errorMessage: `February ${year} has ${maxDays} days (${
              isLeapYear ? "leap year" : "not a leap year"
            })`,
          };
        } else {
          return {
            valid: false,
            errorMessage: `February has 29 days or less`,
          };
        }
      }
    } else if ([4, 6, 9, 11].includes(month)) {
      if (day > 30) {
        return { valid: false, errorMessage: "This month has only 30 days" };
      }
    }

    return { valid: true, errorMessage: "" };
  }

  // month is number 01-12
  validateMonth() {
    const month = parseInt(this.month);

    if (month < 1 || month > 12) {
      return { valid: false, errorMessage: "There is no year with more than 12 months" };
    }
    return { valid: true, errorMessage: "" };
  }

  // year is number with 4 digits and if "-" its 5 (todo: adjust maxlength in html)
  validateYear() {
    if (this.year.length === 0 || (this.year.startsWith("-") && this.year.length === 1)) {
      return { valid: false, errorMessage: "Please enter a year" };
    } else if (this.year.length > 4 && !this.year.startsWith("-")) {
      return { valid: false, errorMessage: "Please enter a year with maximum 4 digits", };
    } 
    return { valid: true, errorMessage: "" };
  }

  validateFormat(){
    if(this.day && !this.month && this.year){
      return { valid: false, errorMessage: "Please enter a year" };
    }
    return { valid: true, errorMessage: "" };
  }

  // validate day and month input, TO DO: fix css for input fields when invalid
  validateForErrors() {
    const dayValidation = this.validateDay();
    const monthValidation = this.validateMonth();
    const yearValidation = this.validateYear();
    const formatValidation = this.validateFormat();

    if(this.day.length >= 1){
      this.monthInput.setAttribute("placeholder","* MM");
    } else {
      this.monthInput.setAttribute("placeholder", "MM");
    }


    // invalid day, dispatch error message to dialog
    if (this.day.length > 0 && !dayValidation.valid) {
      this.dayInput.setAttribute('invalid','true');

      this.dispatchEvent(
        new CustomEvent("show-day-validation-error", {
          detail: { errorMessage: dayValidation.errorMessage },
          bubbles: true,
          composed: true,
        })
      );
    } else {
      if(this.dayInput.hasAttribute('invalid')){
        this.dayInput.removeAttribute('invalid');
      }
      this.dispatchEvent(
        new CustomEvent("hide-day-validation-error", {
          bubbles: true,
          composed: true,
        })
      );
    }

    // invalid month, dispatch error message to dialog
    if (this.month.length > 0 && !monthValidation.valid) {
      this.monthInput.setAttribute('invalid', 'true');
      this.dispatchEvent(
        new CustomEvent("show-month-validation-error", {
          detail: { errorMessage: monthValidation.errorMessage },
          bubbles: true,
          composed: true,
        })
      );
    } else {
      if(this.monthInput.hasAttribute('invalid')){
        this.monthInput.removeAttribute('invalid');
      }
      this.dispatchEvent(
        new CustomEvent("hide-month-validation-error", {
          bubbles: true,
          composed: true,
        })
      );
    }
     // invalid year, dispatch error message to dialog
     if (this.day.length > 0 && this.month.length > 0 && !yearValidation.valid) {
      this.yearInput.setAttribute('invalid','true');
      this.dispatchEvent(
        new CustomEvent("show-year-validation-error", {
          detail: { errorMessage: yearValidation.errorMessage },
          bubbles: true,
          composed: true,
        })
      );
    } else {
      this.yearInput.removeAttribute('invalid');
      this.dispatchEvent(
        new CustomEvent("hide-year-validation-error", {
          bubbles: true,
          composed: true,
        })
      );
    }
    // invalid format, dispatch error message to dialog
    if(!formatValidation.valid){
      this.dispatchEvent(
        new CustomEvent("show-format-validation-error", {
          detail: { errorMessage: "Error: Invalid format (dd/yyyy), enter a month." },
          bubbles: true,
          composed: true,
        })
      );
      this.monthInput.setAttribute("invalid","true");
    } else {
      this.monthInput.removeAttribute("invalid");
      this.dispatchEvent(
        new CustomEvent("hide-format-validation-error", {
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  // reset all values, reset method used in dialog
  reset() {
    this.day = this.month = this.year = this.date = "";

    if(this.dayInput.hasAttribute('invalid')){
      this.dayInput.removeAttribute('invalid');
    }
    if(this.monthInput.hasAttribute('invalid')){
      this.monthInput.removeAttribute('invalid');
    }
    if(this.yearInput.hasAttribute('invalid')){
      this.yearInput.removeAttribute('invalid');
    }
    if(this.yearInput.hasAttribute('todo')){
      this.yearInput.removeAttribute('todo');
    }
    this.monthInput.setAttribute("placeholder", "MM");

    this.dates?.forEach((input: SlInput) => {
      input.value = "";
    });
  }

  // optional: focus on next input field
}
