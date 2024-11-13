import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import IconCalendarMonth from "@tabler/icons/outline/calendar-month.svg";
import "@shoelace-style/shoelace/dist/themes/light.css";
import {
  SlInput,
} from "@shoelace-style/shoelace";
import { TimelineDialog } from './tl-dialog';
import { EventManager } from './event-manager';

@customElement('custom-date-picker')
export class CustomDatePicker extends LitElement {
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
  `;

  static get scopedElements() {
    return {
      "sl-input": SlInput,
    };
  }

  render() {
    return html`
        <label>${this.label}</label> <br />
        <div class="${!this.useTimePeriod && this.endDate ? 'date-input-disabled' : 'date-input'}">
            <sl-icon-button src=${IconCalendarMonth}></sl-icon-button>        
            <sl-input type="text" id="day" .value="${this.day}" @sl-input="${this.updateDay}" placeholder="DD" ?disabled="${!this.useTimePeriod&&this.endDate}" maxlength="2" valueAsString ></sl-input>
            <span class="divider">/</span>
            <sl-input type="text" id="month" .value="${this.month}" @sl-input="${this.updateMonth}" placeholder="MM" ?disabled="${!this.useTimePeriod && this.endDate}" maxlength="2" valueAsString></sl-input>
            <span class="divider">/</span>
            <sl-input type="text" id="year" .value="${this.year}" @sl-input="${this.updateYear}" placeholder="YYYY" ?disabled="${!this.useTimePeriod && this.endDate}" maxlength="4" valueAsString required></sl-input>
        </div>
    `;
  }

  reset(){
    const dates = this.shadowRoot?.querySelectorAll("sl-input");
    this.day = this.month = this.year = this.date="";

    dates.forEach((input:SlInput) => {
        input.value= ""; 
    });
  }

  updateDay(e) {
    this.day = e.target.value;
    // this.updateDate();
    this.focusNextField(e, 2);
  }

  updateMonth(e) {
    this.month = e.target.value;
    // this.getMonthName();
    // this.updateDate();
    this.focusNextField(e, 2);
  }

  updateYear(e) {
    this.year = e.target.value;
    // this.updateDate();
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

  // updateDate() {
  //   const partial_date = [];
    
  //   if (this.day) {
  //     partial_date.push(this.day);
  //   }
  //   if (this.month) {
  //     partial_date.push(this.getMonthName());
  //   }
  //   if (this.year) {
  //     partial_date.push(this.year);
  //   }
  //   this.date = partial_date.join('. ');
  // }

  // getMonthName() {
  //   const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  //   return months[parseInt(this.month) - 1] || this.month;
  // }

  
}