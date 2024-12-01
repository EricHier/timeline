import { LitElement, html, PropertyValues, css } from "lit";
import { LitElementWw } from "@webwriter/lit";
import { customElement, property, query } from "lit/decorators.js";

import "@shoelace-style/shoelace/dist/themes/light.css";


@customElement('quiz-titles')

export class QuizTitles extends LitElementWw {
  static styles = css` `;

  @property({ type: Array, attribute: true, reflect: true }) titles;
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;
  
  
  render() {
    return html`
    `;
  }
}

