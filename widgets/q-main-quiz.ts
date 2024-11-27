import { LitElement, html, PropertyValues, css } from "lit";
import { LitElementWw } from "@webwriter/lit";
import { customElement, property } from "lit/decorators.js";

import "@shoelace-style/shoelace/dist/themes/light.css";

import {
  SlButton,
  SlSelect,
  SlOption,
  SlRadioGroup,
  SlRadio,
} from "@shoelace-style/shoelace";


import { WebWriterTimeline } from "../widgets/webwriter-timeline";

@customElement("main-quiz")
export class MainQuiz extends LitElementWw {
  @property({ type: Number, attribute: true, reflect: true })
  accessor tabIndex = -1;
  private appendedEvents: Array<{ date: string; title: string }> = [];

  static get styles() {
    return css`
      .border {
        border: 1px solid lightgray;
        border-radius: 5px;
        min-height: 700px;
        width: 100%;
      }

      #parent > * {
        margin-left: 10px;
        margin-right: 10px;
      }

      h4 {
        text-align: center;
      }
      :host(:not([contenteditable="true"]):not([contenteditable=""]))
        .author-only {
        display: none;
      }
      .quiz-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        width: 100%;
      }

      /* sl-radio::part(control) {
        --sl-input-radio-focus-ring-color: var(--sl-color-success-300); 
        background-color: #83b9e0;
        border: 1px solid #83b9e0
      } */
      sl-radio::part(control--checked) {
        color: white;
        background-color: #c4e4f6;
        border: 1px solid #83b9e0;
      }

    .match {
        /* background-color:#c4f6d3; */
        --sl-input-label-color: #83e08e;
    }
    .mismatch {
    /* background-color:#f6c4d0; */
        --sl-input-label-color: #e08394;
    }
    `;
  }

  static get scopedElements() {
    return {
      "webwriter-timelin": WebWriterTimeline,
      "sl-button": SlButton,
      "sl-option": SlOption,
      "sl-select": SlSelect,
      "sl-radio-group": SlRadioGroup,
      "sl-radio": SlRadio,
    };
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {}

  render() {
    return html`
      <div class="border" id="parent">
        <h4>My Quiz</h4>
        <p>Find the matching pair</p>
        <div class="quiz-container">
          <sl-radio-group
            label="Select a date"
            id="date-radio"
          ></sl-radio-group>
          <sl-radio-group
            label="Select a title"
            id="title-radio"
          ></sl-radio-group>
        </div>
        <sl-button @click="${this.randomiseTitleOrder}">Randomize Title Order</sl-button>
        <sl-button @click="${this.checkMatch}">Check Match</sl-button>

      </div>
    `;
  }

//   reset radio elements 
  resetQuiz() {
    const date_radio = this.shadowRoot?.querySelector("#date-radio");
    const title_radio = this.shadowRoot?.querySelector("#title-radio");

    while (date_radio.firstChild) {
      date_radio.removeChild(date_radio.firstChild);
    }

    while (title_radio.firstChild) {
      title_radio.removeChild(title_radio.firstChild);
    }

    this.appendedEvents = [];
  }

//   return value for added event dates and title to compare with event slot elements
  getAppendedEvents() {
    return this.appendedEvents;
  }

// add event title and date to radio groups 
  appendRow(date, title) {
    const date_radio = this.shadowRoot?.querySelector("#date-radio");
    const title_radio = this.shadowRoot?.querySelector("#title-radio");

    const date_option = document.createElement("sl-radio");
    const title_option = document.createElement("sl-radio");

    date_option.setAttribute("name", "date-tag");
    title_option.setAttribute("name", "title-tag");

    date_option.value = date;
    title_option.value = title;

    date_option.textContent = `${date}`;
    title_option.textContent = `${title}`;

    date_radio.appendChild(date_option);
    title_radio.appendChild(title_option);

    this.appendedEvents.push({ date, title });
    console.log("events added to date quiz");
  }

//   randomize title order with shuffle
  randomiseTitleOrder() {
    const title_radio = this.shadowRoot?.querySelector(
      "#title-radio"
    ) as SlRadioGroup;
    if (!title_radio) {
      console.log("No titles added to randomize order.");
      return;
    }
    const radios = Array.from(title_radio.querySelectorAll("sl-radio"));
    const titles = radios.map((radio) => radio.textContent);

    this.shuffle(titles);
    title_radio.innerHTML = "";

    titles.forEach((title) => {
      const newRadio = document.createElement("sl-radio");
      newRadio.textContent = title;
      title_radio.appendChild(newRadio);
    });
  }

  // shuffle elements
  shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }

  // check selected elements for match/mismatch and set css
  checkMatch() {
    debugger;
    const title_radio_group = this.shadowRoot?.querySelector("#title-radio") as SlRadioGroup;
    const date_radio_group = this.shadowRoot?.querySelector("#date-radio") as SlRadioGroup;

    if (!title_radio_group || !date_radio_group) {
      console.log("No elements to match");
      return;
    }

    const selectedDate = date_radio_group.querySelector("sl-radio[aria-checked=true]");
    const selectedTitle = title_radio_group.querySelector("sl-radio[aria-checked=true]");

    if (selectedDate && selectedTitle){

        const matchFound = this.appendedEvents.some(event => event.date === selectedDate.textContent && event.title === selectedTitle.textContent);
        debugger;

        if(matchFound){
            console.log("Match found");
            selectedDate.classList.add("match");
            selectedTitle.classList.add("match");

            selectedDate.classList.remove("mismatch");
            selectedTitle.classList.remove("mismatch");
        } else {
            console.log("Mismatch found");
            selectedDate.classList.add("mismatch");
            selectedTitle.classList.add("mismatch");

            selectedDate.classList.remove("match");
            selectedTitle.classList.remove("match");
            let timeout = setTimeout(function() {
                selectedDate.classList.remove('mismatch');
                selectedTitle.classList.remove('mismatch');
                timeout = 0;
            }, 2000);
        }
    }
  }

}
