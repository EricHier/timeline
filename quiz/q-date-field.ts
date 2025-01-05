import { LitElement, html, PropertyValues, css } from "lit";
import { LitElementWw } from "@webwriter/lit";
import { customElement, property, query } from "lit/decorators.js";

import "@shoelace-style/shoelace/dist/themes/light.css";


@customElement('quiz-date-field')

export class QuizDateField extends LitElementWw {
  static styles = css`
    .border {
      border: 1px solid  #d6d6da;
      background: #f7f7f8;
      border-radius: 5px;
      /* width: 100%; */
      /* margin-left: 10px; */
      /* margin-right: 10px; */
      /* margin-top: 10px; */
      /* margin-bottom: 10px; */
      box-sizing: border-box;
      min-height: 50px; 
      max-width:100%;
    }
    .quiz-element {
      display: grid;
      grid-template-columns: auto auto;
    }
    .date-border {
      /* background: white; */
      /* border: 1px solid  #d6d6da;
      border-radius: 5px; */
      grid-column: 1;
      grid-row: 1;
      margin: 5px;
      max-width: 250px;
      text-align: left; 
      color: #666;
      font-weight: 400;
      flex-direction: column;
      font-size:  1.1rem;
      width: auto; 
      max-width:auto; 
    }
    .drop-section {
      grid-column: 2;
      grid-row: 1;
      display: flex;
      align-items: center;  
      justify-content: center;  
      background: white;
      border: 2px dashed #d6d6da;
      border-radius: 7px;
      margin: 5px;
      min-width: auto; 
      min-height: 35px;
      max-width: auto; 
      flex-direction: column;

      padding: 10px;
      flex-wrap: wrap; 
      box-sizing: border-box;
    }

    .drop-section[dragover] {
      border: 2px dashed #83b9e0;
    }

    .drop-section[dropped] {
      border: 2px solid #d6d6da;
      font-weight: 500;
      font-size: 1.15rem;
      color: #333333;
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
      white-space: nowrap; 
      overflow: hidden;  
      text-overflow: ellipsis;  
    }
    .timeline-parent {
      display: flex;
      justify-content: start;
      flex-direction: row;
      position: relative;
      vertical-align: center;
    }
    .timeline {
      min-height: 15px; 
      height: auto;
      width: 100%;
      border-left: 2px solid #484848;
      position: relative;
      padding-bottom: 50px;
    }
    .timeline-item:last-child {
      margin-bottom: 40px; 
    }
    .timeline::after {
      content: "";
      position: absolute;
      bottom: -10px;
      /* left: 50%; */
      transform: translateX(-58%);
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 10px solid #484848;
    }

  `;


  @property({ type: Array, attribute: true, reflect: true }) dates;
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;
  
  render() {
    return html`
    <!-- <div class="border" lable="My Timeline"> -->
    <div class="timeline-parent">
          <div class="timeline">
            <slot name="quiz-slot"></slot>
      <!-- <div id="date"></div> -->
          </div>
    </div>
    `;
  }
}

