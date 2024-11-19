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
  @property({ type: Boolean }) accessor endDate;
  @property({ type: Boolean }) accessor useTimePeriod = false;


  // TO DO: Adjust width of input fields if window is sized down
  static styles = css`
    .date-input {
        display: flex;
        align-items: center;
        border: 1px solid #d6d6da;
        border-radius: 5px;
        background: white;
        width: 100%;
    }
    .date-input-disabled {
        display: flex;
        align-items: center;
        border: 1px solid #d6d6da;
        border-radius: 5px;
        background: #f7f7f8;
        width: 100%;
    }

    sl-input {
        --sl-input-border-color: transparent;
        --sl-input-border-width: 0px;
        --sl-input-padding-vertical: 0;
        --sl-input-padding-horizontal: 1rem;
        max-width: 25%;
        text-align: center;
    }
    sl-input[disabled] {
        --sl-input-border-color: transparent;
        --sl-input-border-width: 0px;
        --sl-input-padding-vertical: 0;
        --sl-input-padding-horizontal: 1rem;
        --sl-input-color:transparent;
        max-width: 25%;
        text-align: center;
    }
    .divider {
        color: lightgray;
    }
    label {
        font-size: 1rem;
        font-weight: 400;
        margin-bottom: 0.5rem;
    }

    .invalid {
      --sl-input-border-color: var(--sl-color-danger-500) !important;
      --sl-input-border-width: 1px !important;
    }
  `;

  static get scopedElements() {
    return {
    };
  }

  render() {
    return html`
        <label>${this.label}</label> <br />
        <div class="${!this.useTimePeriod && this.endDate ? 'date-input-disabled' : 'date-input'}">
            <sl-icon-button src=${IconCalendarMonth}></sl-icon-button>        
            <sl-input 
              type="text" 
              id="day" 
              .value="${this.day}" 
              @sl-input="${this.updateDay}"
              @keypress="${this.validateInput}"
              placeholder="DD" 
              ?disabled="${!this.useTimePeriod&&this.endDate}" 
              maxlength="2" 
              valueAsString
            ></sl-input>
            <span class="divider">/</span>
            <sl-input 
              type="text" 
              id="month" 
              .value="${this.month}" 
              @sl-input="${this.updateMonth}"
              @keypress="${this.validateInput}"
              placeholder="MM" 
              ?disabled="${!this.useTimePeriod && this.endDate}" 
              maxlength="2" 
              valueAsString
            ></sl-input>
            <span class="divider">/</span>
            <sl-input 
              type="text" 
              id="year" 
              .value="${this.year}" 
              @sl-input="${this.updateYear}"
              @keypress="${this.validateYearInput}"
              placeholder="YYYY *"
              ?disabled="${!this.useTimePeriod && this.endDate}" 
              maxlength="5" 
              valueAsString 
              required
            ></sl-input>
        </div>
    `;
  }

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

  // day is number 01-31
  validateDay(value: string): boolean {
    const day = parseInt(value);
    const month = parseInt(this.month);
    const year = parseInt(this.year);

    if (month === 2) {
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      const maxDays = isLeapYear ? 29 : 28;

      if (day < 1) {
        console.warn("Day must be at least 1");
        return false;
      }

      // if (day > maxDays && maxDays > 29) { //use if the validation method in evaluate month is not working 
        if (day > maxDays && maxDays > 29) {
        console.warn(`February ${year} has ${maxDays} days (${isLeapYear ? 'leap year' : 'not a leap year'})`);
        return false;
      }
    } else if ([4, 6, 9, 11].includes(month)) {
      if (day < 1) {
        console.warn("Day must be at least 1");
        return false;
      }
      if (day > 30) {
        console.warn("This month has only 30 days");
        return false;
      }
    } else {
      if (day > 31) {
        console.warn("This month has only 31 days");
        return false;
      }
    }
  }


  // month is number 01-12
  validateMonth(value: string): boolean {
    const month = parseInt(value);
    
   if(month >12){
      console.warn("The entered month is invalid.");
      return false;
    }
    // if(month == 2 && parseInt(this.day) > 29){
    //   console.warn("The entered days for Feburary are invalid.");
    //   return false;
    // }
    return month >= 1 && month <= 12;
  }

  // year is number with 4 digits and if "-" its 5 (todo: adjust maxlength in html)
  validateYear(value: string): boolean {
    const year = parseInt(value);
    return value.length === 4 || (value.startsWith('-') && value.length === 5) || value.length === 0;
  }

  // get value and add 0 if day is length 1 without leading 0 
  updateDay(e) {
    this.day = e.target.value;
    
    if (this.day.length === 1) {
      this.day = `0${this.day}`;
    } else {
      this.day = this.day;
    }

    if (this.validateDay(this.day)) {
      this.focusNextField(e, 2);
    } else {
  
      // this.tlDialog.disableSaveButton();
      // console.warn("Unvalid day.");
      //  make warning visible in dialog with css + disable saving
      // this.dispatchEvent(new CustomEvent("request-invalid-date", {
      //   bubbles: true,
      //   composed: true
      // }));
    }
  }

  // get value and add 0 if day is length 1 without leading 0 
  updateMonth(e) {
    this.month = e.target.value;
    if (this.month.length === 1) {
      this.month = `0${this.month}`;
    } else {
      this.month = this.month;
    }

    if (this.validateMonth(this.month)) {
      this.focusNextField(e, 2);
    } else {
      // this.tlDialog.disableSaveButton();
      // console.warn("Unvalid month.");
      //  make warning visible in dialog with css + disable saving
      // this.dispatchEvent(new CustomEvent("request-invalid-date", {
      //   detail: { month: this.month },
      //   bubbles: true,
      //   composed: true
      // }));
    }
  }

  // get value and add 0's if day is length < 4 (TO DO what with years starting with -)
  updateYear(e) {
    this.year = e.target.value;
    
    if(!this.year.startsWith("-")){
    if (this.year.length === 1) {
      this.year = `000${this.year}`;
    } else if (this.year.length === 2) {
      this.year = `00${this.year}`;
    } else if (this.year.length === 3) {
      this.year = `0${this.year}`;
    } else {
      this.year = this.year;
    }
    } 
    
    //  TO DO: make warning visible in dialog with css + disable saving
    if (!this.validateYear(this.year)) {
    }
  }

  















  reset() {
    const dates = this.shadowRoot?.querySelectorAll("sl-input");
    this.day = this.month = this.year = this.date = "";

    dates?.forEach((input: SlInput) => {
      input.value = "";
    });
  }

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