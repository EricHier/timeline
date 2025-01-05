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
import { QuizTitles } from "./q-titles";
import { QuizDateField } from "./q-date-field";

@customElement("main-quiz")
export class MainQuiz extends LitElementWw {
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;
  @property({ type: Array, attribute: true, reflect: true }) accessor appendedEvents: Array<{ date: string; title: string }> = [];
  @property({ type: Array, attribute: true, reflect: true }) accessor droppedTitles = [];
  @property({ type: Number, attribute: true, reflect: true }) accessor matchCount = 0;
  @property({ type: Number, attribute: true, reflect: true }) accessor score;
  @property({ type: Number, attribute: true, reflect: true }) accessor selectedOption = 0;
  @property({ type: Boolean, attribute: true, reflect: true })  accessor noNeedToReset = true;

  @query("#date-container") accessor date_container: QuizDateField;
  @query("#title-container") accessor title_container: QuizTitles;
  @query("#score-feedback") accessor score_feedback: HTMLParagraphElement;
  @query("#check-button") accessor check_button: SlSelect;
  // @query("#formatError") accessor formatError;

  static get styles() {
    return css`
      .border {
        height: 500px;
        width: 100%;
        padding-left: 20px;
        padding-right: 20px;
        box-sizing: border-box;
        margin-bottom: 20px;
        margin-top: 20px;
      }
      h4 {
        text-align: center;
      }
      .quiz-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        width: 100%;
        min-height: 200px;
        flex-direction: column;
      }
      .quiz-border {
        font-weight: 500;
      }
      .date-box,
      .title-box {
        border: 1px solid #ccc;
        padding: 10px;
        text-align: center;
        cursor: pointer;
      }
      .quiz-options {
        display: flex;
      }
      .quiz-options {
        width: 100%;
        margin-bottom: 5px;
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
        padding-top: 15px;
      }
      .button-left-container {
        display: flex;
        justify-content: start;
        align-items: center;
        width: 100%;
      }
      .button-spacer {
        padding-right: 5px;
      }
      :host(:not([contenteditable="true"]):not([contenteditable=""]))
        .author-only {
        display: none;
      }
      .quiz-element{
        width: 100%;
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
      "quiz-title": QuizTitles,
      "quiz-date-field": QuizDateField,
    };
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {}

  render() {
    return html`
      <div class="border" id="parent">
        <div class="quiz-border">
          <p>Drag the correct title to the drop section</p>
          <div class="quiz-container">
            <quiz-date-field id="date-container"></quiz-date-field>
            <quiz-title id="title-container"></quiz-title>
          </div>
        </div>

        ${(this.selectedOption === 1 || this.selectedOption === 3) &&
        this.score !== undefined
          ? html`<p id="score-feedback">Your Score: ${this.score + " %"}</p>`
          : ""}

        <div class="button-container">
          <div class="button-left-container">
            <sl-button variant="neutral" outline @click="${this.resetQuiz}"
              >Reset Quiz
            </sl-button>
          </div>

          <sl-button
            id="check-matches"
            variant="primary"
            outline
            @click="${() => {
              this.checkMatch();
              this.calculateScore();
            }}"
            ?disabled=${this.droppedTitles.length === 0}
            >Check Match
          </sl-button>
        </div>
      </div>
    `;
  }

  startQuiz(events) {
    const existingEvents = this.appendedEvents;
    const eventsToAppend = events.filter((event) => {
      const title = event.getAttribute("event_title");
      const startdate = event.getAttribute("event_startdate");
      const enddate = event.getAttribute("event_enddate");
      const date = startdate + " - " + enddate;
      const newEvent = !existingEvents.some(
        (existingEvent) =>
          existingEvent.title === title || existingEvent.date === date
      );
      return newEvent;
    });

    eventsToAppend.forEach((event) => {
      let date = event.getAttribute("event_startDate");
      const title = event.getAttribute("event_title");
      this.addEventElements(date, title);
    });
  }

  resetQuiz() {
    this.resetAnswers();
    // this.date_container.innerHTML = "";
    // this.title_container.innerHTML = "";
    this.selectedOption = 0;
    // this.appendedEvents = [];
    // this.droppedTitles = [];
  }

  resetAnswers() {
    const drop_section =
      this.date_container.shadowRoot.querySelectorAll(".drop-section");
    drop_section.forEach((section) => {
      section.removeAttribute("dropped");
      section.removeAttribute("quiz-result");
      section.innerHTML = "";
    });

    const date_attacher = this.date_container.shadowRoot.querySelector("#date");
    if(date_attacher) {
      date_attacher.innerHTML = "";
    }
    this.appendedEvents.forEach((event) => {
      this.initializeDate(event.date);
    });

    const title_attacher =
      this.title_container.shadowRoot.querySelector("#title");
    title_attacher.innerHTML = "";
    this.appendedEvents.forEach((event) => {
      this.initializeTitle(event.title);
    });
    this.droppedTitles = [];
    this.matchCount = 0;
    this.score = 0;
    this.noNeedToReset = true;
  }

  addEventElements(date, title) {
    this.initializeDate(date);
    this.initializeTitle(title);
    this.appendedEvents.push({ date, title });
  }

  
  initializeDate(date) {
    const newQuizElement = document.createElement("div");
    newQuizElement.classList.add("quiz-element");
    newQuizElement.id = `quiz-element`;
    newQuizElement.setAttribute("slot", "quiz-slot");

    // const date_attacher = this.date_container.shadowRoot.querySelector("#date");

    const date_element = document.createElement("div");
    date_element.textContent = date;
    date_element.classList.add("date-border");

    const date_drop_section = document.createElement("section");
    date_drop_section.classList.add("drop-section");
    date_drop_section.id = `drop-section-${date}`;

    date_drop_section.addEventListener("dragover", (event: DragEvent) => {
      event.preventDefault();
      date_drop_section.setAttribute("dragover", "true");
    });

    date_drop_section.addEventListener("dragleave", () => {
      date_drop_section.removeAttribute("dragover");
    });

    date_drop_section.addEventListener("drop", (event: DragEvent) => {
      event.preventDefault();
      date_drop_section.removeAttribute("dragover");
      date_drop_section.setAttribute("dropped", "true");

      const data = event.dataTransfer?.getData("text");
      if (data) {
        this.dropTitle(data, date_drop_section, date);
      }
    });

    this.date_container.appendChild(newQuizElement);
    newQuizElement.appendChild(date_element);
    newQuizElement.appendChild(date_drop_section);
  }

  initializeTitle(title) {
    const title_attacher =
      this.title_container.shadowRoot.querySelector("#title");

    const title_element = document.createElement("div");
    title_element.textContent = title;
    title_element.classList.add("title-border");
    title_element.setAttribute("draggable", "true");

    title_element.id = `title-${title}`;

    title_element.addEventListener("dragstart", (event: DragEvent) => {
      title_element.setAttribute("dragging", "true");
      event.dataTransfer?.setData("text/plain", title_element.id);
    });

    title_element.addEventListener("dragend", () => {
      title_element.removeAttribute("dragging");
    });

    title_attacher.appendChild(title_element);
    this.randomiseTitleOrder(title_attacher);
  }

  dropTitle(titleId, dropSection, dropDate) {
    const draggedElement =
      this.title_container.shadowRoot.getElementById(titleId);

    if (draggedElement) {
      draggedElement.parentElement.removeChild(draggedElement);
      dropSection.appendChild(draggedElement);
      this.droppedTitles = [
        ...this.droppedTitles,
        { element: draggedElement, dropSection, dropDate },
      ];
    }
  }

  checkMatch() {
    this.droppedTitles.forEach(({ element, dropSection, dropDate }) => {
      const titleId = element.id;
      const matchFound = this.appendedEvents.find(
        (event) => `title-${event.title}` === titleId && event.date === dropDate
      );
      if (this.selectedOption === undefined) {
        // this.formatError.hidden = false;
        // console.log("undefined option, show error");
      }

      if (matchFound) {
        if (this.selectedOption === 1 || this.selectedOption === 2) {
          element.setAttribute("quiz-result", "match");
          dropSection.setAttribute("quiz-result", "match");
          // this.formatError.hidden = true;
        }
        this.matchCount++;
      } else {
        if (this.selectedOption === 1 || this.selectedOption === 2) {
          element.setAttribute("quiz-result", "mismatch");
          dropSection.setAttribute("quiz-result", "mismatch");
          // this.formatError.hidden = true;
        }
      }
    });
  }

  randomiseTitleOrder(title_attacher) {
    const titles = Array.from(title_attacher.children);
    titles.sort(() => Math.random() - 0.5);
    title_attacher.innerHTML = "";
    titles.forEach((box) => title_attacher.appendChild(box));
  }

  calculateScore() {
    if (this.noNeedToReset) {
      const achievedPoints = this.matchCount;
      const possiblePoints = this.appendedEvents.length;
      this.score = parseFloat(
        ((achievedPoints / possiblePoints) * 100).toFixed(2)
      );
      this.noNeedToReset = false;
    } else {
      this.score = this.score;
    }
  }

  retriveSelection(selected) {
    this.selectedOption = selected;
  }
}
