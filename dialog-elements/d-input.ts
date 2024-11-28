import { LitElement, html, PropertyValues, css } from "lit";
import { LitElementWw } from "@webwriter/lit";
import { customElement, property } from "lit/decorators.js";

import "@shoelace-style/shoelace/dist/themes/light.css";

import { SlInput, SlTextarea } from "@shoelace-style/shoelace";

@customElement("dialog-input")
export class DialogInput extends LitElementWw {
  @property({ type: Number, attribute: true, reflect: true })
  accessor tabIndex = -1;
  @property({ type: String }) accessor label = "";
  @property({ type: String }) accessor id = "";
  @property({ type: String }) accessor value = "";
  @property({ type: String }) accessor placeholder = "";
  @property({ type: Boolean, reflect: true }) accessor required = false;
  @property({ type: Boolean, reflect: true }) accessor disabled;
  @property({ type: String }) accessor type: "input" | "textarea";

  static styles = css`
    :host {
      display: block;
      margin-bottom: 20px;
    }
    .half-input {
      min-width: 45%;
    }
  `;

  static get scopedElements() {
    return {
      "sl-input": SlInput,
      "sl-textarea": SlTextarea,
    };
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {}

  render() {
    return html`
      <sl-input
        label=${this.label}
        id=${this.id}
        .value=${this.value}
        placeholder=${this.placeholder}
        ?required=${this.required}
        @sl-change=${this.checkInput}
        clearable
      ></sl-input>
    `;
  }

  checkInput(event) {
    this.value = event.target.value;
  }
}
