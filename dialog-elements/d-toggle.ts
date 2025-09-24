import { html, css } from "lit";
import { LitElementWw } from "@webwriter/lit";
import { customElement, property } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/themes/light.css";

/**
 * Toggle switch component for timeline dialog forms.
 * 
 * A custom toggle switch specifically designed for switching between single date
 * and time period modes in timeline event creation. Features smooth animations
 * and responsive design.
 * 
 * Features:
 * - **Smooth Animation**: CSS transitions for toggle movement
 * - **Dual Labels**: Shows "Single Date" and "Time Period" options
 * - **Responsive Design**: Adapts to different screen sizes
 * - **Custom Styling**: Matches timeline dialog theme
 * - **Accessibility**: Proper keyboard navigation support
 * 
 * The toggle automatically updates the parent dialog's time period mode
 * and enables/disables the end date picker accordingly.
 * 
 * @example
 * ```html
 * <!-- Basic toggle -->
 * <dialog-toggle></dialog-toggle>
 * 
 * <!-- Pre-selected time period mode -->
 * <dialog-toggle useTimePeriod="true"></dialog-toggle>
 * ```
 * 
 * @fires toggle-change - Fired when the toggle state changes
 * 
 * @cssproperty --toggle-background - Background color of the toggle
 * @cssproperty --toggle-border - Border style for the toggle
 * @cssproperty --toggle-active-background - Background color of active state
 * @cssproperty --toggle-active-border - Border color of active state
 */
@customElement("dialog-toggle")
export class DialogToggle extends LitElementWw {
  /**
   * Whether the toggle is in time period mode.
   * When true, shows "Time Period" as selected; when false, shows "Single Date".
   * @attr use-time-period
   */
  @property({ type: Boolean }) accessor useTimePeriod = false;

  /**
   * Tab index for keyboard navigation accessibility.
   * @attr tab-index
   */
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;

  static styles = css`
    .toggle {
      min-height: 15px;
      width: 100%;
      background-color: #ffffff;
      border-radius: 40px;
      border: 1px solid #d6d6da;
      position: relative;
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 2px;
      box-sizing: border-box;
      /* margin-bottom: 8px; */
    }
    input[type="checkbox"] {
      display: none;
    }
    .toggle label {
      width: 50%;
      height: 100%;
      border-radius: 40px;
      position: absolute;
      background-color: #e5f4fc;
      border: 1px solid #83b9e0;
      transition: transform 0.5s ease;
      z-index: 1;
      cursor: pointer;
      left: 0;
      margin: 0;
      box-sizing: border-box;
    }
    input[type="checkbox"]:checked + label {
      transform: translateX(100%);
    }
    .labels-container {
      display: flex;
      justify-content: space-between;
      width: 100%;
      position: relative;
      z-index: 2;
    }
    .label {
      flex: 1;
      font-size: 0.75em;
      color: black;
      text-align: center;
      padding: 8px;
      word-wrap: break-word;
      hyphens: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 15px;
    }
    .label-left {
      margin-right: auto;
    }
    .label-right {
      margin-left: auto;
    }
    @media (max-width: 300px) {
      .toggle {
        min-height: 50px;
      }
      .label {
        font-size: 0.7em;
      }
    }
  `;

  render() {
    return html`
      <div class="toggle" 
      @click="${this.toggleChange}">
        <input
          type="checkbox"
          id="time-period"
          .checked="${this.useTimePeriod}"
        />
        <label for="time-period"></label>

        <div class="labels-container">
          <span class="label label-left">Single Date</span>
          <span class="label label-right">Time Period</span>
        </div>
      </div>
    `;
  }

  /**
   * Handles toggle state changes and dispatches custom event.
   * Called when the user clicks the toggle to switch between single date
   * and time period modes.
   * 
   * @fires toggle-change - Custom event with the new useTimePeriod state
   */
  toggleChange() {
    this.useTimePeriod = !this.useTimePeriod;
    this.dispatchEvent(
      new CustomEvent("toggle-change", {
        detail: { useTimePeriod: this.useTimePeriod },
        bubbles: true,
        composed: true,
      })
    );
  }
 
}
