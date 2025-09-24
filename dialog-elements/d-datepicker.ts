import { SlIcon, SlInput } from "@shoelace-style/shoelace";
import "@shoelace-style/shoelace/dist/themes/light.css";
import IconCalendarMonth from "@tabler/icons/outline/calendar-month.svg";
import { LitElement, css, html } from "lit";
import { customElement, property, query, queryAll } from "lit/decorators.js";

/**
 * Date picker component for timeline event dates.
 * 
 * A specialized date input component that provides separate fields for day, month, and year
 * with comprehensive validation. Designed specifically for timeline events which may include
 * historical dates including BCE (negative years).
 * 
 * Features:
 * - **Separate Input Fields**: Day, month, year inputs for precise control
 * - **Historical Date Support**: Handles BCE dates with negative years
 * - **Real-time Validation**: Validates day/month ranges and date logic
 * - **Format Validation**: Ensures proper date formatting
 * - **Visual Feedback**: Error states and validation messages
 * - **Disabled State Support**: Can be disabled for end dates in single-date mode
 * - **Accessibility**: Proper labeling and keyboard navigation
 * 
 * The component automatically validates input as users type and provides
 * immediate feedback for invalid entries.
 * 
 * @example
 * ```html
 * <!-- Basic date picker -->
 * <dialog-date-picker 
 *   label="Event Date"
 *   day="20" 
 *   month="07" 
 *   year="1969">
 * </dialog-date-picker>
 * 
 * <!-- BCE date -->
 * <dialog-date-picker 
 *   label="Ancient Event" 
 *   day="15" 
 *   month="03" 
 *   year="-44">
 * </dialog-date-picker>
 * 
 * <!-- Disabled end date -->
 * <dialog-date-picker 
 *   label="End Date" 
 *   useEndDate="true"
 *   useTimePeriod="false">
 * </dialog-date-picker>
 * ```
 * 
 * @fires show-day-validation-error - Fired when day validation fails
 * @fires hide-day-validation-error - Fired when day validation passes
 * @fires show-month-validation-error - Fired when month validation fails
 * @fires hide-month-validation-error - Fired when month validation passes
 * @fires show-year-validation-error - Fired when year validation fails
 * @fires hide-year-validation-error - Fired when year validation passes
 * @fires show-format-validation-error - Fired when date format validation fails
 * @fires hide-format-validation-error - Fired when date format validation passes
 * 
 * @cssproperty --date-input-background - Background color of date inputs
 * @cssproperty --date-input-border - Border style for date inputs
 * @cssproperty --date-input-error-border - Border style for validation errors
 * @cssproperty --disabled-background - Background color when disabled
 */
@customElement("dialog-date-picker")
export class DialogDatePicker extends LitElement {
  /**
   * Day component of the date (1-31).
   * Automatically zero-padded to 2 digits on input.
   * @attr day
   */
  @property({ type: String }) day = "";

  /**
   * Month component of the date (1-12).
   * January = 1, December = 12.
   * @attr month
   */
  @property({ type: String }) month = "";

  /**
   * Year component of the date.
   * Supports negative values for BCE dates.
   * @attr year
   * @example "2024" - 2024 CE
   * @example "-44" - 44 BCE
   */
  @property({ type: String }) year = "";

  /**
   * Complete date string (currently unused).
   * @attr date
   */
  @property({ type: String }) date = "";

  /**
   * Label text displayed above the date picker.
   * @attr label
   */
  @property({ type: String }) label = "";

  /**
   * Whether this is an end date picker in time period mode.
   * @attr use-end-date
   */
  @property({ type: Boolean }) accessor useEndDate;

  /**
   * Whether the parent dialog is in time period mode.
   * When false and useEndDate is true, this picker is disabled.
   * @attr use-time-period
   */
  @property({ type: Boolean }) accessor useTimePeriod = false;

  /**
   * Whether the date picker has validation errors.
   * @attr invalid
   */
  @property({ type: Boolean }) accessor invalid = false;

  /** All date input elements */
  @queryAll("sl-input") accessor dates;

  /** Day input element */
  @query("#day") accessor dayInput: SlInput;
  /** Month input element */
  @query("#month") accessor monthInput: SlInput;
  /** Year input element */
  @query("#year") accessor yearInput: SlInput;

