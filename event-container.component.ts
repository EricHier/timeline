import { SlButton, SlDialog, SlIcon } from "@shoelace-style/shoelace";
import "@shoelace-style/shoelace/dist/themes/light.css";
import IconArrowsDiagonalMinimize2 from "@tabler/icons/outline/arrows-diagonal-minimize-2.svg";
import IconArrowsDiagonal from "@tabler/icons/outline/arrows-diagonal.svg";
import IconTrash from "@tabler/icons/outline/trash.svg";
import { LitElementWw } from "@webwriter/lit";
import { css, html, PropertyValues } from "lit";
import { property, query } from "lit/decorators.js";
import { Moment } from "moment";
import { TlEventData, TlEventHelper } from "./tl-event-data";

/**
 * Individual timeline event container component.
 * 
 * Represents a single event in a timeline with the following features:
 * - Displays event title and date(s)
 * - Supports both single dates and date ranges (time periods)
 * - Expandable/collapsible content area for event descriptions
 * - Delete functionality for timeline editing
 * - Drag and drop support for timeline quiz functionality
 * - Automatic date formatting and display utilities
 * 
 * This component is designed to be used within webwriter-timeline components
 * and supports both creation and quiz modes.
 * 
 * @example
 * ```html
 * <!-- Single date event -->
 * <event-container 
 *   event_title="Moon Landing" 
 *   event_startDate="[1969, 7, 20]">
 *   <p>Neil Armstrong becomes the first human to step on the Moon.</p>
 * </event-container>
 * 
 * <!-- Date range event -->
 * <event-container 
 *   event_title="World War II" 
 *   event_startDate="[1939, 9, 1]"
 *   event_endDate="[1945, 9, 2]">
 *   <p>Global war involving most of the world's nations.</p>
 *   <ul>
 *     <li>Europe and Pacific theaters</li>
 *     <li>Over 70 million casualties</li>
 *   </ul>
 * </event-container>
 * ```
 * 
 * @slot - Content area for event descriptions, images, lists, etc.
 * 
 * @fires request-remove - Fired when the delete button is clicked
 * 
 * @cssproperty --event-border - Border style for the event container
 * @cssproperty --event-background - Background color of the event
 * @cssproperty --date-color - Text color for date display
 * @cssproperty --timeline-line-color - Color of the timeline line
 */
export class EventContainer extends LitElementWw {
  /**
   * Title/name of the timeline event.
   * @attr event_title
   */
  @property({ type: String }) accessor event_title;

  /**
   * Start date of the event as an array [year, month, day].
   * Month is 1-indexed (January = 1, December = 12).
   * Supports BCE dates with negative years.
   * @attr event_startDate
   * @example [2024, 12, 25] - December 25, 2024
   * @example [-55, 7, 10] - July 10, 55 BCE
   */
  @property({ type: Array }) accessor event_startDate: TlEventData["startDate"];

  /**
   * End date of the event as an array [year, month, day].
   * Optional - when provided, displays the event as a time period.
   * Must be after the start date.
   * @attr event_endDate
   * @example [2024, 12, 31] - December 31, 2024
   */
  @property({ type: Array }) accessor event_endDate: TlEventData["endDate"];

  /**
   * Controls visibility of the event content area.
   * When true, content is collapsed; when false, content is expanded.
   * @attr hidden-div
   */
  @property({ type: Boolean }) accessor hiddenDiv = true;

  /** Container element for event content/description */
  @query("#event_elements") accessor event_element;
  /** Delete confirmation dialog element */
  @query("#delete-event-dialog") accessor dialog: SlDialog;

  static get styles() {
    return css`
      :host(:not([contenteditable="true"]):not([contenteditable=""]))
        .author-only {
        display: none;
      }
      .event {
        display: flex;
        align-items: flex-start;
        padding: 15px;
        padding-left: 0px;
        position: relative;
        width: 100%;
      }
      .event:first-child {
        display: flex;
        align-items: flex-start;
        padding: 16px;
        padding-top: 5px;
        padding-left: 0px;
        position: relative;
        width: 100%;
      }
      .date-container {
        display: grid;
        align-items: center;
        position: relative;
      }
      .event-date {
        font-size: 14px;
        font-weight: 700;
        color: #484848;
        grid-column: 1;
        grid-row: 1;
        padding-left: 7px;
        padding-right: 5px;
        width: 100%;
      }
      .date-line {
        min-width: 150px;
        flex-grow: 1;
        height: 2px;
        width: 100%;
        background: #484848;
        display: flex;
        justify-content: space-between;
        align-items: center;
        grid-column: 1;
        grid-row: 2;
        transform: translateX(-3.5px);
      }
      .date-time-period-line {
        min-width: 150px;
        flex-grow: 1;
        height: 2px;
        width: 100%;
        background: #484848;
        display: flex;
        justify-content: space-between;
        align-items: center;
        grid-column: 1;
        grid-row: 2;
        transform: translateX(-3.5px);
      }
      .date-line::before {
        content: "\ ";
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #484848;
      }
      .date-time-period-line::before {
        content: "\ ";
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #484848;
      }
      .event-description-container-closed {
        border: 3px solid #e0e0e0;
        border-radius: 5px;
        padding: 8px;
        display: flex;
        align-items: left;
        justify-content: space-between;
        width: 100%;
        max-width: max-content;
        max-height: 400px;
        overflow-wrap: break-word;
        overflow-y: auto;
        flex-direction: column;
        transform: translateX(-3.5px);
      }
      .event-description-container-open {
        border: 3px solid #83b9e0;
        border-radius: 5px;
        padding: 8px;
        display: flex;
        align-items: left;
        justify-content: space-between;
        width: 100%;
        max-width: 100%;
        max-height: 400px;
        overflow-wrap: break-word;
        flex-direction: column;
        transform: translateX(-3.5px);
      }
      ::slotted(iframe) {
        box-sizing: border-box;
      }
      .event-content {
        max-height: 400px;
        overflow-y: auto;
      }
      .event-title {
        font-size: 16px;
        font-weight: 500;
        text-align: left;
        color: #484848;
        flex: 1;
        padding-right: 7px;
      }
      .event-title-icon {
        flex-direction: row;
        display: flex;
        align-items: center;
      }
      .event-trash-can {
        align-self: right;
        padding-right: 20px;
      }
      .button-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 1rem 0 0 0;
      }
      .button .delete-button {
        padding-top: 5px;
        width: 100px;
      }
      .delete-button {
        padding-right: 5px;
      }
      .expand-icon {
        padding-left: 5px;
      }
      sl-dialog::part(base) {
        --width: 100%;
        margin: 0;
        position: relative;
      }
      sl-dialog::part(panel) {
        margin: 0;
        padding: 1rem;
      }
      .slotted-elements{
        font-size: 16px;
        color: #484848;
      }
    `;
  }

