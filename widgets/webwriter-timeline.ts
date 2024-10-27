import {LitElement, html, PropertyValues, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property} from "lit/decorators.js"
// import { TempusDominus } from "tempus-dominus";
// import "tempus-dominus/dist/css/tempus-dominus.css";

import "@shoelace-style/shoelace/dist/themes/light.css";

import {
  SlAlert,
  SlButton,
  SlCheckbox,
  SlDialog,
  SlIcon,
  SlInput,
  SlTextarea,
} from "@shoelace-style/shoelace";

import { EventContainer } from "../event-container";
import { TimelineInput } from "../tl-input";
import{ TimelineDialog} from "../tl-dialog";

@customElement("webwriter-timeline")

export class WebWriterTimeline extends LitElementWw {
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;
  


  static get styles() {
    return css`
    `;
  }

  static get scopedElements() {
    return {
      "event-container": EventContainer,
      "timeline-input": TimelineInput,
      "timeline-dialog": TimelineDialog,

      "sl-alert": SlAlert,
      "sl-button": SlButton,
      "sl-checkbox": SlCheckbox,
      "sl-dialog": SlDialog,
      "sl-icon": SlIcon,
      "sl-input": SlInput,
      "sl-textarea": SlTextarea,
    };
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
  }

  render() {
    return html`
      <div>
        <h4>My Timeline</h4>       
      
        <timeline-dialog id="timelineID"></timeline-dialog>


        <!-- <sl-dialog  class="dialog-width" label="Add a Timline Event" style="--width: 50vw;" >
          
          <timeline-input type="input" label="Title" id="eventTitle" placeholder="Enter the title"> </timeline-input>
          
          <timeline-input  type="textarea" label="Description" id="eventDescription" placeholder="Enter the description"> </timeline-input>
          
          <timeline-input label="Start date" id="eventStartDate" placeholder="Enter the description"> </timeline-input>

          <timeline-input label="Start date" id="eventStartDate" placeholder="Enter the description" > </timeline-input>

        
          <br />
          <sl-checkbox id="time-period">Add End Date</sl-checkbox>

          
          <sl-button id="savingButton" slot="footer" variant="primary" disabled @click = ${this.addEvent}>Save</sl-button>
          <sl-button id="closingButton" slot="footer" variant="primary">Close</sl-button>

        </sl-dialog> -->

        <sl-button id="addButton"  @click=${this.changeVisibility} >Add Event</sl-button>

        <slot></slot>
      </div>
    `;
  }


//check if input fields are filled, saving only after filled
  checkInput(){
    const dialog = this.shadowRoot?.querySelector(".dialog-width");
    const save_button = this.shadowRoot?.querySelector('sl-button[id="savingButton"]') as SlButton;
    var input_title = dialog.querySelector("#eventTitle") as TimelineInput;
    var input_description = dialog.querySelector("#eventDescription") as TimelineInput;
    const checkbox = dialog.querySelector('sl-checkbox[id="time-period"]') as SlCheckbox;
    var input_end_date = dialog.querySelector("#eventEndDate") as TimelineInput;

    save_button.disabled = (input_title.value == "" || input_description.value == "");

    checkbox.addEventListener("sl-change", event => {
      const target = event.target as HTMLInputElement;
      console.log(target.checked ? "checked" : "not checked");
      
    });
   
  }

  //opening dialog 
  enterEventData(){
    const dialog = this.shadowRoot?.querySelector(".dialog-width");
    const close_button = this.shadowRoot?.querySelector('sl-button[id="closingButton"]');
    const save_button = this.shadowRoot?.querySelector('sl-button[id="savingButton"]');

    var input_title = dialog.querySelector("#eventTitle") as TimelineInput;
    var input_description = dialog.querySelector("#eventDescription") as TimelineInput;

    (dialog as SlDialog).show();

    input_title.addEventListener("sl-change", event => {
      const input_field_title = event.target as SlInput;
      this.checkInput()
    });

    input_description.addEventListener("sl-change", event => {
      const input_field_description = event.target as SlInput;
      this.checkInput()
    });


    dialog.addEventListener("sl-after-hide", () => {
      // this.resetInputValues();
    });

    close_button.addEventListener("click", () => (dialog as SlDialog).hide());
  }

  //adding data in dialog, adding new event to timeline
  addEvent(){
    const dialog = this.shadowRoot?.querySelector(".dialog-width");
    const save_button = this.shadowRoot?.querySelector('sl-button[id="savingButton"]');
    const timeline_event = new EventContainer();
    var input_title = dialog.querySelector("#eventTitle") as TimelineInput;
    var input_description = dialog.querySelector("#eventDescription") as TimelineInput;

    timeline_event.setAttribute("event_title", input_title.value);
    timeline_event.setAttribute("event_description", input_description.value);    

    this.appendChild(timeline_event);

    dialog.addEventListener("sl-after-hide", () => {
      // this.resetInputValues();
    });

    (dialog as SlDialog).hide();
  }

  //resetting input values after hiding dialog
  // resetInputValues(){
  //   const dialog = this.shadowRoot?.querySelector(".dialog-width");
  //   const input_title = dialog.querySelector("#eventTitle") as SlInput;
  //   const input_description = dialog.querySelector("#eventDescription") as SlInput;

  //   input_title.value = "";
  //   input_description.value = "";
  // }


  changeVisibility(){
    const dialog = this.shadowRoot?.querySelector("#timelineID") as TimelineDialog;
    debugger;
    dialog.showDialog();
}

}