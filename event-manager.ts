import {LitElement, html, PropertyValues, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property} from "lit/decorators.js"

import "@shoelace-style/shoelace/dist/themes/light.css";
import {
  
} from "@shoelace-style/shoelace";

import { EventContainer } from "./event-container";
import { TimelineInput } from "./tl-input";
import{ TimelineDialog} from "./tl-dialog";

@customElement("event-manager")

export class EventManager extends LitElementWw {  

  static styles = css`
  `;

  static get scopedElements() {
    return {      
      "event-container": EventContainer,
      "timeline-input": TimelineInput,
      "timeline-dialog": TimelineDialog,
    };
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
  }


  render() {
        return html`
        `;
      } 

      

  

}