  static get scopedElements() {
    return {
      "sl-button": SlButton,
      "sl-icon": SlIcon,
      "sl-dialog": SlDialog,
    };
  }

  /**
   * Lifecycle method called after the element's DOM has been updated for the first time.
   * Automatically adds a default paragraph if the event has no content.
   * 
   * @param _changedProperties - Map of changed properties
   */
  protected firstUpdated(_changedProperties: PropertyValues): void {
    if (this.childElementCount == 0) {
      this.addParagraph();
    }
  }

  render() {
    return html`
      <div class="event">
        <div class="date-container">
          ${this.event_endDate === undefined
            ? html` <div class="event-date">
                  ${TlEventHelper.displayDate(this.event_startDate)}
                </div>
                <div class="date-line"></div>`
            : html` <div class="event-date">
                  ${TlEventHelper.displayDate(
                    this.event_startDate
                  )}${" - "}${TlEventHelper.displayDate(this.event_endDate)}
                </div>
                <div class="date-time-period-line"></div>`}
        </div>

        <div
          class=${this.hiddenDiv
            ? "event-description-container-closed"
            : "event-description-container-open"}
        >
          <div class="event-title-icon">
            <div class="event-title">${this.event_title}</div>
            ${this.hiddenDiv === false
              ? html` <sl-icon
                  class="author-only event-trash-can"
                  src=${IconTrash}
                  style="cursor: pointer"
                  slot="prefix"
                  @click="${() => this.dialog.show()}"
                >
                </sl-icon>`
              : html``}
            <sl-icon
              class=${this.hiddenDiv ? "" : "expand-icon"}
              style="cursor: pointer"
              .src=${this.hiddenDiv
                ? IconArrowsDiagonal
                : IconArrowsDiagonalMinimize2}
              @click=${() => this.showEventContent()}
              slot="prefix"
            >
            </sl-icon>
          </div>
          <sl-dialog
            id="delete-event-dialog"
            label='Do you want to delete the timeline event "${this
              .event_title}"?'
          >
            <div class="button-container">
              <sl-button
                class="button"
                id="closeButton"
                slot="footer"
                variant="default"
                @click="${() => this.dialog.hide()}"
                >Cancel
              </sl-button>

              <sl-button
                class="delete-button"
                id="deleteButton"
                slot="footer"
                variant="danger"
                autofocus
                @click="${() => this.removeEvent()}"
                >Delete
              </sl-button>
            </div>
          </sl-dialog>
          <div id="event_elements" class="event-content" hidden>
            <slot class="slotted-elements"></slot>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Toggles the visibility of event content area.
   * Expands or collapses the event description and controls the visibility
   * of edit/delete buttons. Automatically adds default content if none exists.
   */
  showEventContent() {
    if (this.event_element.hidden) {
      this.event_element.hidden = false;
      this.hiddenDiv = false;

      if (this.childElementCount == 0) {
        this.addParagraph();
      }
    } else {
      this.event_element.hidden = true;
      this.hiddenDiv = true;
    }
  }

  /**
   * Adds a default paragraph element to the event content area.
   * Called automatically when an event has no content and is expanded.
   * Creates an editable paragraph with placeholder text.
   */
  addParagraph() {
    const parDescription = document.createElement("p");
    parDescription.textContent = "Modify event details";
    this.appendChild(parDescription);
  }

  /**
   * Dispatches a request to remove this event from the timeline.
   * Triggers the 'request-remove' event which is handled by the parent timeline.
   * 
   * @fires request-remove - Custom event with event ID for removal
   */
  removeEvent() {
    this.dispatchEvent(
      new CustomEvent("request-remove", {
        detail: { id: this.id },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Converts the event's start date to a Moment object for date operations.
   * Used internally for timeline sorting and date comparisons.
   * 
   * @returns Moment object representing the event's start date
   */
  getStartDate(): Moment {
    return TlEventHelper.convertToDisplayDate(this.event_startDate);
  }
}