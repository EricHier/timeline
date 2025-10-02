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

/**
 * Interactive timeline widget for WebWriter applications.
 * 
 * This web component creates an interactive timeline that allows users to:
 * - Create and manage timeline events with dates and descriptions
 * - Switch between timeline creation and quiz modes
 * - Test knowledge with drag-and-drop quiz functionality
 * - Customize panel visibility (timeline only, quiz only, or both)
 * - Configure quiz feedback options
 * 
 * The component consists of two main panels:
 * 1. **Timeline Panel**: For creating and editing timeline events
 * 2. **Quiz Panel**: For testing knowledge with interactive quiz features
 * 
 * **Usage Examples:**
 * ```html
 * <!-- Basic timeline widget -->
 * <webwriter-timeline></webwriter-timeline>
 * 
 * <!-- Timeline with quiz panel visible -->
 * <webwriter-timeline panelvisibility="both">
 *   <event-container 
 *     slot="event-slot" 
 *     event_title="World War II Begins" 
 *     event_startDate='[1939, 9, 1]'>
 *     <p>Germany invades Poland, starting World War II.</p>
 *   </event-container>
 * </webwriter-timeline>
 * 
 * <!-- Quiz-focused configuration -->
 * <webwriter-timeline 
 *   panelvisibility="quiz" 
 *   quizFeedbackOption="2">
 * </webwriter-timeline>
 * ```
 * 
 * @slot event-slot - Container for timeline events (event-container elements)
 * 
 * @fires request-add - Fired when a new event should be added to the timeline
 * @fires request-remove - Fired when an event should be removed from the timeline
 * @fires show-quiz-feedback-error - Fired when quiz feedback validation fails
 * 
 * @cssproperty --timeline-background - Background color of the timeline area
 * @cssproperty --timeline-border - Border style for timeline elements
 * @cssproperty --quiz-background - Background color of the quiz area
 * @cssproperty --panel-border - Border style for panel separators
 */
@customElement("webwriter-timeline")
export class WebWriterTimeline extends LitElementWw {
  /**
   * Tab index for keyboard navigation accessibility.
   * @attr tab-index
   */
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;

  /**
   * Currently active panel ('timeline' or 'quiz').
   * @attr current-panel
   */
  @property({ type: String, attribute: true, reflect: true }) accessor currentPanel: string;

  /**
   * Controls which panels are visible in the interface.
   * @attr panelvisibility
   * @example "timeline" - Shows only timeline panel
   * @example "quiz" - Shows only quiz panel  
   * @example "both" - Shows both panels with tabs
   */
  @property({ type: String, attribute: "panelvisibility", reflect: true }) accessor _panelVisibility: string;
	private get panelVisibility(): string { return this._panelVisibility || "timeline"; }
	private set panelVisibility(value: string) { this._panelVisibility = value; }

  /**
   * Selected quiz feedback option (1-4).
   * Determines what feedback is shown after quiz completion:
   * - 1: Show correct answers only
   * - 2: Show score and correct answers
   * - 3: Show detailed explanations
   * - 4: Show progress tracking
   * @attr quiz-feedback-option
   */
  @property({ type: Number, attribute: true, reflect: true }) accessor quizFeedbackOption;

  /** Quiz feedback selection dropdown element */
  @query("#quiz-selection") accessor quizFeedbackSelecter: SlSelect;
  /** Main quiz component instance */
  @query("#quiz-component") accessor quiz: MainQuiz;
  /** Timeline dialog component for creating/editing events */
  @query("#tl-component") accessor dialog: TimelineDialog;
  /** Timeline panel tab element */
  @query("#timeline-panel") accessor timelinePanel: SlTab;
  /** Quiz panel tab element */
  @query("#quiz-panel") accessor quizPanel: SlTab;
  /** Toggle switch for enabling/disabling quiz functionality */
  @query("#quiz-toggle") accessor quizToggle: SlSwitch;
  /** Error message container for quiz feedback validation */
  @query("#feedback-error") accessor feedbackError: HTMLDivElement;
  /** Tooltip for the add event button */
  @query("#add-event-tooltip") accessor addToolTip: SlTooltip;
  /** Tab group container for switching between panels */
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

  /** Event manager instance for handling timeline event operations */
  private eventManager = new EventManager();

  /**
   * Lifecycle method called after the element's DOM has been updated for the first time.
   * Initializes component state, sets up event listeners, configures help system positioning,
   * and handles initial panel visibility based on configuration.
   * 
   * @param _changedProperties - Map of changed properties
   */
  protected async firstUpdated(_changedProperties: PropertyValues) {
		setTimeout(() => this.tabGroup.show(this.currentPanel), 0);

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
    }
  }

  /**
   * Lifecycle method called when component properties change.
   * Handles panel switching when currentPanel property changes.
   * 
   * @param _changedProperties - Map of changed properties
   */
	updated(_changedProperties: PropertyValues): void {
		if (_changedProperties.has("currentPanel")) {
			this.tabGroup.show(this.currentPanel);
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
          panel="timeline"
          id="timeline-panel"
          ?disabled=${this.panelVisibility === "quiz"}
        >
          Timeline
        </sl-tab>
        <sl-tab
          slot="nav"
          panel="quiz"
          id="quiz-panel"
          ?disabled=${this.panelVisibility === "timeline"}
        >
          Quiz
        </sl-tab>

        <sl-tab-panel name="timeline">
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

        <sl-tab-panel name="quiz">
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

  /**
   * Handles tab selection changes between timeline and quiz panels.
   * Automatically starts quiz mode when quiz panel is selected and initializes 
   * the current panel state.
   * 
   * @param selectedTab - The name of the selected tab ('quiz' or 'timeline')
   */
  checkSelectedTab(selectedTab) {
    if (selectedTab === "quiz" && this.panelVisibility !== "timeline") {
      this.startQuiz();
      this.currentPanel = "quiz";
    } else {
      this.currentPanel = "timeline";
    }
  }

  /**
   * Opens the timeline dialog for creating or editing events.
   * This method triggers the timeline dialog to become visible,
   * allowing users to add new events to the timeline.
   */
  openingTLDialog() {
    this.dialog.showDialog();
  }

  /**
   * Initializes and starts the quiz with current timeline events.
   * Collects all child event elements and passes them to the quiz component
   * for creating quiz questions.
   */
  startQuiz() {
    this.quiz.startQuiz([...this.children]);
  }

  /**
   * Saves the selected quiz feedback option and validates the selection.
   * Updates the quiz feedback display based on user selection and shows/hides
   * validation errors as appropriate.
   * 
   * @fires show-quiz-feedback-error - When validation fails
   */
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
