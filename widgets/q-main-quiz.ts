import {LitElement, html, PropertyValues, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property} from "lit/decorators.js"

import "@shoelace-style/shoelace/dist/themes/light.css";

import {
SlButton,
} from "@shoelace-style/shoelace";

import { WebWriterTimeline } from "../widgets/webwriter-timeline";

@customElement("main-quiz")

export class MainQuiz extends LitElementWw {
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;

  static get styles() {
    return css`
    .border {
      border: 1px solid lightgray;
      border-radius: 5px;
      min-height: 700px;
      width: 100%,
    }

    #parent >* {
      margin-left: 10px;
      margin-right: 10px;
    }
    
    h4 {
      text-align: center; 
    }
    :host(:not([contenteditable=true]):not([contenteditable=""])) .author-only {
        display: none;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid black;
      padding: 8px;
      text-align: left;
    }
  `;
  }

  static get scopedElements() {
    return {
    "webwriter-timelin": WebWriterTimeline,
    "sl-button":SlButton,
    };
  }

  render() {
    return html`
        <div class="border" id="parent">
            <h4>My Quiz</h4>    
            <p id="quizP"></p>
            <table id="quizTable">
                <tr>
                    <th>Date</th>
                    <th>Title</th>
                </tr>
                <!-- <slot name="quizSlot"></slot> -->
                <tr>
                    <td>
                        <slot name="quizDate"></slot>
                    </td>
                    <td>
                        <slot name="quizTitle"></slot>
                    </td>
                </tr>
            </table>
        </div>
    `;
  }


  appendRow(date, title) {
    const row = document.createElement("p");
    const sec_row = document.createElement("p");
    row.setAttribute("slot","quizDate");
    sec_row.setAttribute("slot","quizTitle");

    // row.innerHTML = `<td>${date}</td><td>${title}</td>`;
    row.innerHTML = `${date}`;
    sec_row.innerHTML = `${title}`;

    this.appendChild(row);
    this.appendChild(sec_row);
    console.log("events added to table")
  } 
}