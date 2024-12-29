import { LitElement, html, PropertyValues, css } from "lit";
import { LitElementWw } from "@webwriter/lit";
import { customElement, property, query } from "lit/decorators.js";

import "@shoelace-style/shoelace/dist/themes/light.css";

import { 
  SlButton, 
  SlInput, 
  SlTab, 
  SlTabGroup, 
  SlTabPanel, 
  SlSelect, 
  SlOption, 
  SlTabShowEvent,
  SlSwitch } from "@shoelace-style/shoelace";
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
  @property({ type: Boolean, attribute: true, reflect: true }) accessor quizTabOpen = false;

  @query("#quiz") accessor quiz: MainQuiz;
  @query("#timelineID") accessor dialog: TimelineDialog;
  @query("#quizPanel") accessor quizPanel: SlTab;

  static get styles() {
    return css`
      .border {
        /* border: 1px solid lightgray;
        border-radius: 5px; */
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
      .ww-timeline-widget {
        border-top: 1px solid darkgray;
        border-bottom: 1px solid darkgray;
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
      "tl-timeline": TlTimeline,
      "sl-tab": SlTab,
      "sl-tab-group": SlTabGroup,
      "sl-tab-panel": SlTabPanel,
      "sl-input": SlInput,
      "sl-select": SlSelect,
      "sl-option": SlOption,
      "sl-switch": SlSwitch,
    };
  }

  private eventManager = new EventManager();

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.addEventListener("request-remove", (e) =>
      this.eventManager.removeEvent(e)
    );

    // this.addEventListener("quiz-updates",this.startQuiz);
    // this.quizPanel.addEventListener("sl-tab-show", this.startQuiz);  
  }

  render() {
    return html`
      <sl-tab-group class="ww-timeline-widget"  @sl-tab-show=${(e:SlTabShowEvent) => this.checkSelectedTab(e.detail.name)}>
        <sl-tab slot="nav" panel="timeline">Timeline</sl-tab>
        <sl-tab 
          slot="nav" 
          panel="quiz"
          id="quizPanel"
        >Quiz
        </sl-tab>
        

        <sl-tab-panel name="timeline">
          <div class="border" id="parent">
          <!-- <sl-input placeholder="Enter timeline title" id="title"></sl-input>
          <p></p> -->

            <div class="timeline-parent"> 
              <div class="timeline"> 
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
                ${this.quizTabOpen ? "Refresh Quiz" : "Open Quiz"}
              </sl-button>
            </div>
          </div>
        </sl-tab-panel>

        <sl-tab-panel name="quiz">
          <main-quiz id="quiz"></main-quiz>
        </sl-tab-panel>
      </sl-tab-group>

  
      <div part="options">
        ${this.quizTabOpen
          ? html`<div class="quiz-options" id="quiz-options">
                    <sl-select
                      id="quiz-selection"
                      class="quiz-selection"
                      label="Select Quiz Feedback"
                      help-text="Please select which feedback the students should get."
                      >
                        <sl-option value="1">Score and Correct Answers</sl-option>
                        <sl-option value="2">Correct Answers Only</sl-option>
                        <sl-option value="3">Score Only</sl-option>
                        <sl-option value="4">None</sl-option>
                    </sl-select>
                    <div class="text-error" id="formatError" hidden> Please select one feedback option.</div>
                  </div>`
          : html`<sl-switch>Use Timeline Quiz</sl-switch>`}
      </div>
    `;
  }

  // chek if quiz tab is selected 
  checkSelectedTab(selectedTab) {
    console.log(selectedTab);
    if(selectedTab == "quiz"){
      this.startQuiz();
      this.quizTabOpen = true; 
    } else {
      this.quizTabOpen = false;
      this.quiz.resetQuiz();
    }
  }

  // open dialog, dealing with input and event storage in sub-structures
  openingTLDialog() {
    this.dialog.showDialog();
  }

  // show quiz and add events to it
  startQuiz() {
    this.quiz.startQuiz([...this.children]);
  }
}
