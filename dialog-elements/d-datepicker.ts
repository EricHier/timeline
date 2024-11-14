import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import IconCalendarMonth from "@tabler/icons/outline/calendar-month.svg";
import "@shoelace-style/shoelace/dist/themes/light.css";
import {
  SlInput,
} from "@shoelace-style/shoelace";
import { TimelineDialog } from '../tl-dialog';
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

  // only numbers allowed for input
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
    return day >= 1 && day <= 31;
  }

  // month is number 01-12
  validateMonth(value: string): boolean {
    const month = parseInt(value);
    return month >= 1 && month <= 12;
  }

  // year is number with 4 digits and if "-" its 5 (todo: adjust maxlength in html)
  validateYear(value: string): boolean {
    const year = parseInt(value);
    return value.length === 4 || (value.startsWith('-') && value.length === 5) || value.length === 0;
  }

  // TO DO: Add validation method to check for leap years:

  // get value and add 0 if day is length 1 without leading 0 
  updateDay(e) {
    this.day = e.target.value;
    
    if (this.day.length === 1) {
      this.day = `0${this.day}`;
    } else {
      this.day = this.day;
    }

    // TO DO: add warning if invalid 

    if (this.validateDay(this.day)) {
      this.focusNextField(e, 2);
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

    // TO DO: add warning if invalid 

    if (this.validateMonth(this.month)) {
      this.focusNextField(e, 2);
    }
  }

  updateYear(e) {
    this.year = e.target.value;
    
    // TO DO: add warning if invalid 
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