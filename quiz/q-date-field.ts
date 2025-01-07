import { LitElement, html, PropertyValues, css } from "lit";
import { LitElementWw } from "@webwriter/lit";
import { customElement, property, query } from "lit/decorators.js";

import "@shoelace-style/shoelace/dist/themes/light.css";


@customElement('quiz-date-field')

export class QuizDateField extends LitElementWw {
  static styles = css`
    /* .border {
      border: 1px solid  #d6d6da;
      background: #f7f7f8;
      border-radius: 5px;
      width: 100%; 
       margin-left: 10px; 
       margin-right: 10px; 
       margin-top: 10px; 
       margin-bottom: 10px; 
      box-sizing: border-box;
      min-height: 50px; 
      max-width:100%;
    } */
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
    .quiz-element {
      grid-template-columns: auto auto; 
      display: grid;
      align-items: flex-start;
      padding: 16px;
      padding-top: 5px;
      padding-left: 0px;
      position: relative;
      width: 100%;
      /* display: flex; */
      /* min-height:60px;     */
    }
    .quiz-element:first-child {
      display: grid;
      grid-template-columns: auto auto; 
      
      align-items: flex-start;
      padding: 16px;
      padding-top: 5px;
      padding-left: 0px;
      position: relative;
      width: 100%;
    }
    .date-element {
      /* background: white; */
      /* border: 1px solid  #d6d6da;
      border-radius: 5px; */
      font-size: 14px;
      font-weight: 700;
      color: #484848;
      grid-column: 1;
      grid-row: 1;
      padding-left: 7px;
      padding-right: 5px;
      width: 100%; 
      height:auto;
      text-align: left; 
      color: #666;
    }
    .drop-section {
      /* grid-column: 2;
      grid-row: 1; */
      display: flex;
      align-items: center;  
      justify-content: center;  
      background: white;
      border: 2px dashed #d6d6da;
      border-radius: 7px;
      margin-right: 5px;
      /* min-width: auto;  */
      min-height: 45px;
      min-width: 50px;
      width: max-content;
      padding: 8px;
      /* max-width: auto;  */
      flex-direction: column;
      flex-wrap: wrap; 
      box-sizing: border-box;
      transform: translateX(-3.5px);
      padding-top:8px;
      padding-bottom:8px;
    }
    .drop-section[dragover] {
      border: 2px dashed #83b9e0;
    }

    .drop-section[dropped] {
      border: 3px solid #E0E0E0;
      border-radius: 5px;
      font-weight: 500;
      font-size: 16px;
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

    .date-line {
      min-width:50px;
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
      /* grid-column: 1;
      grid-row: 1; */
      /* display: flex; */
      /* align-items: flex-start; */
      
      padding-left: 0px;
      /* position: relative; */
      width: 100%;
      /* display: grid; */
      /* align-items: center; */
    }
  `;


  @property({ type: Array, attribute: true, reflect: true }) dates;
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;
  
  render() {
    return html`
    <div class="timeline-parent">
          <div  id="date" class="timeline">
            <!-- <slot name="quiz-slot"></slot> -->
          </div>
    </div>
    `;
  }
}

