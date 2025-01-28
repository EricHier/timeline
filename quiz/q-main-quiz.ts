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
import { HelpOverlay, HelpPopup } from "@webwriter/wui/dist/helpSystem/helpSystem.js";

@customElement("main-quiz")
export class MainQuiz extends LitElementWw {
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;
  @property({ type: Array }) accessor event_startDate: TlEventData ["startDate"];
  @property({ type: Array }) accessor event_endDate: TlEventData ["endDate"];
  @property({ type: Array, attribute: true, reflect: true }) accessor appendedEvents: Array<{ date: String; title: string }> = [];
  @property({ type: Number, attribute: true, reflect: true })  accessor matchCount = 0;
  @property({ type: Number, attribute: true, reflect: true }) accessor score;
  @property({ type: Number, attribute: true, reflect: true }) accessor selectedOption = 0;
  @property({ type: Object, attribute: true, reflect: false }) accessor drag;
  @property({ type: Object, attribute: true, reflect: false }) accessor source;
  @property({ type: Object, attribute: true, reflect: false }) accessor target;
  @property({ type: Boolean, attribute: true, reflect: false }) accessor activateCheck;

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
        max-height: 50%;
        position: relative;
        display: flex;
        flex-direction: column;
        min-height: 200px;
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
      "webwriter-helpoverlay": HelpOverlay,
      "webwriter-helppopup": HelpPopup,
    };
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {}

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("title-dropped-in-section",  (e) => this.titleDropped(e));
    this.addEventListener("title-dropped-in-titles",  (e) => this.titleDropped(e));


    this.addEventListener("drag-start-title", (e) => 
    {
      this.drag = (e as CustomEvent).detail.title;
      this.source = (e as CustomEvent).detail.parent;      
    });
  }

  titleDropped(e){
    this.target = (e as CustomEvent).detail.target;
    if((this.target as HTMLElement).tagName.toLowerCase() === 'quiz-element-date' && this.target.childElementCount < 1){
      this.target.appendChild(this.drag);
      this.activateCheck = true;
    } else if((this.target as HTMLElement).tagName.toLowerCase() === "quiz-title"){
      this.target.appendChild(this.drag);
    }
    if ((this.source as HTMLElement).tagName.toLocaleLowerCase() === 'quiz-element-date') {
      const date_parent = this.source.shadowRoot.querySelector("#date-drop-section")
      date_parent.querySelector(".drop-section").removeAttribute("dropped");
    }
    this.drag.shadowRoot.querySelector(".title-border").classList.remove("dragging");

    // activate submit button
    const date_elements = Array.from(this.date_container.children);
    let isActivated = false;

    for (const element of date_elements) {
        const date_el_appended_titles = (element.shadowRoot.querySelector("slot") as HTMLSlotElement).assignedElements({ flatten: true });
        if (date_el_appended_titles.length > 0) {
            isActivated = true;
            break; 
        }
    }
    this.activateCheck = isActivated;
    this.requestUpdate();
  }
  
  render() {
    return html`
    <!-- <webwriter-helpoverlay>
      <webwriter-helppopup
        slot="popupContainer"
        target="reset-button"
      >
        <div slot="content">
          <h4>Quiz Reset</h4>
          <p>Reset the quiz answers.</p>
        </div>
      </webwriter-helppopup>

       <webwriter-helppopup
        slot="popupContainer"
        target="check-match-button"
      >
        <div slot="content">
          <h4>Quiz Submit</h4>
          <p>Click me to submit the created timeline and get the selected feedback.</p>
        </div>
      </webwriter-helppopup>
     

       <webwriter-helppopup
        slot="popupContainer"
        target="title-container"
      >
        <div slot="content">
          <h4>Quiz Titles</h4>
          <p>Guess which title fits to which timeline event and drag the title to slot. I am scrollable.</p>
        </div>
      </webwriter-helppopup>

       <webwriter-helppopup
        slot="popupContainer"
        target="date-container"
      >
        <div slot="content">
          <h4>Quiz Dates</h4>
          <p>Guess which title fits to which timeline event and drop the title to here. I am scrollable.</p>
        </div>
      </webwriter-helppopup>
    </webwriter-helpoverlay> -->

      <div class="border" id="parent">
        <div class="quiz-static-top">
          <div class="quiz-header">
            <p class="quiz-description">Drag the correct title to the drop section</p>
            <div class="button-container">
              <sl-button id="reset-button" variant="neutral" outline @click="${this.resetQuiz}"
                >Reset
              </sl-button>
              
              <sl-button
                id="check-match-button"
                variant="primary"
                outline
                ?disabled="${!this.activateCheck}"
                @click="${() => {
                  this.checkMatchAndCalculate();
                }}"
              
                >Submit
              </sl-button>
            </div>
          </div>
          <quiz-title id="title-container"></quiz-title>
          ${(this.selectedOption === 1 || this.selectedOption === 3) &&
        this.score !== undefined
          ? html`<p id="score-feedback">Your Score: ${this.score + " %"}</p>`
          : ""}
        </div>

        <div class="quiz-container">   
          <quiz-date-field id="date-container"></quiz-date-field>
        </div>
      </div>
    `;
  }

  // get selected feedback option
  retriveSelection(selected) {
    this.selectedOption = selected;
  }

  // append new events to quiz, save appended events to array
  startQuiz(events) {
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
    const quizElementsDate = this.date_container.querySelectorAll("quiz-element-date");
    const quizElementsTitle = this.date_container.querySelectorAll("quiz-element-date"); 

    this.date_container.innerHTML = '';
    this.title_container.innerHTML = '';

    this.appendedEvents.forEach((event) => {
      this.initializeTitle(event.title);
      this.initializeDate(event.date);
    });
    this.matchCount = 0;
    this.score = undefined;
    this.drag =""; 
    this.source = ""; 
    this.target ="";
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
    
    this.title_container.appendChild(quizElemenTitle);
    this.title_container.randomiseTitleOrder();
  }
  
  checkMatchAndCalculate() {
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
    const date_elements = Array.from(this.date_container.children); 
 
    date_elements.forEach((element) => {
      const date_el_appended_title = (element.shadowRoot.querySelector("slot") as HTMLSlotElement).assignedElements({ flatten: true });
      if(date_el_appended_title.length === 1){
        const title = (date_el_appended_title[0] as QuizElementTitle).title;
        const date = element.shadowRoot.querySelector(".event-date").textContent;
        const matchFound = this.appendedEvents.find(
          (event) => `${event.title}` === title && event.date === date
        );
        if (matchFound && this.selectedOption === 1){
          element.shadowRoot.querySelector(".drop-section").setAttribute("quiz-result", "match");
          date_el_appended_title[0].shadowRoot.querySelector(".title-border").setAttribute("match", "true");
          this.matchCount++;
        }
        if (matchFound && this.selectedOption === 2){
          element.shadowRoot.querySelector(".drop-section").setAttribute("quiz-result", "match");
          date_el_appended_title[0].shadowRoot.querySelector(".title-border").setAttribute("match", "true");
        }
        if (matchFound && this.selectedOption === 3){
          this.matchCount++;
        }
        if (matchFound && this.selectedOption === 4){
          this.matchCount = 0; 
        }
        if(matchFound === undefined && (this.selectedOption === 1 || this.selectedOption === 2)){
          element.shadowRoot.querySelector(".drop-section").setAttribute("quiz-result", "mismatch")
          date_el_appended_title[0].shadowRoot.querySelector(".title-border").setAttribute("mismatch", "true");
        }
      }
    })
  
    if (this.selectedOption === 1 || this.selectedOption === 3) {
      const achievedPoints = this.matchCount;
      const possiblePoints = this.appendedEvents.length;
      this.score = parseFloat(
        ((achievedPoints / possiblePoints) * 100).toFixed(2)
      );
    }
  }
}
