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

export class EventContainer extends LitElementWw {
  @property({ type: String }) accessor event_title;
  @property({ type: Array }) accessor event_startDate: TlEventData["startDate"];
  @property({ type: Array }) accessor event_endDate: TlEventData["endDate"];
  @property({ type: Boolean }) accessor hiddenDiv = true;

  @query("#event_elements") accessor event_element;
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
              .event_title}" ?'
          >
            <div class="button-container">
              <sl-button
                class="button"
                id="closeButton"
                slot="footer"
                variant="default"
                @click="${() => this.dialog.hide()}"
                >Exit
              </sl-button>

              <sl-button
                class="delete-button"
                id="deleteButton"
                slot="footer"
                variant="danger"
                @click="${() => this.removeEvent()}"
                >Delete
              </sl-button>
            </div>
          </sl-dialog>
          <div id="event_elements" class="event-content" hidden>
            <slot class="slotted-elements"></slot>
          </div>
          <sl-dialog
            id="delete-event-dialog"
            label='Do you want to delete the timeline event "${this
              .event_title}" ?'
          >
            <div class="button-container">
              <sl-button
                class="button"
                id="closeButton"
                slot="footer"
                variant="default"
                @click="${() => this.dialog.hide()}"
                >Exit
              </sl-button>

              <sl-button
                class="button"
                id="deleteButton"
                slot="footer"
                variant="danger"
                @click="${() => this.removeEvent()}"
                >Delete
              </sl-button>
            </div>
          </sl-dialog>
        </div>
      </div>
    `;
  }

  // on icon click show expanded event content
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

  // on button press a paragraph with "add description" is added to slot
  addParagraph() {
    const parDescription = document.createElement("p");
    parDescription.textContent = "Modify event details";
    this.appendChild(parDescription);
  }

  // on button press event will be removed form slot
  removeEvent() {
    this.dispatchEvent(
      new CustomEvent("request-remove", {
        detail: { id: this.id },
        bubbles: true,
        composed: true,
      })
    );
  }

  // convert array into date for sorting dates
  getStartDate(): Moment {
    return TlEventHelper.convertToDisplayDate(this.event_startDate);
  }
}