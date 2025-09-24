import { html, css } from "lit";
import { LitElementWw } from "@webwriter/lit";
import { customElement, property, query } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/themes/light.css";
import { SlIcon } from "@shoelace-style/shoelace";

/**
 * Container component for quiz title elements.
 * 
 * This component serves as the source container for draggable title elements in the
 * quiz interface. It displays all available event titles that users can drag to
 * match with corresponding dates on the timeline.
 * 
 * Features:
 * - **Drag Source Container**: Holds draggable title elements
 * - **Drop Target**: Accepts titles being dropped back from date sections
 * - **Randomization**: Can shuffle title order for quiz variety
 * - **Scrollable Area**: Handles overflow with scrolling
 * - **Visual Feedback**: Shows drag states and drop zones
 * 
 * The component automatically handles drag and drop events and communicates
 * with the parent quiz component about title movements.
 * 
 * @example
 * ```html
 * <!-- Basic title container -->
 * <quiz-title>
 *   <quiz-element-title title="Moon Landing"></quiz-element-title>
 *   <quiz-element-title title="Berlin Wall Falls"></quiz-element-title>
 * </quiz-title>
 * 
 * <!-- With custom titles array -->
 * <quiz-title titles='["Event 1", "Event 2", "Event 3"]'>
 * </quiz-title>
 * ```
 * 
 * @slot - Container for quiz-element-title components
 * 
 * @fires title-dropped-in-titles - Fired when a title is dropped back in this container
 * 
 * @cssproperty --titles-background - Background color of the titles container
 * @cssproperty --titles-border - Border style for the container
 * @cssproperty --dragging-background - Background color during drag operations
 * @cssproperty --dragging-border - Border color during drag operations
 */
@customElement("quiz-title")
export class QuizTitles extends LitElementWw {
  /**
   * Array of title strings for the quiz.
   * @attr titles
   */
  @property({ type: Array, attribute: true, reflect: true }) titles;

  /**
   * Tab index for keyboard navigation accessibility.
   * @attr tab-index
   */
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;

  /**
   * Whether this container has title child elements.
   * @attr title-children
   */
  @property({ type: Boolean, attribute: true, reflect: true }) accessor titleChildren;

  /** Title element container (unused) */
  @query("title-element") accessor title_element: HTMLDivElement;

  static styles = css`
    .border {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-start;
      border: 1px solid #d6d6da;
      background: #f7f7f8;
      border-radius: 5px;
      padding: 10px;
      box-sizing: border-box;
      min-height: 70px;
      width: 100%;
      max-height: 100%;
      height: 100%;
      overflow-y: scroll;
    }
    .dragging {
      background: #e5f4fc;
      border: 2px solid #83b9e0;
    }
  `;

  static get scopedElements() {
    return {
      "sl-icon": SlIcon,
    };
  }

  /**
   * Randomizes the order of title elements within the container.
   * Called to shuffle quiz titles for variety between quiz attempts.
   */
  randomiseTitleOrder() {
    [...this.children]
      .sort(() => Math.random() - 0.5)
      .forEach((title) => this.appendChild(title));
  }

  /**
   * Handles drop events when titles are dropped back into this container.
   * Dispatches a custom event to notify the parent quiz component about the drop.
   * 
   * @fires title-dropped-in-titles - Custom event indicating a title was returned
   */
  droppingTitles() {
    this.dispatchEvent(
      new CustomEvent("title-dropped-in-titles", {
        detail: { target: this },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html` <div
      id="title"
      class="border"
      lable="Titles"
      @drop=${this.droppingTitles}
    >
      <slot></slot>
    </div>`;
  }
}