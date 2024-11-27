import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import IconCalendarMonth from "@tabler/icons/outline/calendar-month.svg";
import "@shoelace-style/shoelace/dist/themes/light.css";
import {
  SlInput,
} from "@shoelace-style/shoelace";
import{ TimelineDialog} from "../tl-dialog";
import { EventManager } from '../event-manager';

@customElement('dialog-date-picker')
export class DialogDatePicker extends LitElement {
  @property({ type: String }) day = "";
  @property({ type: String }) month = "";
  @property({ type: String }) year = "";
  @property({ type: String }) date = "";
  @property({ type: String }) label = "";
  @property({ type: Boolean }) accessor useEndDate;
  @property({ type: Boolean }) accessor useTimePeriod = false;
  @property({ type: Boolean }) accessor invalid = false;


  // TO DO: Adjust width of input fields if window is sized down
  static styles = css`
    .date-input, .date-input-disabled {
      display: flex;
      align-items: center;
      border: 1px solid #d6d6da;
      border-radius: 5px;
      background: white;
      width: 100%;
    }
    .date-input-disabled {
      background: #f7f7f8;
    }

    sl-input {
      --sl-input-border-color: transparent;
      --sl-input-border-width: 0;
      --sl-input-padding-vertical: 0;
      --sl-input-padding-horizontal: 1rem;
      max-width: 25%;
      text-align: center;
    }

    sl-input[disabled] {
      --sl-input-color: gray;
    }

    .divider {
      color: lightgray;
    }

    label {
      font-size: 1rem;
      font-weight: 400;
      margin-bottom: 0.5rem;
    }

    sl-input[date-invalid]::part(base){
      border-color: var(--sl-color-danger-600);
      box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-color-danger-300);
    }
    /* sl-input[date-valid]::part(base){
      border-color: var(--sl-color-success-600);
      box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-color-success-300);
    } */
    /* sl-input[data-invalid]::part(base) {
      border-color: var(--sl-color-danger-600);
    }

    sl-input[data-invalid]::part(form-control-label) {
      color: var(--sl-color-danger-700);
    }

    sl-input:focus-within[data-invalid]::part(base) {
      border-color: var(--sl-color-danger-600);
      box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-color-danger-300);
    }

    sl-input[data-valid]::part(base) {
      border-color: var(--sl-color-success-600);
    }

    sl-input[data-valid]::part(form-control-label) {
      color: var(--sl-color-success-700);
    }

    sl-input:focus-within[data-valid]::part(base) {
      border-color: var(--sl-color-success-600);
      box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-color-success-300);
    } */
  `;
  static get scopedElements() {
    return {
    };
  }

