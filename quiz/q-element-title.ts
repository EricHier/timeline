import { html, css } from "lit";
import { LitElementWw } from "@webwriter/lit";
import { customElement, property, query } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/themes/light.css";

/**
 * Draggable title element for quiz interface.
 * 
 * Represents an individual event title that users can drag and drop onto
 * corresponding dates in the quiz timeline. Provides visual feedback during
 * drag operations and displays quiz results.
 * 
 * Features:
 * - **Draggable Interface**: Can be dragged to date drop zones
 * - **Visual States**: Shows dragging, correct/incorrect match states
 * - **Touch Support**: Works with both mouse and touch interactions
 * - **Result Display**: Color-coded feedback after quiz submission
 * 
 * @example
 * ```html
 * <quiz-element-title title="Moon Landing">
 * </quiz-element-title>
 * 
 * <quiz-element-title 
 *   title="Berlin Wall Falls" 
 *   dropped="false">
 * </quiz-element-title>
 * ```
 * 
 * @fires drag-start-title - Fired when a drag operation begins
 * 
 * @cssproperty --title-background - Background color of title element
 * @cssproperty --title-border - Border style for title element
 * @cssproperty --dragging-background - Background during drag operations
 * @cssproperty --match-colors - Colors for correct match indication
 * @cssproperty --mismatch-colors - Colors for incorrect match indication
 */
@customElement("quiz-element-title")
export class QuizElementTitle extends LitElementWw {
  /** Title element container (unused) */
  @query("date-element") accessor title_element: HTMLDivElement;

  /**
   * Tab index for keyboard navigation accessibility.
   * @attr tab-index
   */
  @property({ type: Number, attribute: true, reflect: true })  accessor tabIndex = -1;

  /**
   * Text content of the title element.
   * @attr title
   */
  @property({ type: String, attribute: true, reflect: true }) accessor title;

  /**
   * Whether the title has been dropped in a date zone.
   * @attr dropped
   */
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
      text-align: left;
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