import { LitElement, html, PropertyValues, css } from "lit";
import { LitElementWw } from "@webwriter/lit";
import { customElement, property, query } from "lit/decorators.js";

import "@shoelace-style/shoelace/dist/themes/light.css";

import { SlButton, SlDialog, SlIcon, SlInput } from "@shoelace-style/shoelace";
import { EventController } from "../tl-event-controller";
import { EventContainer } from "../event-container";
import { TimelineDialog } from "../tl-dialog";
import { EventManager } from "../event-manager";
import { MainQuiz } from "../quiz/q-main-quiz";
import { TlEventData } from "../tl-event-data";
import { TlTimeline } from "./tl-timeline";

@customElement("webwriter-timeline")
export class WebWriterTimeline extends LitElementWw {
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;
  @property({ type: Boolean, attribute: true, reflect: true }) accessor openQuiz = false;

  @query("#quiz") accessor quiz: MainQuiz;
  @query("#timelineID") accessor dialog: TimelineDialog;

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
        margin-bottom: 20px; 
      }

      h4 {
        text-align: center;
      }
      .quiz-mode {
        display: none;
      }
      .button-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding-top: 15px; 
      }

      .timeline-parent { 
        display: flex;
        justify-content: start;
        flex-direction: row; 
      }
      .timeline-container { 
        display: flex;
        justify-content: start;
        flex-direction: column; 
      }

      .timeline { 
        height: 500px;
        width: 2px;    
        background: #484848;
      }

      :host(:not([contenteditable=true]):not([contenteditable=""])) .author-only {
        display: none;
      }
    `;
  }

  static get scopedElements() {
    return {
      "event-manager": EventManager,
      "event-container": EventContainer,
      "timeline-dialog": TimelineDialog,
      "main-quiz": MainQuiz,
      "sl-button": SlButton,
      "tl-timeline":TlTimeline,
    };
  }

  private eventManager = new EventManager();

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.addEventListener("request-remove", (e) =>
      this.eventManager.removeEvent(e)
    );
  }

  render() {
    return html`
      <div class="border" id="parent">
        <h4>My Timeline</h4>
        <div class="timeline-parent"> 
          <div class="timeline"> 
            <!-- <div class="timeline"></div> -->
            <slot name="event-slot"></slot>
          </div>
        </div>
        
        <timeline-dialog
          id="timelineID"
          class="author-only"
          @request-add=${(e) => this.eventManager.addEvent(e, this)}>
        </timeline-dialog>    
        <!-- <reactive-controller></reactive-controller> -->
        <div class="button-container">
          <sl-button 
            id="addButton" 
            class="buttton-left author-only"
            @click=${this.openingTLDialog}>Add Event
          </sl-button>
      
          <sl-button 
            id="quizButton" 
            variant="primary" outline
            @click=${this.startQuiz}>
            ${this.openQuiz ? "Refresh Quiz" : "Open Quiz"}
          </sl-button>
        </div>
              
      </div>

      <main-quiz
        id="quiz"
        class="quiz-container"
        @request-close-quiz=${this.endQuiz}
        hidden
      ></main-quiz>
    `;
  }

  // open dialog, dealing with input and event storage in sub-structures
  openingTLDialog() {
    this.dialog.showDialog();
  }

  // show quiz and add events to it
  startQuiz() {
    this.openQuiz = true;
    this.quiz.hidden = false;
    const events = [...this.children];
    const existingEvents = this.quiz.appendedEvents;

    const eventsToAppend = events.filter((event) => {
      const title = event.getAttribute('event_title');
      const date = event.getAttribute('event_startdate');

      const newEvent = !existingEvents.some(
        (existingEvent) => 
          existingEvent.title === title || 
          existingEvent.date === date
      ); 
      return newEvent;
    });

    eventsToAppend.forEach((event) => {
      let date = event.getAttribute("event_startDate");
      const title = event.getAttribute("event_title");
      this.quiz.addEventElements(date, title);
    });
    console.log("show quiz");
  }

  endQuiz() {
    this.openQuiz = false;
    this.quiz.hidden = true;
    this.quiz.resetQuiz();
    console.log("hide quiz");
  }
}
