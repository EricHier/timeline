import { LitElement, html, PropertyValues, css } from "lit";
import { LitElementWw } from "@webwriter/lit";
import { customElement, property, query } from "lit/decorators.js";

import "@shoelace-style/shoelace/dist/themes/light.css";

import { SlButton, SlDialog, SlIcon } from "@shoelace-style/shoelace";

import { EventContainer } from "../event-container";
import { DialogInput } from "../dialog-elements/d-input";
import { TimelineDialog } from "../tl-dialog";
import { EventManager } from "../event-manager";
import { MainQuiz } from "./q-main-quiz";
import { TlEvent } from "../tl-event";

@customElement("webwriter-timeline")
export class WebWriterTimeline extends LitElementWw {
  @property({ type: Number, attribute: true, reflect: true })
  accessor tabIndex = -1;
  @property({ type: Boolean, attribute: true, reflect: true })
  accessor openQuiz = false;

  // @query("#timelineID") accessor timelineDialog: TimelineDialog
  @query("#quiz") accessor quiz: MainQuiz;

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
      .quiz-mode {
        display: none;
      }
    `;
  }

  static get scopedElements() {
    return {
      "dialog-input": DialogInput,

      "event-manager": EventManager,
      "event-container": EventContainer,

      "timeline-dialog": TimelineDialog,

      "main-quiz": MainQuiz,
      "sl-button": SlButton,
    };
  }

  private eventManager = new EventManager();
  private mainQuiz = new MainQuiz();

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.addEventListener("request-remove", (e) =>
      this.eventManager.removeEvent(e)
    );
  }

  render() {
    return html`
      <div class="border" id="parent">
        <h4>My Timeline</h4>

        <slot name="event-slot"></slot>
        <hr />
        ${this.isContentEditable
          ? html`
              <timeline-dialog
                id="timelineID"
                @request-add=${(e) => this.eventManager.addEvent(e)}
              ></timeline-dialog>
              <sl-button id="addButton" @click=${this.openingTLDialog}
                >Add Event</sl-button
              >
            `
          : null}

        <sl-button id="quizButton" @click=${this.startQuiz}
          >${this.openQuiz ? "Refresh Quiz" : "Open Quiz"}</sl-button
        >
      </div>

      <main-quiz
        id="quiz"
        @request-close-quiz=${this.endQuiz}
        hidden
      ></main-quiz>
    `;
  }

  // open dialog, dealing with input and event storage in sub-structures
  openingTLDialog() {
    const dialog = this.shadowRoot?.querySelector("#timelineID") as TimelineDialog;
    dialog.showDialog();
  }

  // show quiz and add events to it
  startQuiz() {
    this.quiz.hidden = false;
    this.openQuiz = true;

    const events = [...this.children];
    const existingEvents = this.quiz.getAppendedEvents();

    const eventsToAppend = events.filter((event) => {
      const title = event.getAttribute("event_title");
      return !existingEvents.some(
        (existingEvent) => existingEvent.title === title
      );
    });

    eventsToAppend.forEach((event) => {
      let date = event.getAttribute("event_startDate");
      const title = event.getAttribute("event_title");
      this.quiz.appendRow(date, title);
    });
    console.log("show quiz");
  }

  endQuiz() {
    this.quiz.hidden = true;
    this.openQuiz = false;

    console.log("hide quiz");
    this.quiz.resetQuiz();
  }
}
