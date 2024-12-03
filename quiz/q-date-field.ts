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
      margin-left: 10px;
      /* margin-right: 10px; */
      margin-top: 10px;
      margin-bottom: 10px;
      box-sizing: border-box;
      min-height: 50px; 
    }
    .date-border {
      background: white;
      border: 1px solid  #d6d6da;
      border-radius: 5px;
      margin: 5px;
      max-width: 250px;
      text-align: center; 
      color: #666;
      font-weight: 400;
    }
    .drop-section {
      background: white;
      border: 2px dashed #d6d6da;
      border-radius: 7px;
      margin: 5px;
      text-align: center; 
      width: 100px; 
      height: 35px;
      padding: 10px;
    }
    .drop-section[dragover] {
      background: white;
      border: 2px dashed #83b9e0;
      border-radius: 7px;
      margin: 5px;
      text-align: center; 
      width: 100px; 
      height: 35px;
      padding: 10px;
      color: #666666;
    }
    .drop-section[dropped] {
      background: white;
      border: 2px solid #d6d6da;
      border-radius: 7px;
      margin: 5px;
      text-align: center; 
      width: 100px; 
      min-height: 35px;
      padding: 10px;
      font-weight: 500;
      font-size: 1.15rem;
      color: #333333;
    }
    .drop-section[quiz-result="match"] {
      background: #b3eab5;
      color: #4aad4d;
      border: 2px solid #4aad4d;
      border-radius: 7px;
      margin: 5px;
      text-align: center; 
      width: 100px; 
      min-height: 35px;
      padding: 10px;
      font-weight: 450;
      font-size: 1.125rem;
    }
    .drop-section[quiz-result="mismatch"] {
      background: #f5d1ce;
      color:#c92c1b;
      border: 2px solid #e58e85;
      border-radius: 7px;
      margin: 5px;
      text-align: center; 
      width: 100px; 
      min-height: 35px;
      padding: 10px;
    }
  `;


  @property({ type: Array, attribute: true, reflect: true }) dates;
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;
  
  render() {
    return html`
    <div id="date" class="border" lable="My Timeline">
    </div>
    `;
  }
}

