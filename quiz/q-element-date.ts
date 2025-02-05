import { html, css } from "lit";
import { LitElementWw } from "@webwriter/lit";
import { customElement, property, query } from "lit/decorators.js";

@customElement("quiz-element-date")
export class QuizElementDate extends LitElementWw {
  @query("date-element") accessor title_element: HTMLDivElement;
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;
  @property({ type: Number, attribute: true, reflect: true }) accessor date;

  static styles = css`
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
    .event-title-container {
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
    .drop-section {
      display: flex;
      align-items: center;
      background: white;
      border: 2px dashed #d6d6da;
      border-radius: 7px;
      margin-right: 5px;
      min-height: 45px;
      min-width: 50px;
      width: max-content;
      max-width: 100%;
      overflow-wrap: break-word;
      overflow-y: auto;
      flex-direction: column;
      padding: 8px;
      flex-direction: column;
      flex-wrap: wrap;
      overflow-wrap: break-word;
      overflow-y: auto;
      box-sizing: border-box;
      transform: translateX(-3.5px);
      padding-top: 8px;
      padding-bottom: 8px;
    }
    .drop-section[dragover] {
      border: 2px dashed #83b9e0;
    }
    .drop-section[dropped] {
      border: 3px solid #e0e0e0;
      border-radius: 5px;
      font-weight: 500;
      font-size: 16px;
      color: #333333;
      flex-direction: column;
    }
    .drop-section[quiz-result="match"] {
      background: #cdefcf;
      color: #4aad4d;
      border: 2px solid #4aad4d;
    }
    .drop-section[quiz-result="mismatch"] {
      background: #f5d1ce;
      color: #c92c1b;
      border: 2px solid #e58e85;
    }
    .drop-section > * {
      max-width: 100%;
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
    .date-line::before {
      content: "\ ";
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #484848;
    }
    .event {
      display: flex;
      align-items: flex-start;
      padding: 15px;
      padding-left: 0px;
      position: relative;
      width: 100%;
    }
    .dropped-title {
      padding: 8px;
      margin: 4px;
      background: white;
      border: 1px solid #d6d6da;
      border-radius: 5px;
      cursor: grab;
      font-weight: 500;
      font-size: 16px;
      color: #333333;
      width: fit-content;
      user-select: none;
    }
    .dropped-title.dragging {
      opacity: 0.5;
      border: 2px solid #83b9e0;
      background: #e5f4fc;
    }
    .drop-section {
      min-height: 45px;
      min-width: 50px;
      width: max-content;
    }
  `;

  // unset attributes for dropping title + dispatch event to handle drop
  private droppingTitles(event: DragEvent) {
    const dropSection = event.target as HTMLElement;
    dropSection.removeAttribute("dragover");
    dropSection.removeAttribute("dragging");
    dropSection.setAttribute("dropped", "true");

    this.dispatchEvent(
      new CustomEvent("title-dropped-in-section", {
        detail: { target: this },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="event" id="date-drop-section">
        <div class="date-container">
          <div class="event-date">${this.date}</div>
          <div class="date-line"></div>
        </div>
        <div
          class="drop-section"
          id="${this.date}"
          @dragover=${(e: DragEvent) => {
            (e.target as HTMLElement).setAttribute("dragover", "true");
          }}
          @dragleave=${(e: DragEvent) =>
            (e.target as HTMLElement).removeAttribute("dragover")}
          @drop=${this.droppingTitles}
        >
          <slot></slot>
        </div>
      </div>
    `;
  }
}
