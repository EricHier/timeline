import { html, css } from "lit";
import { LitElementWw } from "@webwriter/lit";
import { customElement, property } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/themes/light.css";
import { SlInput } from "@shoelace-style/shoelace";

/**
 * Input component for timeline dialog forms.
 * 
 * A specialized input wrapper that provides consistent styling and behavior
 * for use within timeline dialogs. Supports both single-line input and textarea
 * modes with validation states and accessibility features.
 * 
 * Features:
 * - Consistent styling with dialog theme
 * - Support for required field validation
 * - Clearable input functionality
 * - Responsive width handling
 * - Integration with Shoelace design system
 * 
 * @example
 * ```html
 * <!-- Basic text input -->
 * <dialog-input 
 *   label="Event Title" 
 *   placeholder="Enter event name"
 *   required="true">
 * </dialog-input>
 * 
 * <!-- Textarea input -->
 * <dialog-input 
 *   type="textarea"
 *   label="Event Description" 
 *   placeholder="Describe the event">
 * </dialog-input>
 * 
 * <!-- Disabled input -->
 * <dialog-input 
 *   label="Read Only Field" 
 *   value="Cannot edit"
 *   disabled="true">
 * </dialog-input>
 * ```
 * 
 * @fires sl-change - Fired when the input value changes
 * @fires sl-input - Fired on each keystroke
 * 
 * @cssproperty --input-background - Background color of the input
 * @cssproperty --input-border - Border style for the input
 * @cssproperty --input-focus-border - Border style when focused
 */
@customElement("dialog-input")
export class DialogInput extends LitElementWw {
  /**
   * Tab index for keyboard navigation accessibility.
   * @attr tab-index
   */
  @property({ type: Number, attribute: true, reflect: true })
  accessor tabIndex = -1;

  /**
   * Label text displayed above the input field.
   * @attr label
   */
  @property({ type: String }) accessor label = "";

  /**
   * Unique identifier for the input element.
   * @attr id
   */
  @property({ type: String }) accessor id = "";

  /**
   * Current value of the input field.
   * @attr value
   */
  @property({ type: String }) accessor value = "";

  /**
   * Placeholder text shown when input is empty.
   * @attr placeholder
   */
  @property({ type: String }) accessor placeholder = "";

  /**
   * Whether the input field is required for form validation.
   * @attr required
   */
  @property({ type: Boolean, reflect: true }) accessor required = false;

  /**
   * Whether the input field is disabled.
   * @attr disabled
   */
  @property({ type: Boolean, reflect: true }) accessor disabled;

  /**
   * Type of input component - 'input' for single line, 'textarea' for multi-line.
   * @attr type
   */
  @property({ type: String }) accessor type: "input" | "textarea";

  static styles = css`
    :host {
      display: block;
      /* margin-bottom: 20px; */
    }
    .half-input {
      min-width: 45%;
    }
  `;

  static get scopedElements() {
    return {
      "sl-input": SlInput,
    };
  }

  render() {
    return html`
      <sl-input
        label=${this.label}
        id=${this.id}
        .value=${this.value}
        placeholder=${this.placeholder}
        ?required=${this.required}
        @sl-change=${this.setTnput}
        clearable
      ></sl-input>
    `;
  }

  /**
   * Updates the component's value when the input changes.
   * Called automatically by the sl-change event from the Shoelace input.
   * 
   * @param event - The change event from the input element
   */
  setTnput(event) {
    this.value = event.target.value;
  }
}
