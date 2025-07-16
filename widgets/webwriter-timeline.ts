import {
	SlIcon,
	SlOption,
	SlRadio,
	SlRadioGroup,
	SlSelect,
	SlSwitch,
	SlTab,
	SlTabGroup,
	SlTabPanel,
	SlTabShowEvent,
	SlTooltip
} from "@shoelace-style/shoelace";
import "@shoelace-style/shoelace/dist/themes/light.css";
import IconCirclePlusFilled from "@tabler/icons/outline/circle-plus.svg";
import { LitElementWw } from "@webwriter/lit";
import { HelpOverlay, HelpPopup } from "@webwriter/wui/dist/helpSystem/helpSystem.js";
import { css, html, PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { EventManager } from "../event-manager";
import { MainQuiz } from "../quiz/q-main-quiz";
import { TimelineDialog } from "../tl-dialog";

@customElement("webwriter-timeline")
export class WebWriterTimeline extends LitElementWw {
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;
  @property({ type: String, attribute: true, reflect: true }) accessor currentPanel: string;
  @property({ type: String, attribute: "panelvisibility", reflect: true }) accessor _panelVisibility: string;
	private get panelVisibility(): string { return this._panelVisibility || "timeline"; }
	private set panelVisibility(value: string) { this._panelVisibility = value; }
  @property({ type: Number, attribute: true, reflect: true }) accessor quizFeedbackOption;

  @query("#quiz-selection") accessor quizFeedbackSelecter: SlSelect;
  @query("#quiz-component") accessor quiz: MainQuiz;
  @query("#tl-component") accessor dialog: TimelineDialog;
  @query("#quiz-panel") accessor quizPanel: SlTab;
  @query("#quiz-toggle") accessor quizToggle: SlSwitch;
  @query("#feedback-error") accessor feedbackError: HTMLDivElement;
  @query("#add-event-tooltip") accessor addToolTip: SlTooltip;
  @query("#tab-group") accessor tabGroup: SlTabGroup;

  static get styles() {
    return css`
      :host(:not([contenteditable="true"]):not([contenteditable=""]))
        .author-only {
        display: none;
      }
      .ww-timeline {
        border-top: 1px solid darkgray;
        border-bottom: 1px solid darkgray;
        min-height: 500px;
      }
      .border {
        min-zoom: 100%;
        overflow-wrap: break-word;
        width: 100%;
        padding-left: 20px;
        padding-right: 20px;
        box-sizing: border-box;
        margin-bottom: 20px;
        margin-top: 20px;
        max-height: 700px;
      }
      .timeline-container {
        display: flex;
        justify-content: start;
        flex-direction: row;
        position: relative;
        vertical-align: center;
        padding-bottom: 25px;
      }
      .timeline {
        min-height: 15px;
        height: auto;
        width: 100%;
        border-left: 2px solid #484848;
        position: relative;
        padding-bottom: 50px;
      }
      .timeline::after {
        content: "";
        position: absolute;
        bottom: -10px;
        transform: translateX(-58%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 10px solid #484848;
      }
      .quiz-selection {
        width: 100%;
      }
      .add-event-icon {
        position: absolute;
        left: -17px;
        bottom: 0;
        transform: translateY(-15px);
        background-color: white;
        color: #83b9e0;
        font-size: 32px;
        cursor: pointer;
      }
      .text-error {
        padding-left: 10px;
        font-size: var(--sl-input-help-text-font-size-medium);
        color: var(--sl-color-danger-700);
      }
      #timeline-toggle {
        padding:8px;
      }
    `;
  }

  static get scopedElements() {
    return {
      "event-manager": EventManager,
      "timeline-dialog": TimelineDialog,
      "main-quiz": MainQuiz,
      "sl-tab": SlTab,
      "sl-tab-group": SlTabGroup,
      "sl-tab-panel": SlTabPanel,
      "sl-select": SlSelect,
      "sl-option": SlOption,
			"sl-radio-group": SlRadioGroup,
			"sl-radio": SlRadio,
      "sl-icon": SlIcon,
      "webwriter-helpoverlay": HelpOverlay,
      "webwriter-helppopup": HelpPopup,
    };
  }

  private eventManager = new EventManager();

  protected async firstUpdated(_changedProperties: PropertyValues) {
    // set timelinePanel as visble for initial use

    // button position after shaddow dom created  https://lit.dev/docs/components/events/#async-events
    await new Promise((resolve) => setTimeout(resolve, 0));
    this.renderRoot
      .querySelector("webwriter-helpoverlay")
      .shadowRoot.querySelector("#helpButton")
      .setAttribute("style", "right: 2.5%");

    this.addEventListener("request-remove", (e) =>
      this.eventManager.removeEvent(e)
    );
    this.addEventListener(
      "show-quiz-feedback-error",
      () => (this.feedbackError.hidden = false)
    );
    // set quizfeedback to 1 if undefined 
    if (this.isContentEditable && this.quizFeedbackOption === undefined){
      this.quizFeedbackOption = 1; 
    }
    this.quiz.findSelection(this.quizFeedbackOption)

    // set quiz tab visible at first if content is not editable and timeline deactivated
    if (this.panelVisibility !== "timeline" && this.panelVisibility !== "timeline+quiz" && !this.isContentEditable) {
      this.quizPanel.click();
      this.tabGroup.setAttribute('active', 'quiz-panel');
    }
  }

  render() {
    return html`
      <webwriter-helpoverlay class="ww-wui">
        <webwriter-helppopup slot="popupContainer" target="quiz-panel">
          <div slot="content">
            <h4>Quiz Panel</h4>
            <p>
              Click on this panel to configure a quiz for your timeline. If
              disabled, toggle the <b>"Use Timeline Quiz" toggle</b> in the
              options field.
            </p>
          </div>
        </webwriter-helppopup>

        <webwriter-helppopup slot="popupContainer" target="timeline-panel">
          <div slot="content">
            <h4>Timeline Panel</h4>
            <p>On this panel you can create a timeline.</p>
          </div>
        </webwriter-helppopup>

        <webwriter-helppopup slot="popupContainer" target="panel-visibility-selector">
          <div slot="content">
            <h4>Visibility Selector</h4>
            <p>Change me to change the visibility of the timeline and quiz panels.</p>
          </div>
        </webwriter-helppopup>

        <webwriter-helppopup slot="popupContainer" target="addButton">
          <div slot="content">
            <h4>Add Event Button</h4>
            <p>Click me to add events to the timeline.</p>
          </div>
        </webwriter-helppopup>
      </webwriter-helpoverlay>

      <sl-tab-group
        class="ww-timeline"
        id="tab-group"
        @sl-tab-show=${(e: SlTabShowEvent) =>
          this.checkSelectedTab(e.detail.name)}
        @sl-tab-hide=${(e: SlTabShowEvent) =>
          this.checkSelectedTab(e.detail.name)}
      >
        <sl-tab
          slot="nav"
          panel="timeline-panel"
          id="timeline-panel"
          ?disabled=${this.panelVisibility === "quiz"}
        >
          Timeline
        </sl-tab>
        <sl-tab
          slot="nav"
          panel="quiz-panel"
          id="quiz-panel"
          ?disabled=${this.panelVisibility === "timeline"}
        >
          Quiz
        </sl-tab>

        <sl-tab-panel name="timeline-panel">
          <div class="border">
            <div class="timeline-container">
              <div class="timeline">
                <slot name="event-slot"></slot>
                <sl-icon
                  src=${IconCirclePlusFilled}
                  class="add-event-icon author-only"
                  id="addButton"
                  class="buttton-left author-only"
                  @click=${this.openingTLDialog}
                >
                </sl-icon>
              </div>
            </div>

            <timeline-dialog
              id="tl-component"
              class="author-only"
              @request-add=${(e) => this.eventManager.addEvent(e, this)}
            >
            </timeline-dialog>
          </div>
        </sl-tab-panel>

        <sl-tab-panel name="quiz-panel">
          <main-quiz id="quiz-component"> </main-quiz>
        </sl-tab-panel>
      </sl-tab-group>

      <div part="options" class="author-only">
        ${this.currentPanel === "quiz"
          ? html`<div class="quiz-options" id="quiz-options">
              <sl-select
                id="quiz-selection"
                class="quiz-selection"
                label="Select Quiz Feedback"
                help-text="Please select which feedback the students should get."
                @sl-change=${() => this.saveQuizSelection()}
                .value=${this.quizFeedbackOption?.toString() || ''}
              >
                <sl-option value="1">Score and Correct Answers</sl-option>
                <sl-option value="2">Correct Answers Only</sl-option>
                <sl-option value="3">Score Only</sl-option>
                <sl-option value="4">None</sl-option>
              </sl-select>
              <div class="text-error" id="feedback-error" hidden>
                Please select a feedback option.
              </div>
            </div>`
          : ""}
				<sl-radio-group id="panel-visibility-selector" value=${this.panelVisibility} @sl-change=${(e) => {
					this.panelVisibility = e.target.value;
					if (this.panelVisibility === "quiz") this.currentPanel = "quiz";
					else if (this.panelVisibility === "timeline") this.currentPanel = "timeline";
				}}>
					<sl-radio value="timeline">Show only Timeline</sl-radio>
					<sl-radio value="quiz">Show only Quiz</sl-radio>
					<sl-radio value="timeline+quiz">Show Timeline and Quiz</sl-radio>
				</sl-radio-group>
      </div>
    `;
  }

  // if quiz panel is selected start quiz + manage options window
  checkSelectedTab(selectedTab) {
    if (selectedTab === "quiz-panel" && this.panelVisibility !== "timeline") {
      this.startQuiz();
      this.currentPanel = "quiz";
    } else {
      this.currentPanel = "timeline";
    }
  }

  // open dialog
  openingTLDialog() {
    this.dialog.showDialog();
  }

  // show quiz and add events to it
  startQuiz() {
    this.quiz.startQuiz([...this.children]);
  }

  // transmit selected option for quiz feedback
  saveQuizSelection() {
    this.quizFeedbackOption = Number(this.quizFeedbackSelecter.value);
    if (
      this.quizFeedbackOption !== undefined ||
      this.quizFeedbackOption !== 0
    ) {
      this.feedbackError.hidden = true;
      this.quiz.findSelection(this.quizFeedbackOption);
    } else {
      this.feedbackError.hidden = false;
    }
  }
}
