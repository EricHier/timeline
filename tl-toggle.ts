import {LitElement, html, PropertyValues, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property} from "lit/decorators.js"
import "@shoelace-style/shoelace/dist/themes/light.css";

@customElement("timeline-toggle")
export class TimelineToggle extends LitElementWw {

  @property({ type: Boolean }) accessor useTimePeriod = false;
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;

  static styles = css`
    /* .toggle-container {
        width: 100%;
        margin-bottom: 16px;
      } */
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
      margin-bottom: 8px;
    }

    input[type='checkbox'] {
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

    input[type='checkbox']:checked + label {
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

  static get scopedElements() {
    return {};
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {}

  render() {
    return html`
    <div class="toggle" @click="${this.toggleState}">
      
      <input type="checkbox"  id="time-period" .checked="${this.useTimePeriod}" />
      <label for="time-period"></label>
      
      <div class="labels-container">
        <span class="label label-left">Single Date</span>
        <span class="label label-right">Time Period</span>
      </div>

    </div>
  `;
  }

  toggleState() {
    this.useTimePeriod = !this.useTimePeriod;
    this.dispatchEvent(new CustomEvent('toggle-change', { detail: { useTimePeriod: this.useTimePeriod }, bubbles: true, composed: true }));
  }

}