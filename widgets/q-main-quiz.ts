import { LitElement, html, PropertyValues, css, svg } from "lit";
import { LitElementWw } from "@webwriter/lit";
import { customElement, property, query } from "lit/decorators.js";

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

  @query("#date-container") accessor date_container: HTMLDivElement;
  @query("#title-container") accessor title_container: HTMLDivElement;

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
      .quiz-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        width: 100%;
        min-height: 200px;
      }
      .date-box, .title-box {
        border: 1px solid #ccc;
        padding: 10px;
        text-align: center;
        cursor: pointer;
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

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.resetQuiz();
  }

  render() {
    return html`
      <div class="border" id="parent">
        <h4>My Quiz</h4>
        <p>Find the matching pair</p>
        <div class="quiz-container">
          <div id="date-container"></div>
          <div id="title-container"></div>
        </div>
        <br />
        <hr />
        <br />
        <div name="found-matches"></div>
        <sl-button @click="${this.checkMatch}">Check Match</sl-button>
        <sl-button @click="${this.endQuiz}">End Quiz</sl-button>
      </div>
    `;
  }

  endQuiz() {
    this.dispatchEvent(
      new CustomEvent("request-close-quiz", {
        bubbles: true,
        composed: true,
      })
    );
  }

  resetQuiz() {
    this.date_container.innerHTML = "";
    this.title_container.innerHTML = "";
  
    this.appendedEvents = [];
  }

  getAppendedEvents() {
    return this.appendedEvents;
  }

  appendRow(date, title) {
    const date_element = document.createElement("div");
    date_element.textContent = date;
    date_element.classList.add("date-box");
    // dateBox.addEventListener("click", () => this.selectDate(date));

    const title_element = document.createElement("div");
    title_element.textContent = title
    title_element.setAttribute("draggable","true");

    title_element.classList.add("title-box");
    // titleBox.addEventListener("click", () => this.selectTitle(title));

    this.date_container.appendChild(date_element);
    this.title_container.appendChild(title_element);

    this.appendedEvents.push({ date, title });
    this.randomiseTitleOrder();
  }

  randomiseTitleOrder() {
    const titles = Array.from(this.title_container.children);
    titles.sort(() => Math.random() - 0.5);
    this.title_container.innerHTML = "";
    titles.forEach((box) => this.title_container.appendChild(box));
  }
 
  checkMatch() {
   //   const selectedDate = this.date_radio.querySelector("sl-radio[aria-checked=true]");
  //   const selectedTitle = this.title_radio.querySelector("sl-radio[aria-checked=true]");

  //   if (selectedDate && selectedTitle) {
  //     const matchFound = this.appendedEvents.some(
  //       (event) =>
  //         event.date === selectedDate.textContent &&
  //         event.title === selectedTitle.textContent
  //     );

  //     if (matchFound) {
  //       console.log("Match found");
  //       selectedDate.classList.add("match");
  //       selectedTitle.classList.add("match");

  //       selectedDate.classList.remove("mismatch");
  //       selectedTitle.classList.remove("mismatch");
  //     } else {
  //       console.log("Mismatch found");
  //       selectedDate.classList.add("mismatch");
  //       selectedTitle.classList.add("mismatch");

  //       selectedDate.classList.remove("match");
  //       selectedTitle.classList.remove("match");
  //       let timeout = setTimeout(function () {
  //         selectedDate.classList.remove("mismatch");
  //         selectedTitle.classList.remove("mismatch");
  //         timeout = 0;
  //       }, 2000);
  //     }
  //   }
  }
}