  render() {
    return html`
      <form class="validity-styles">
        <label>${this.label}</label> <br />
        <div class="${!this.useTimePeriod && this.useEndDate ? 'date-input-disabled' : 'date-input'}">
            <sl-icon-button src=${IconCalendarMonth}></sl-icon-button>        
            <sl-input 
              class="${this.day.length > 0 && this.validateDay().valid == false  ? 'date-invalid' : ''}"
              type="text" 
              id="day" 
              .value="${this.day}" 
              @sl-input="${(e: Event) => {
                const input = e.target as SlInput;
                this.day = input.value.length > 0 ? input.value.padStart(2, "0") : "";
              }}"
              @keypress="${this.validateInput}"
              @sl-blur="${this.validateForErrors}"
              placeholder="DD" 
              ?disabled="${!this.useTimePeriod&&this.useEndDate}" 
              maxlength="2" 
              valueAsString
            ></sl-input>
            <span class="divider">/</span>
            <sl-input 
              class="${this.month.length > 0 && this.validateMonth().valid == false  ? 'date-invalid' : ''}"
              type="text" 
              id="month" 
              .value="${this.month}" 
              @sl-input="${(e: Event) => {
                const input = e.target as SlInput;
                this.month =  input.value.length > 0 ? input.value.padStart(2, "0") : "";
              }}"
              @keypress="${this.validateInput}"
              @sl-blur="${this.validateForErrors}"
              placeholder="MM" 
              ?disabled="${!this.useTimePeriod && this.useEndDate}" 
              maxlength="2" 
              valueAsString
            ></sl-input>
            <span class="divider">/</span>
            <sl-input 
              class="${this.year.length > 0 && !this.validateYear() ? 'date-invalid' : ''}"
              type="text" 
              id="year" 
              .value="${this.year}" 
              @sl-input="${(e: Event) => {
                const input = e.target as SlInput;
                this.year = input.value.padStart(4, "0");
              }}"
              @keypress="${this.validateYearInput}"
              @sl-blur="${this.validateForErrors}"
              placeholder="YYYY *"
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
    if (!/[0-9]/.test(e.key) && !(e.key === '-' && (e.target as SlInput).value === '')) {
      e.preventDefault();
    }
  }

  // day is number 01-31, based on month day is restricted 
  validateDay() {
    const day = parseInt(this.day);
    const month = parseInt(this.month);
    const year = parseInt(this.year);

    if (day < 1){
      return { valid: false, errorMessage: "Days start at least by 1" };
    }

    if ( day > 31){
      return { valid: false, errorMessage: "There is no month with more than 31 days" };
    }

    if(month == 2) {
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      const maxDays = isLeapYear ? 29 : 28;
      if (day > maxDays) {
        if (this.year){
          return { valid: false, errorMessage:`February ${year} has ${maxDays} days (${isLeapYear ? 'leap year' : 'not a leap year'})` };

        } else {
          return { valid: false, errorMessage:`February has ${maxDays} days or less` };
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
    
    if(month < 1 || month > 12){
      return { valid: false, errorMessage: "The entered month is invalid" };
    }
    return { valid: true, errorMessage: "" };
  }

  // year is number with 4 digits and if "-" its 5 (todo: adjust maxlength in html)
  validateYear() {
    if(this.year.length == 0 || (this.year.startsWith('-') && this.year.length == 1)){
      return { valid: false, errorMessage: "Please enter a year" };
    } else if (this.year.length >= 4 && !this.year.startsWith('-')){
      return { valid: false, errorMessage: "Please enter a year with maximum 4 digits" };
    }
    return { valid: true, errorMessage: "" };
  }

  // validate day and month input, TO DO: fix css for input fields when invalid
  validateForErrors() {
    const dayInput = this.shadowRoot.querySelector('#day') as SlInput;
    const monthInput = this.shadowRoot.querySelector('#month') as SlInput;

    const dayValidation = this.validateDay();
    const monthValidation = this.validateMonth();
   
    // invalid day, dispatch error message to dialog
    if (this.day.length > 0 && !dayValidation.valid) {
      // dayInput.setAttribute('data-invalid','true');

      this.dispatchEvent(new CustomEvent('show-day-validation-error', {
        detail: { errorMessage: dayValidation.errorMessage },
        bubbles: true, 
        composed: true 
      }));

    } else {
      // if(dayInput.hasAttribute('data-invalid')){
      //   dayInput.removeAttribute('data-invalid');
      // }

      this.dispatchEvent(new CustomEvent('hide-day-validation-error', {
        bubbles: true, 
        composed: true 
      }));
    }

    // invalid month, dispatch error message to dialog
    if (this.month.length > 0 && !monthValidation.valid) {
      // monthInput.setAttribute('data-invalid', 'true');
      // monthInput.removeAttribute('data-valid');

      this.dispatchEvent(new CustomEvent('show-month-validation-error', {
        detail: { errorMessage: monthValidation.errorMessage },
        bubbles: true, 
        composed: true 
      }));
    } else {
      // monthInput.removeAttribute('data-invalid');
      // monthInput.setAttribute('data-valid', 'true');

      this.dispatchEvent(new CustomEvent('hide-month-validation-error', {
        bubbles: true, 
        composed: true 
      }));
    }
  }

  // reset all values, reset method used in dialog 
  reset() {
    const dates = this.shadowRoot?.querySelectorAll("sl-input");
    this.day = this.month = this.year = this.date = "";

    dates?.forEach((input: SlInput) => {
      input.value = "";
    });
  }

  // focus on next input field, TO DO: update with current state (unused now)
  focusNextField(e, maxLength) {
    const input = e.target;
    if (input.value.length >= maxLength) {
      let nextInput = input.nextElementSibling;
      while (nextInput && !nextInput.matches('sl-input')) {
        nextInput = nextInput.nextElementSibling;
      }
      if (nextInput && nextInput.matches('sl-input')) {
        nextInput.focus();
      }
    }
  }
}