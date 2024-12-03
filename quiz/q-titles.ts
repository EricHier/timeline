import { LitElement, html, PropertyValues, css } from "lit";
import { LitElementWw } from "@webwriter/lit";
import { customElement, property, query } from "lit/decorators.js";

import "@shoelace-style/shoelace/dist/themes/light.css";


@customElement('quiz-title')

export class QuizTitles extends LitElementWw {

  @query("title-element") accessor title_element: HTMLDivElement;


  static styles = css`
    .border {
        border: 1px solid  #d6d6da;
        background: #f7f7f8;
        border-radius: 5px;
        width: 100%;
        margin-left: 10px;
        margin-right: 10px;
        margin-top: 10px;
        box-sizing: border-box;
        align-items: right; 
        min-height: 50px; 
    }
    .title-border {
      background: white;
      border: 1px solid  #d6d6da;
      border-radius: 3;
      margin: 5px;
      text-align: center; 
      width: 100px;
    }
    .title-border-dragged{
      font: red; 
      background: white;
      border: 1px solid red;
      border-radius: 3;
      margin: 5px;
      text-align: center; 
      width: 100px;
    }
  `;

  @property({ type: Array, attribute: true, reflect: true }) titles;
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;
  
  
  render() {
    return html`
    <div id="title" class="border">
    </div>    `;
  }
}

