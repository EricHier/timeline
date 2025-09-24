import { LitElementWw } from "@webwriter/lit";
import { customElement, property } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/themes/light.css";
import { EventContainer } from "./event-container.component";
import { TimelineDialog } from "./tl-dialog";
import { WebWriterTimeline } from "./widgets/webwriter-timeline";
import { TlEventData } from "./tl-event-data";

/**
 * Event management system for timeline operations.
 * 
 * This component handles all timeline event operations including adding, removing,
 * and sorting events within the timeline. It serves as a controller that coordinates
 * between the timeline dialog, event containers, and the main timeline component.
 * 
 * Key responsibilities:
 * - **Event Creation**: Creates new event-container elements from dialog data
 * - **Event Removal**: Handles deletion of timeline events
 * - **Automatic Sorting**: Maintains chronological order of events
 * - **Dialog Management**: Coordinates with timeline dialog for event creation
 * - **State Management**: Manages timeline state during event operations
 * 
 * The event manager automatically sorts events by date whenever new events are added,
 * ensuring the timeline maintains proper chronological order.
 * 
 * @example
 * ```html
 * <!-- Event manager is typically used internally -->
 * <event-manager></event-manager>
 * ```
 * 
 * @fires request-remove - Relayed from event containers for event deletion
 * @fires request-add - Processed from timeline dialog for event creation
 */
@customElement("event-manager")
export class EventManager extends LitElementWw {
  /**
   * Tab index for keyboard navigation accessibility.
   * @attr tab-index
   */
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;

  static get scopedElements() {
    return {
      "event-container": EventContainer,
      "timeline-dialog": TimelineDialog,
      "webwriter-timeline": WebWriterTimeline,
    };
  }

  /**
   * Creates and adds a new event to the timeline from dialog data.
   * 
   * This method processes event data from the timeline dialog, creates a new
   * event-container element, configures it with the provided data, and adds it
   * to the timeline. After adding, it automatically sorts all timeline events
   * by date and closes the dialog.
   * 
   * @param event - Custom event containing the event data (title, dates)
   * @param timeline - The timeline element to add the event to
   */
  addEvent(event: CustomEvent<TlEventData>, timeline) {
    const tldialog = timeline?.shadowRoot?.querySelector( "timeline-dialog" ) as TimelineDialog;
    const { title, startDate, endDate } = event.detail;
    // const timeline_event = new EventContainer();
    const timeline_event = document.createElement("event-container");

    timeline_event.setAttribute("event_title", title);
    timeline_event.setAttribute("event_startDate", JSON.stringify(startDate));
    if (endDate !== undefined) {
      timeline_event.setAttribute("event_endDate", JSON.stringify(endDate));
    }
    timeline_event.setAttribute("slot", "event-slot");

    timeline.appendChild(timeline_event);
    this.sortEvents(timeline);
    tldialog.hideDialog();
  }

  /**
   * Removes an event from the timeline.
   * 
   * Handles the removal of a specific event container from the timeline
   * when requested through the event removal system.
   * 
   * @param event - Custom event containing the ID of the event to remove
   */
  removeEvent(event) {
    const eventToRemove = event.detail.id;
    const timeline = document.querySelector( "webwriter-timeline" ) as WebWriterTimeline;
    const tlslot = timeline.shadowRoot.querySelector('slot[name="event-slot"]');
    const eventContainer = timeline.querySelector(
      `event-container[id="${eventToRemove}"]`
    );

    if (eventContainer) {
      timeline.removeChild(eventContainer);
    }
  }

  /**
   * Sorts all timeline events in chronological order.
   * 
   * Automatically reorders all event-container elements within the timeline
   * based on their start dates, ensuring proper chronological sequence.
   * Uses the event container's getStartDate() method for date comparison.
   * 
   * @param timeline - The timeline element containing events to sort
   */
  sortEvents(timeline) {
    [...timeline.children]
      .sort((a: EventContainer, b: EventContainer) => {
        return a.getStartDate().isAfter(b.getStartDate()) ? 1 : -1;
      })
      .forEach((node) => timeline.appendChild(node));
  }
}
