import { html, css } from "lit";
import { LitElementWw } from "@webwriter/lit";
import { customElement, property } from "lit/decorators.js";
import { QuizElementDate } from "./q-element-date"
import "@shoelace-style/shoelace/dist/themes/light.css";

/**
 * Timeline date display component for quiz interface.
 * 
 * This component renders the timeline portion of the quiz, displaying chronological
 * dates with drop zones where users can place event titles. It provides visual
 * feedback for drag and drop operations and displays quiz results.
 * 
 * Features:
 * - **Timeline Visualization**: Shows dates in chronological order with connecting lines
 * - **Drop Zones**: Interactive areas for dropping event titles
 * - **Visual Feedback**: Color-coded results (green for correct, red for incorrect)
 * - **Drag Management**: Handles title removal during drag operations
 * - **Responsive Design**: Scrollable container for long timelines
 * 
 * @example
 * ```html
 * <quiz-date-field dates='["1969-07-20", "1989-11-09"]'>
 *   <quiz-element-date slot="quiz-element-date" date="1969-07-20">
 *   </quiz-element-date>
 * </quiz-date-field>
 * ```
 * 
 * @slot quiz-element-date - Container for individual date elements with drop zones
 * 
 * @cssproperty --timeline-color - Color of the timeline line
 * @cssproperty --drop-zone-border - Border style for drop zones
 * @cssproperty --match-background - Background color for correct matches
 * @cssproperty --mismatch-background - Background color for incorrect matches
 */
@customElement('quiz-date-field')
export class QuizDateField extends LitElementWw {
  /**
   * Array of date strings for the quiz timeline.
   * @attr dates
   */
  @property({ type: Array, attribute: true, reflect: true }) dates;

  /**
   * Tab index for keyboard navigation accessibility.
   * @attr tab-index
   */
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;
  
  static styles = css`
    .timeline-parent {
      display: flex;
      justify-content: start;
      flex-direction: row;
      position: relative;
      vertical-align: center;
      max-height: 100%; 
    }
    .timeline {
      min-height: 15px; 
      height: auto;
      width: 100%;
      border-left: 2px solid #484848;
      position: relative;
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
      z-index: 4; 
    }
    .drop-section[dropped] {
      border: 3px solid #E0E0E0;
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
      min-width:150px;
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
    .new-date-container {
      display: grid;
      align-items: center;
      position: relative;
      padding-left: 0px;
      width: 100%;
    }
  `;

/**
 * Removes title elements during drag operations.
 * Called when a title is being dragged to another location to prevent duplicates.
 * 
 * @param title - The title text to remove from this container
 */
removeTitleForDragging(title) {
  const titleElements = this.querySelectorAll('quiz-element-title') as NodeListOf<QuizElementDate>;
    titleElements.forEach(element => {
      if(element.title === title) {
        element.remove(); 
      }
    });
}
  
  render() {
    return html`
    <div class="timeline-parent" id="date-container">
          <div  id="date" class="timeline">
            <slot name="quiz-element-date"></slot>
          </div>
    </div>
    `;
  }
}

