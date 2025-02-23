import { EventContainer } from './event-container.component';

export * from './event-container.component';
export default EventContainer;
customElements.define('event-container',EventContainer);

declare global {
  interface HTMLElementTagNameMap {
    'event-container': EventContainer;
  }
}