import { html, css } from "lit";
import { LitElementWw } from "@webwriter/lit";
import { customElement, property, query } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/themes/light.css";

@customElement("quiz-element-title")
export class QuizElementTitle extends LitElementWw {
  @query("date-element") accessor title_element: HTMLDivElement;
  @property({ type: Number, attribute: true, reflect: true })  accessor tabIndex = -1;
  @property({ type: String, attribute: true, reflect: true }) accessor title;
  @property({ type: Boolean, attribute: true, reflect: true })  accessor dropped = true;

  static styles = css`
    .title-border {
      display: flex;
      justify-content: center;
      align-items: center;
      background: white;
      border: 1px solid #d6d6da;
      border-radius: 7px;
      margin: 5px;
      width: auto;
      max-width: calc(100% - 10px);
      cursor: grab;
      font-weight: 500;
      font-size: 1.15rem;
      color: #333333;
      min-height: 35px;
      flex-wrap: wrap;
      text-align: center;
      padding: 5px 10px;
      box-sizing: border-box;
      overflow-x: scroll;
      flex-direction: row;
    }
    .title-border.dragging {
      background: #e5f4fc;
      border: 2px solid #83b9e0;
      cursor: grabbing;
    }
    .title-border[match] {
      background: #cdefcf;
      color: #4aad4d;
      border: 2px solid #4aad4d;
    }
    .title-border[mismatch] {
      background: #f5d1ce;
      color: #c92c1b;
      border: 2px solid #e58e85;
    }
  `;

  // set attributes for dragging title + dispatch event for handling drag
  private startDrag(event: DragEvent) {
    const dragElement = this.shadowRoot?.querySelector(".title-border");
    dragElement?.classList.add("dragging");

    this.dispatchEvent(
      new CustomEvent("drag-start-title", {
        detail: { title: this, parent: this.parentNode },
        bubbles: true,
        composed: true,
      })
    );
  }

  // unset attributes for dragging title
  private endDrag() {
    this.shadowRoot.querySelector(".title-border").classList.remove("dragging");
  }

  render() {
    return html`
      <div
        class="title-border"
        id="${this.title}"
        draggable="true"
        @dragstart=${this.startDrag}
        @dragend=${this.endDrag}
      >
        ${this.title}
      </div>
    `;
  }
}