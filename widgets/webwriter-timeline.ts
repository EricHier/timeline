import {LitElement, html, PropertyValues, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property} from "lit/decorators.js"

import "@shoelace-style/shoelace/dist/themes/light.css";

import {
  SlButton,
  SlDialog,
  SlIcon,
} from "@shoelace-style/shoelace";

import { EventContainer } from "../event-container";
import { DialogInput } from "../dialog-elements/d-input";
import{ TimelineDialog} from "../tl-dialog";
import { EventManager } from "../event-manager";
import { MainQuiz } from "./q-main-quiz";


@customElement("webwriter-timeline")

export class WebWriterTimeline extends LitElementWw {
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;

  static get styles() {
    return css`
    .border {
      border: 1px solid lightgray;
      border-radius: 5px;
      min-height: 700px;
      width: 100%,
    }

    #parent >* {
      margin-left: 10px;
      margin-right: 10px;
    }
    
    h4 {
      text-align: center; 
    }
    :host(:not([contenteditable=true]):not([contenteditable=""])) .author-only {
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
    this.addEventListener("request-add", (e) => this.eventManager.addEvent(e));
    this.addEventListener("request-remove", (e) => this.eventManager.removeEvent(e));    
  }


  render() {
    return html`
      <div class="border" id="parent">
        <h4>My Timeline</h4>       
        
        
        <slot name="event-slot"></slot>
        <hr/>
        <div class="author-only">
          <timeline-dialog id="timelineID"></timeline-dialog>
          <sl-button id="addButton" @click=${this.openingTLDialog}>Add Event</sl-button> 
        </div>
        <br />
        <sl-button id="quizButton" @click=${this.startQuiz}>Start Quiz</sl-button> 
        <sl-button id="quizButton" @click=${this.endQuiz}>End Quiz</sl-button> 
      </div>
      <br />

      <main-quiz id="quiz" hidden></main-quiz>
    `;
  }

  // open dialog, dealing with input and event storage in sub-structures
  openingTLDialog(){
    const dialog = this.shadowRoot?.querySelector("#timelineID") as TimelineDialog;
    dialog.showDialog();
  }

  // TO DO: future quiz
  startQuiz(){
    debugger;
    const quiz = this.shadowRoot?.querySelector("#quiz") as MainQuiz;
    quiz.hidden = false;

    // const timeline = document.querySelector("webwriter-timeline") as WebWriterTimeline;
    // const list = this.shadowRoot.querySelector('slot[name="event-slot"]');
    // const table = quiz.shadowRoot.querySelector('#quizTable');
    const events = [...this.children]; 

    events.forEach((event) => {
      let date = event.getAttribute('event_startDate');
      const title = event.getAttribute('event_title');
      quiz.appendRow(date, title);
    });

    console.log("show quiz");
  }

  endQuiz(){
    const quiz = this.shadowRoot?.querySelector("#quiz") as MainQuiz;
    quiz.hidden = true;
    console.log("hide quiz");
  }
}