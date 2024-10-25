import {LitElement, html, PropertyValues, css} from "lit"
import {LitElementWw} from "@webwriter/lit"
import {customElement, property} from "lit/decorators.js"
// import { TempusDominus } from 'tempus-dominus';
// import 'tempus-dominus/dist/css/tempus-dominus.css';

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
// import { TimelineDate } from "../timeline-date";


@customElement("webwriter-timeline")

export class WebWriterTimeline extends LitElementWw {
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;
  


  static get styles() {
    return css`
    
    .label-on-left {
      --label-width: 6.1rem;
      --gap-width: 1rem;
    }
  
    .label-on-left + .label-on-left {
      margin-top: var(--sl-spacing-medium);
    }
  
    .label-on-left::part(form-control) {
      display: grid;
      grid: auto / var(--label-width) 1fr;
      gap: var(--sl-spacing-3x-small) var(--gap-width);
      align-items: center;
    }
  
    .label-on-left::part(form-control-label) {
      text-align: right;
    }
  
    .label-on-left::part(form-control-help-text) {
      grid-column-start: 2;
    }
  `;
  }

  static get scopedElements() {
    return {
      "event-container": EventContainer,
      
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
      
        <sl-dialog  class="dialog-width" label="Add a Timline Event" style="--width: 50vw;" >

          <sl-input  class="label-on-left" label="Title" placeholder="Enter the title" id="eventTitle" required clearable></sl-input>  <br />
          <sl-textarea  class="label-on-left" label="Description" placeholder="Enter the description" id="eventDescription"  required clearable></sl-textarea>  <br />
          <sl-input  class="label-on-left" label="Start date" type="date"  id="eventStartDate" year></sl-input> 
          <sl-input  class="label-on-left" label="End date"  type="date" year id="eventEndDate"></sl-input>
          <sl-checkbox id="time-period">Add End Date</sl-checkbox>

          
          <sl-button id="savingButton" slot="footer" variant="primary" disabled @click = ${this.addEvent}>Save</sl-button>
          <sl-button id="closingButton" slot="footer" variant="primary">Close</sl-button>

        </sl-dialog>

        <sl-button id="openDialogButton" @click = ${this.enterEventData}>Add Event</sl-button>

        <slot></slot>
      </div>
    `;
  }


//check if input fields are filled, saving only after filled
  checkInput(){
    const dialog = this.shadowRoot?.querySelector('.dialog-width');
    const save_button = this.shadowRoot?.querySelector('sl-button[id="savingButton"]') as SlButton;
    var input_title = dialog.querySelector("#eventTitle") as SlInput;
    var input_description = dialog.querySelector("#eventDescription") as SlInput;
    const checkbox = dialog.querySelector('sl-checkbox[id="time-period"]') as SlCheckbox;
    var input_end_date = dialog.querySelector("#eventEndDate") as SlInput;

    save_button.disabled = (input_title.value == "" || input_description.value == "");
    checkbox.addEventListener('sl-change', event => {
      const target = event.target as HTMLInputElement; // Assumed HTMLInputElement for typical checkbox behavior
      console.log(target.checked ? 'checked' : 'not checked');
      
    });
    // if (checkbox.checked = true){
    //   (input_end_date as SlInput).show();
    // }
  }

  //opening dialog 
  enterEventData(){
    const dialog = this.shadowRoot?.querySelector('.dialog-width');
    const close_button = this.shadowRoot?.querySelector('sl-button[id="closingButton"]');
    const save_button = this.shadowRoot?.querySelector('sl-button[id="savingButton"]');

    var input_title = dialog.querySelector("#eventTitle") as SlInput;
    var input_description = dialog.querySelector("#eventDescription") as SlInput;

    (dialog as SlDialog).show();

    input_title.addEventListener('sl-change', event => {
      const input_field_title = event.target as SlInput;
      this.checkInput()
    });

    input_description.addEventListener('sl-change', event => {
      const input_field_description = event.target as SlInput;
      this.checkInput()
    });


    dialog.addEventListener('sl-after-hide', () => {
      this.resetInputValues();
    });

    close_button.addEventListener('click', () => (dialog as SlDialog).hide());
  }

  //adding data in dialog, adding new event to timeline
  addEvent(){
    const dialog = this.shadowRoot?.querySelector('.dialog-width');
    const save_button = this.shadowRoot?.querySelector('sl-button[id="savingButton"]');
    const timeline_event = new EventContainer();
    var input_title = dialog.querySelector("#eventTitle") as SlInput;
    var input_description = dialog.querySelector("#eventDescription") as SlInput;

    timeline_event.setAttribute('event_title', input_title.value);
    timeline_event.setAttribute('event_description', input_description.value);    

    this.appendChild(timeline_event);

    dialog.addEventListener('sl-after-hide', () => {
      this.resetInputValues();
    });

    (dialog as SlDialog).hide();
  }

  //resetting input values after hiding dialog
  resetInputValues(){
    const dialog = this.shadowRoot?.querySelector('.dialog-width');
    const input_title = dialog.querySelector("#eventTitle") as SlInput;
    const input_description = dialog.querySelector("#eventDescription") as SlInput;

    input_title.value = "";
    input_description.value = "";
  }

}