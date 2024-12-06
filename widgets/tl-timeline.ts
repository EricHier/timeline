import { LitElement, html, PropertyValues, css } from "lit";
import { LitElementWw } from "@webwriter/lit";
import { customElement, property, query } from "lit/decorators.js";

import "@shoelace-style/shoelace/dist/themes/light.css";

import { SlButton, SlDialog, SlIcon, SlInput } from "@shoelace-style/shoelace";

@customElement("tl-timeline")
export class TlTimeline extends LitElementWw {
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;
  @property({ type: Boolean, attribute: true, reflect: true }) accessor openQuiz = false;

   static get styles() {
    return css`
    `;
  }

  static get scopedElements() {
    return {
    };
  }

  render() {
    return html`
    `;
  }
}
