import { LitElement, html, PropertyValues, css, svg } from "lit";
import { LitElementWw } from "@webwriter/lit";
import { customElement, property, query } from "lit/decorators.js";

import "@shoelace-style/shoelace/dist/themes/light.css";

import { SlButton } from "@shoelace-style/shoelace";
import { TlEventData, TlEventHelper} from "../tl-event-data";

import { QuizTitles } from "./q-titles";
import { QuizDateField } from "./q-date-field";

@customElement("main-quiz")
export class MainQuiz extends LitElementWw {
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;
  @property({ type: Array }) accessor event_startDate: TlEventData ["startDate"];
  @property({ type: Array }) accessor event_endDate: TlEventData ["endDate"];
  @property({ type: Array, attribute: true, reflect: true }) accessor appendedEvents: Array<{ date: String; title: string }> = [];
  @property({ type: Array, attribute: true, reflect: true }) accessor droppedTitles = [];
  @property({ type: Number, attribute: true, reflect: true })  accessor matchCount = 0;
  @property({ type: Number, attribute: true, reflect: true }) accessor score;
  @property({ type: Number, attribute: true, reflect: true }) accessor selectedOption = 0;

  @query("#date-container") accessor date_container: QuizDateField;
  @query("#title-container") accessor title_container: QuizTitles;
  @query("#score-feedback") accessor score_feedback: HTMLParagraphElement;

  static get styles() {
    return css`
      :host(:not([contenteditable="true"]):not([contenteditable=""]))
        .author-only {
        display: none;
      }
      /* Global styles for the quiz component */
:host {
  display: block; /* Ensures the component behaves as a block-level element */
  height: 100%; /* Full height to fill parent */
  overflow: hidden; /* Ensures no overflow from the component itself */
}

/* Styling for the main container that holds everything */
.border {
  display: flex;
  flex-direction: column; /* Stack children vertically */
  height: 100%; /* Full height to fill parent */
  max-height: 700px; /* Max height restriction if needed */
  width: 100%; /* Full width */
  box-sizing: border-box;
  margin-bottom: 20px;
}

/* Styling for the top part of the quiz that should be sticky */
.quiz-static-top {
  padding-left: 20px;
  padding-right: 20px;
  background-color: white; 
  padding-bottom: 25px; 
  height: 15%; /* Takes max 40% of parent container */
  max-height: 15%;
  position: sticky;
  top: 0;
  display:flex;
  flex-direction: column; 
  overflow-y: hidden; 
  box-sizing: border-box;
  z-index: 2; /* Higher index to stay above other content */
}

/* Styling for the container that holds scrollable quiz content */
.quiz-container {
  font-weight: 500;
  padding-left: 20px;
  padding-right: 20px;
  flex-grow: 1; /* Takes the rest of the space */
  /* min-height: 200px; */
  overflow-y: auto; /* Scroll if content is too much */
  z-index: 1;
  height: 50%;
  /* Lower index to allow static top to overlay */
}
/* 
      .border {
        max-height: 700px;
        width: 100%;
        /* padding-left: 20px;
        padding-right: 20px; 
        box-sizing: border-box;
        margin-bottom: 20px;
        /* overflow-y: hidden; 
        /* margin-top: 20px; 
        display: grid;
        grid-template-rows: auto auto; 
         overflow: hidden; 
      } 
     .quiz-container {
        font-weight: 500;
        padding-left: 20px;
        padding-right: 20px;
        /* display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px; */
        /* width: 100%; 
        min-height: 200px;
        max-height: inherit;
        overflow-y: scroll;
        right: 0;
        z-index:-1
        /* flex-direction: column; 
      } */
      .quiz-header {
        align-items: center; 
        display: grid;
        width: 100%;
        padding-bottom: 15px;
        justify-content: space-between;
      }
      .quiz-description {
        padding-top: 20px;
        grid-column: 1;
        grid-row: 1;
        margin-top: 0px;
        font-size: 18px;
        font-weight: 500;
        color: #484848;
      }
      .button-container {
        grid-column: 2;
        grid-row: 1;
        display: grid; 
      }
      #reset-button {
        grid-column: 1;
        grid-row: 1;
        padding-right: 15px;
        width: max-content;
      }
      #check-match-button {
        grid-column: 2;
        grid-row: 1;
        width: max-content;
      }
     #title-container {
      height:100%
      display_ flex; 
      flex-direction: column; 
      /* overflow: hidden;  */
      overflow-y: scroll; 
     }
    `;
  }

