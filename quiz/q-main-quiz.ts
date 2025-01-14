import { LitElement, html, PropertyValues, css, svg } from "lit";
import { LitElementWw } from "@webwriter/lit";
import { customElement, property, query } from "lit/decorators.js";

import "@shoelace-style/shoelace/dist/themes/light.css";

import { SlButton } from "@shoelace-style/shoelace";
import { TlEventData, TlEventHelper} from "../tl-event-data";

import { QuizElementDate } from "./q-element-date"

import { QuizTitles } from "./q-titles";
import { QuizDateField } from "./q-date-field";
import { eventListeners } from "@popperjs/core";
import { QuizElementTitle } from "./q-element-title";

@customElement("main-quiz")
export class MainQuiz extends LitElementWw {
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;
  @property({ type: Array }) accessor event_startDate: TlEventData ["startDate"];
  @property({ type: Array }) accessor event_endDate: TlEventData ["endDate"];
  @property({ type: Array, attribute: true, reflect: true }) accessor appendedEvents: Array<{ date: String; title: string }> = [];
  @property({ type: Array, attribute: true, reflect: true }) accessor droppedTitles=[];
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
     
      :host {
        display: block; 
        height: 100%; 
        overflow: hidden; 
      }

      .border {
        display: flex;
        flex-direction: column; 
        height: 100%; 
        max-height: 700px; 
        width: 100%; 
        box-sizing: border-box;
        /* margin-bottom: 20px; */
      }

      .quiz-static-top {
        padding-left: 20px;
        padding-right: 20px;
        background-color: white; 
        padding-bottom: 25px; 
        height: 15%; 
        max-height: 15%;
        position: sticky;
        top: 0;
        display:flex;
        flex-direction: column; 
        overflow-y: hidden; 
        box-sizing: border-box;
        z-index: 2; 
      }

      .quiz-container {
        font-weight: 500;
        padding-left: 20px;
        padding-right: 20px;
        flex-grow: 1;
        overflow-y: auto; 
        z-index: 1;
        height: 50%;
      }

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
      overflow-y: scroll; 
     }
    `;
  }

  static get scopedElements() {
    return {
      "sl-button": SlButton,
      "quiz-title": QuizTitles,
      "quiz-date-field": QuizDateField,
      "quiz-element-date": QuizElementDate,
      "quiz-element-title": QuizElementTitle,
    };
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {}

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("title-dropped", this.dropTitle);
  }
  
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
                  this.checkMatchAndCalculate();
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
    const quizElemenDate = document.createElement("quiz-element-date") as QuizElementDate;
    quizElemenDate.date = date;
  
    const date_attacher = this.date_container.shadowRoot.querySelector("#date");
    quizElemenDate.setAttribute("slot", "quiz-element-date");

    this.date_container.appendChild(quizElemenDate);
  }

  // set up titles
  initializeTitle(title) {
    const quizElemenTitle = document.createElement("quiz-element-title") as QuizElementTitle;
    quizElemenTitle.title = title;
    
    quizElemenTitle.setAttribute("slot", "quiz-element-title");

    this.title_container.appendChild(quizElemenTitle);
    this.title_container.randomiseTitleOrder();
  }

  // TO DO: move to q-titles and save droppedTitles array here 
  // save drop dragged title 
  // dropTitle(titleId, dropSection, dropDate) {
  //   const draggedElement =
  //     this.title_container.shadowRoot.getElementById(titleId);

  //   if (draggedElement) {
  //     draggedElement.parentElement.removeChild(draggedElement);
  //     dropSection.appendChild(draggedElement);
  //     this.droppedTitles = [
  //       ...this.droppedTitles,
  //       {
  //         element: draggedElement,
  //         title: draggedElement.textContent,
  //         dropSection,
  //         dropDate,
  //       },
  //     ];
  //   }
  // }

  dropTitle(event: CustomEvent) {
    debugger;
    const { data_content, dropSection , dropSection_id } = event.detail;
    this.droppedTitles = [
      ...this.droppedTitles,
      {
        title: data_content,
        section: dropSection,
        section_date: dropSection_id,
      },
    ];
  }
  
  checkMatchAndCalculate() {
    debugger;
    this.matchCount = 0;
    this.score = 0;

    if (this.selectedOption === undefined || this.selectedOption === 0) {
      this.dispatchEvent(
        new CustomEvent("show-quiz-feedback-error", {
          bubbles: true,
          composed: true,
        })
      );
      return;
    }
  
    this.droppedTitles.forEach(({ title, section, section_date}) => {
      const matchFound = this.appendedEvents.find(
        (event) => `${event.title}` === title && event.date === section_date
      );
  
      if (matchFound) {
        if (this.selectedOption === 1 || this.selectedOption === 2) {
          if (title && section) {
            // title.setAttribute("quiz-result", "match");
            section.setAttribute("quiz-result", "match");
          }
        }
        this.matchCount++;
      } else {
        if (this.selectedOption === 1 || this.selectedOption === 2) {
          if (title && section) {
            // title.setAttribute("quiz-result", "mismatch");
            section.setAttribute("quiz-result", "mismatch");
          }
        }
      }
    });
  
    if (this.selectedOption === 1 || this.selectedOption === 3) {
      const achievedPoints = this.matchCount;
      const possiblePoints = this.appendedEvents.length;
      this.score = parseFloat(
        ((achievedPoints / possiblePoints) * 100).toFixed(2)
      );
    }
  }

  // old
  // dropTitle(event: CustomEvent) {
  //   const { data, dropSection } = event.detail;
  
  //   this.droppedTitles = [
  //     ...this.droppedTitles,
  //     {
  //       title: data.dataTransfer?.getData("text"),
  //       title_element: data,
  //       dropSection: dropSection.id,
  //       dropSection_element: dropSection,
  //     },
  //   ];
  // }

  // // check date and dropped title for match 
  // checkMatch() {
  //   debugger;
  //   this.droppedTitles.forEach(({ title, title_element, dropSection, dropSection_element }) => {
  //     // console.log(title, title_element, dropSection, dropSection_element, " dropped Titles");
  //     const matchFound = this.appendedEvents.find(
  //       (event) => `${event.title}` === title && event.date === dropSection
  //     );
  //     if (this.selectedOption === undefined || this.selectedOption === 0 ) {
  //       this.dispatchEvent(
  //         new CustomEvent("show-quiz-feedback-error", {
  //           bubbles: true,
  //           composed: true,
  //         })
  //       );
  //     }
  //     if (matchFound) {
  //       if (this.selectedOption === 1 || this.selectedOption === 2) {
  //         title_element.setAttribute("quiz-result", "match");
  //         dropSection_element.setAttribute("quiz-result", "match");
  //         console.log("match found", matchFound);
  //       }
  //       this.matchCount++;
  //     } else {
  //       if (this.selectedOption === 1 || this.selectedOption === 2) {
  //         title_element.setAttribute("quiz-result", "mismatch");
  //         dropSection_element.setAttribute("quiz-result", "mismatch");
  //       }
  //       console.log("no match found", matchFound);
  //     }
  //   });
  // }

  // // calculate score of matches
  // calculateScore() {
  //   const achievedPoints = this.matchCount;
  //   const possiblePoints = this.appendedEvents.length;
  //   this.score = parseFloat(
  //     ((achievedPoints / possiblePoints) * 100).toFixed(2)
  //   );
  // }
}
