import {LitElement, html, PropertyValues, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property} from "lit/decorators.js"


import "@shoelace-style/shoelace/dist/themes/light.css";

import {
  SlInput,
  SlTextarea,
} from "@shoelace-style/shoelace";


@customElement("timeline-input")

export class TimelineInput extends LitElementWw {

  @property({ type: String }) accessor label = "";
  @property({ type: String }) accessor id = "";
  @property({ type: String }) accessor value = "";
  @property({ type: String }) accessor placeholder = "";
  @property({ type: Boolean, reflect: true }) accessor required = false;
  @property({ type: String }) accessor type: "input" | "textarea";



  static styles = css`
  :host {
      display: block;
      margin-bottom: 20px;
    }

    .label-on-left {
      --label-width: 6.1rem;
      --gap-width: 1rem;
    }

    .label-on-left + sl-input.label-on-left {
      margin-top: var(--sl-spacing-medium);
    }

    .label-on-left::part(form-control) {
      display: grid;
      grid-template-columns: var(--label-width) 1fr;
      gap: var(--sl-spacing-3x-small) var(--gap-width);
      align-items: center;
    }

    .label-on-left::part(label) {
      text-align: right;
    }

    .label-on-left::part(help-text) {
      grid-column: 2;
    }
  `;

  static get scopedElements() {
    return {      
      "sl-input": SlInput,
      "sl-textarea": SlTextarea,
    };
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
  }


  render() {
     if (this.type === "textarea"){ 
        return html`
        <sl-textarea 
        class="label-on-left"
          label=${this.label}  
          id=${this.id}
          .value=${this.value}
          placeholder=${this.placeholder}
          ?required=${this.required}
          @sl-change=${this.checkInput}
          clearable
        ></sl-textarea>
        `;
     } else if (this.type === "input"){
        return html`
      <sl-input
        class="label-on-left"
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
      
      //type date
      else {
        return html`
      <sl-input
        class="label-on-left"
        type="date"
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
    }


  checkInput(event){
    this.value = event.target.value;
  }

}
