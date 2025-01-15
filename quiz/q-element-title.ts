import { LitElement, html, PropertyValues, css } from "lit";
import { LitElementWw } from "@webwriter/lit";
import { customElement, property, query } from "lit/decorators.js";

import "@shoelace-style/shoelace/dist/themes/light.css";


@customElement('quiz-element-title')

export class QuizElementTitle extends LitElementWw {

    @query("date-element") accessor title_element: HTMLDivElement;
    @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;
    @property({ type: String, attribute: true, reflect: true }) accessor title;
    @property({ type: Boolean, attribute: true, reflect: true }) accessor dropped = true; 

  static styles = css`
  .title-border {
      display: flex;
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
      overflow-x: scroll;
      flex-direction: row;
    }

    .dragging {
      background: #e5f4fc;
      border: 2px solid #83b9e0;
    }
    sl-icon {
      margin-left: 8px;
      cursor: pointer;
    }
  `;
  static get scopedElements() {
    return {
    };
  }

private handleDragStart(event: DragEvent) {
    const dragElement = this.shadowRoot?.querySelector('.title-border');
    dragElement?.classList.add("dragging");
    event.dataTransfer?.setData("text/plain", this.title);
  }
  
private handleDragEnd() {
    this.classList.remove("dragging");

    this.dispatchEvent(
        new CustomEvent("title-remove", {
          detail: {
          title: this,
          },
          bubbles: true,
          composed: true,
        })
    );
}

  render() {
    return html`
        <div 
        class="title-border"
        id="${this.title}"
        draggable="true"
        @dragstart=${this.handleDragStart}
        @dragend=${this.handleDragEnd}
        > ${this.title}
        </div>
    `;
  }
}