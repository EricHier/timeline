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
  @property({ type: Array, attribute: true, reflect: true }) appendedEvents: Array<{ date: string; title: string }> = [];
  @property({ type: Array, attribute: true, reflect: true }) droppedTitles =[];

  @query("#date-container") accessor date_container: QuizDateField;
  @query("#title-container") accessor title_container: QuizTitles;

  // private droppedTitles: HTMLElement[] = []; 

  static get styles() {
    return css`
      .border {
        border: 1px solid lightgray;
        border-radius: 5px;
        min-height: 700px;
        width: 100%;
        padding-left: 10px;
        padding-right: 10px;
        box-sizing: border-box;
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
        border: 1px solid grey;
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
      "quiz-title":QuizTitles,
      "quiz-date-field":QuizDateField,
    };
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.resetQuiz();
  }

  render() {
    return html`
      <div class="border" id="parent">
        <h4>My Quiz</h4>
        <p>Drag the correct title to the drop section</p>
        <div class="quiz-container">
          <quiz-date-field id="date-container"></quiz-date-field>
          <quiz-title id="title-container"></quiz-title>
        </div>
        <br />
        <div name="found-matches"></div>
        <!-- <sl-button @click="${this.checkMatch}">Check Match</sl-button> -->
        <sl-button @click="${this.resetAnswers}">Reset Quiz</sl-button>
        <sl-button @click="${this.endQuiz}">End Quiz</sl-button>
      </div>
    `;
  }

  endQuiz() {
    // this.resetQuiz();
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
    this.droppedTitles = [];

  }

  resetAnswers(){
    const title_attacher = this.title_container.shadowRoot.querySelector("#title");

    this.droppedTitles.forEach(title => {
        title_attacher.appendChild(title);
        title.removeAttribute('data-drop-status');
    });
    this.droppedTitles = [];
  }

  getAppendedEvents() {
    console.log("appendedEvents ",this.appendedEvents);
    return this.appendedEvents;
  }

  addEventElements(date, title) {
      const date_attacher = this.date_container.shadowRoot.querySelector("#date");
      const title_attacher = this.title_container.shadowRoot.querySelector("#title");

      const date_element = document.createElement("div");
      date_element.textContent = date;
      date_element.classList.add("date-border");

      const date_drop_section = document.createElement("section");
      date_drop_section.classList.add("drop-section");
      date_drop_section.id = `drop-section-${date}`;

      const title_element = document.createElement("div");
      title_element.textContent = title;
      title_element.classList.add("title-border");
      title_element.setAttribute("draggable", "true");
      // title_element.setAttribute("event_title", title);

      title_element.id = `title-${title}`; 

      title_element.addEventListener('dragstart', (event: DragEvent) => {
          
          title_element.setAttribute('data-dragging', 'true');
          event.dataTransfer?.setData("text/plain", title_element.id);
      });

      title_element.addEventListener('dragend', () => {
          title_element.removeAttribute('data-dragging');
      });

      date_drop_section.addEventListener('dragover', (event: DragEvent) => {
          event.preventDefault();
          date_drop_section.setAttribute('data-dragover', 'true');
      });

      date_drop_section.addEventListener('dragleave', () => {
          date_drop_section.removeAttribute('data-dragover');
      });

      date_drop_section.addEventListener('drop', (event: DragEvent) => {
          event.preventDefault();
          date_drop_section.removeAttribute('data-dragover');

          const data = event.dataTransfer?.getData("text");
          if (data) {
            this.handleTitleDrop(data, date_drop_section, date);
          }
      });

      date_attacher.appendChild(date_element);
      date_attacher.appendChild(date_drop_section);
      title_attacher.appendChild(title_element);

      this.appendedEvents.push({ date, title });
      this.randomiseTitleOrder(title_attacher);
  }

  handleTitleDrop(titleId, dropSection, dropDate) {
      const draggedElement = this.title_container.shadowRoot.getElementById(titleId);
      
      if (draggedElement) {
          draggedElement.parentElement.removeChild(draggedElement);
          dropSection.appendChild(draggedElement);
          this.droppedTitles.push(draggedElement);
          this.checkMatch(titleId, dropDate);
      }
  }

  checkMatch(titleId, dropDate) {
      const matchFound = this.appendedEvents.find(event => 
          `title-${event.title}` === titleId && event.date === dropDate
      );

      if (matchFound) {
          console.log('Correct drop!');
          const droppedElement = this.title_container.shadowRoot.getElementById(titleId);
          droppedElement?.setAttribute('data-drop-status', 'correct');
      } else {
          console.log('Incorrect drop!');
          const droppedElement = this.title_container.shadowRoot.getElementById(titleId);
          droppedElement?.setAttribute('data-drop-status', 'incorrect');
      }
  }

  randomiseTitleOrder(title_attacher) {
    const titles = Array.from(title_attacher.children);
    titles.sort(() => Math.random() - 0.5);
    title_attacher.innerHTML = "";
    titles.forEach((box) => title_attacher.appendChild(box));
  }
}