  static styles = css`
    .date-div-disabled {
      background: #f7f7f8;
    }
    .date-div,
    .date-div-disabled {
      display: flex;
      flex-direction: row;
      width: 89%;
      min-width: 245px;
    }
    .date-container,
    .date-container-disabled {
      overflow: hidden;
      display: flex;
      flex-direction: row;
      align-items: center;
      border: 1px solid #d6d6da;
      border-radius: 5px;
      background: white;
      box-sizing: border-box;
      width: 100%;
      min-width: 0;
    }
    .date-container-disabled {
      background: #f7f7f8;
    }
    .divider {
      color: lightgray;
      width: 10px;
      align-self: center;
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
      text-align: center;
      min-width: 3%;
    }
    .date[disabled] {
      --sl-input-color: gray;
    }
    .date[invalid] {
      --sl-input-border-color: var(--sl-color-danger-600);
      box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-color-danger-300);
      outline: none;
      border-radius: 3px;
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
      <div>
        <label>${this.label}</label> <br />
        <div
          class="${!this.useTimePeriod && this.useEndDate
            ? "date-container-disabled"
            : "date-container"}"
        >
          <sl-icon-button src=${IconCalendarMonth} class="calender-icon">
          </sl-icon-button>
          <div
            class="${!this.useTimePeriod && this.useEndDate
              ? "date-div-disabled"
              : "date-div"}"
          >
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
              @sl-change="${this.validateForErrors}"
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
              @sl-change="${this.validateForErrors}"
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
              @sl-change="${this.validateForErrors}"
              placeholder="* YYYY"
              ?disabled="${!this.useTimePeriod && this.useEndDate}"
              maxlength="5"
              valueAsString
              required
            ></sl-input>
          </div>
        </div>
      </div>
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
      return {
        valid: false,
        errorMessage: "There is no year with more than 12 months",
      };
    }
    return { valid: true, errorMessage: "" };
  }

  // year is number with 4 digits and if "-" its 5 (todo: adjust maxlength in html)
  validateYear() {
    if ( this.year.length === 0 || (this.year.startsWith("-") && this.year.length === 1) ) {
      return { valid: false, errorMessage: "Please enter a year" };
    } else if (this.year.length === 5 && !this.year.startsWith("-")) {
      return {
        valid: false,
        errorMessage: "Please enter a year with maximum 4 digits",
      };
    }
    return { valid: true, errorMessage: "" };
  }

  validateFormat() {
    if (this.day && !this.month && this.year) {
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

    if (this.day.length >= 1) {
      this.monthInput.setAttribute("placeholder", "* MM");
    } else {
      this.monthInput.setAttribute("placeholder", "MM");
    }

    // invalid day, dispatch error message to dialog
    if (this.day.length > 0 && !dayValidation.valid) {
      this.dayInput.setAttribute("invalid", "true");

      this.dispatchEvent(
        new CustomEvent("show-day-validation-error", {
          detail: { errorMessage: dayValidation.errorMessage },
          bubbles: true,
          composed: true,
        })
      );
    } else {
      if (this.dayInput.hasAttribute("invalid")) {
        this.dayInput.removeAttribute("invalid");
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
      this.monthInput.setAttribute("invalid", "true");
      this.dispatchEvent(
        new CustomEvent("show-month-validation-error", {
          detail: { errorMessage: monthValidation.errorMessage },
          bubbles: true,
          composed: true,
        })
      );
    } else {
      if (this.monthInput.hasAttribute("invalid")) {
        this.monthInput.removeAttribute("invalid");
      }
      this.dispatchEvent(
        new CustomEvent("hide-month-validation-error", {
          bubbles: true,
          composed: true,
        })
      );
    }
    // invalid year, dispatch error message to dialog
      if (!yearValidation.valid) {

        if(yearValidation.errorMessage==="Please enter a year" && this.day.length > 0 &&  this.month.length > 0){
          setTimeout(() => {
            this.yearInput.setAttribute("invalid", "true");
          }, 4500);
        } else if(yearValidation.errorMessage==="Please enter a year with maximum 4 digits") {
          this.yearInput.setAttribute("invalid", "true");
        }
        
      this.dispatchEvent(
        new CustomEvent("show-year-validation-error", {
          detail: { errorMessage: yearValidation.errorMessage },
          bubbles: true,
          composed: true,
        })
      );
    } else {
      this.yearInput.removeAttribute("invalid");
      this.dispatchEvent(
        new CustomEvent("hide-year-validation-error", {
          bubbles: true,
          composed: true,
        })
      );
    }
    // invalid format, dispatch error message to dialog
    if (!formatValidation.valid) {
      this.dispatchEvent(
        new CustomEvent("show-format-validation-error", {
          detail: {
            errorMessage: "Error: Invalid format (dd/yyyy), enter a month.",
          },
          bubbles: true,
          composed: true,
        })
      );
      this.monthInput.setAttribute("invalid", "true");
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

    if (this.dayInput.hasAttribute("invalid")) {
      this.dayInput.removeAttribute("invalid");
    }
    if (this.monthInput.hasAttribute("invalid")) {
      this.monthInput.removeAttribute("invalid");
    }
    if (this.yearInput.hasAttribute("invalid")) {
      this.yearInput.removeAttribute("invalid");
    }
    this.monthInput.setAttribute("placeholder", "MM");

    this.dates?.forEach((input: SlInput) => {
      input.value = "";
    });
  }
}
