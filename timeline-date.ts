import {LitElement, html, PropertyValues, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property} from "lit/decorators.js"

import "@shoelace-style/shoelace/dist/themes/light.css";
import {
  SlOption,
  SlIcon,
} from "@shoelace-style/shoelace";

interface TimelineDateType {
  day?: number;
  month?: number;
  year: number;
}


@customElement("event-container")
export class TimelineDate extends LitElementWw {
  @property({ type: Number }) day?: number;
  @property({ type: Number }) month?: number;
  @property({ type: Number }) year?: number;

@property({type: String, attribute: true, reflect: true }) accessor date_day : string = 'Day';
@property({type: String, attribute: true, reflect: true }) accessor date_month : string = 'Month';
@property({type: String, attribute: true, reflect: true }) accessor date_year : string = 'Year';


@property({ type: Number, attribute: true, reflect: true })
accessor tabIndex = -1;

static get styles() {
  return css`
`}

render() {
}

}