  static get scopedElements() {
    return {
      "sl-button": SlButton,

      "quiz-title": QuizTitles,
      "quiz-date-field": QuizDateField,
    };
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {}

  render() {
    return html`
      <div class="border" id="parent">
        <div class="quiz-static-top">
          <div class="quiz-header">
            <p class="quiz-description">Drag the correct title to the drop section</p>
            <div class="button-container">
              <sl-button id="reset-button" variant="neutral" outline @click="${this.resetQuiz}"
                >Reset Quiz
              </sl-button>
              
              <sl-button
                id="check-match-button"
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
          <quiz-title id="title-container"></quiz-title>
        </div>

        <div class="quiz-container">   
          <quiz-date-field id="date-container"></quiz-date-field>
        </div>

        ${(this.selectedOption === 1 || this.selectedOption === 3) &&
        this.score !== undefined
          ? html`<p id="score-feedback">Your Score: ${this.score + " %"}</p>`
          : ""}
      </div>
    `;
  }

  // get selected feedback option
  retriveSelection(selected) {
    this.selectedOption = selected;
  }

  // append new events to quiz, save appended events to array
  startQuiz(events) {
    console.log(events, " events in event container");
    const existingEvents = this.appendedEvents;
    

    const formatDate = (startDate, endDate) => {
      return endDate ? `${startDate} - ${endDate}` : startDate;
    };

    const eventsToAppend = events.filter((event) => {
      const title = event.getAttribute("event_title");
      const startdate = event.getAttribute("event_startdate");
      const enddate = event.getAttribute("event_enddate");
      const date = formatDate(startdate, enddate);
     
      const isNewEvent = !existingEvents.some(
        (existingEvent) =>
          existingEvent.title === title || existingEvent.date === date
      );
      return isNewEvent;
    });

    eventsToAppend.forEach((event) => {
      const title = event.getAttribute("event_title");
      const startDate = event.getAttribute("event_startdate");
      const endDate = event.getAttribute("event_enddate");

      const start_parsedArray = JSON.parse(startDate);
      const display_startdate = TlEventHelper.displayDate(start_parsedArray);
      var date = display_startdate;
      if(endDate) {
        const end_parsedArray = JSON.parse(endDate);
        const display_enddate = TlEventHelper.displayDate(end_parsedArray);
        date = formatDate(display_startdate, display_enddate);
      }

      this.initializeDate(date);
      this.initializeTitle(title);
      this.appendedEvents.push({ date, title });
    });
  }

  // reset quiz to restart
  resetQuiz() {
    const drop_sections =
      this.date_container.shadowRoot.querySelectorAll(".drop-section");

    drop_sections.forEach((section) => {
      section.removeAttribute("dropped");
      section.removeAttribute("quiz-result");
      section.innerHTML = "";
    });

    const title_attacher =
      this.title_container.shadowRoot.querySelector("#title");
    title_attacher.innerHTML = "";
    const date_attacher = this.date_container.shadowRoot.querySelector("#date");
    date_attacher.innerHTML = "";

    this.droppedTitles = [];
    console.log(this.appendedEvents, " appended events ");
    this.appendedEvents.forEach((event) => {
      this.initializeTitle(event.title);
      this.initializeDate(event.date);
    });

    this.matchCount = 0;
    this.score = undefined;
  }

  // set up date container + timeline + drop sections
  initializeDate(date) {
    const newDateContainer = document.createElement("div");
    newDateContainer.classList.add("new-date-container");

    const newQuizElement = document.createElement("div");
    newQuizElement.classList.add("quiz-element");
    newQuizElement.id = `quiz-element`;
    newQuizElement.setAttribute("slot", "quiz-slot");

    const dateLineQuiz = document.createElement("div");
    dateLineQuiz.classList.add("date-line");

    const date_attacher = this.date_container.shadowRoot.querySelector("#date");

    const date_element = document.createElement("div");
    date_element.textContent = date;
    date_element.classList.add("date-element");

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
    newQuizElement.appendChild(newDateContainer);
    newDateContainer.appendChild(date_element);
    newDateContainer.appendChild(dateLineQuiz);
    newQuizElement.appendChild(date_drop_section);
    date_attacher.appendChild(newQuizElement);
  }

  // set up titles
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

  // randomise the order of draggable titles 
  randomiseTitleOrder(title_attacher) {
    const titles = Array.from(title_attacher.children);
    titles.sort(() => Math.random() - 0.5);
    title_attacher.innerHTML = "";
    titles.forEach((box) => title_attacher.appendChild(box));
  }

  // save drop dragged title 
  dropTitle(titleId, dropSection, dropDate) {
    const draggedElement =
      this.title_container.shadowRoot.getElementById(titleId);

    if (draggedElement) {
      draggedElement.parentElement.removeChild(draggedElement);
      dropSection.appendChild(draggedElement);
      this.droppedTitles = [
        ...this.droppedTitles,
        {
          element: draggedElement,
          title: draggedElement.textContent,
          dropSection,
          dropDate,
        },
      ];
    }
  }

  // check date and dropped title for match 
  checkMatch() {
    this.droppedTitles.forEach(({ element, dropSection, dropDate }) => {
      const titleId = element.id;
      const matchFound = this.appendedEvents.find(
        (event) => `title-${event.title}` === titleId && event.date === dropDate
      );
      if (this.selectedOption === undefined || this.selectedOption === 0 ) {
        this.dispatchEvent(
          new CustomEvent("show-quiz-feedback-error", {
            bubbles: true,
            composed: true,
          })
        );
      }

      if (matchFound) {
        if (this.selectedOption === 1 || this.selectedOption === 2) {
          element.setAttribute("quiz-result", "match");
          dropSection.setAttribute("quiz-result", "match");
        }
        this.matchCount++;
      } else {
        if (this.selectedOption === 1 || this.selectedOption === 2) {
          element.setAttribute("quiz-result", "mismatch");
          dropSection.setAttribute("quiz-result", "mismatch");
        }
      }
    });
  }

  // calculate score of matches
  calculateScore() {
    const achievedPoints = this.matchCount;
    const possiblePoints = this.appendedEvents.length;
    this.score = parseFloat(
      ((achievedPoints / possiblePoints) * 100).toFixed(2)
    );
  }
}
