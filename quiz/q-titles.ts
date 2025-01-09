import { LitElement, html, PropertyValues, css } from "lit";
import { LitElementWw } from "@webwriter/lit";
import { customElement, property, query } from "lit/decorators.js";

import "@shoelace-style/shoelace/dist/themes/light.css";


@customElement('quiz-title')

export class QuizTitles extends LitElementWw {

  @query("title-element") accessor title_element: HTMLDivElement;
  @property({ type: Array, attribute: true, reflect: true }) titles;
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;
  @property({ type: Boolean, attribute: true, reflect: true }) accessor titleChildren;

  static styles = css`
    .border {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      border: 1px solid #d6d6da;
      background: #f7f7f8;
      border-radius: 5px;
      /* margin: 10px; */
      padding: 10px; 
      box-sizing: border-box;
      min-height: 50px; 
      width: 100%;
    }

    .title-border {
      display: flex;
      flex-direction: column;
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
    }

    .title-border[dragging] {
      background: #e5f4fc;
      border: 2px solid #83b9e0;
    }
  `;

  render() {
    return html`
    <div id="title" class="border" lable="Titles">
    </div>    `;
  }
}

