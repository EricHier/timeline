import { LitElementWw } from "@webwriter/lit";
import { customElement, property } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/themes/light.css";
import { EventContainer } from "./event-container.component";
import { TimelineDialog } from "./tl-dialog";
import { WebWriterTimeline } from "./widgets/webwriter-timeline";
import { TlEventData } from "./tl-event-data";

@customElement("event-manager")
export class EventManager extends LitElementWw {
  @property({ type: Number, attribute: true, reflect: true }) accessor tabIndex = -1;

  static get scopedElements() {
    return {
      "event-container": EventContainer,
      "timeline-dialog": TimelineDialog,
      "webwriter-timeline": WebWriterTimeline,
    };
  }

  // adding event to webwriter-timeline slot by creating event-container, sorting all appended events 
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

  // dispatch remove request of event to timeline
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

  // sort timeline events ascending
  sortEvents(timeline) {
    [...timeline.children]
      .sort((a: EventContainer, b: EventContainer) => {
        return a.getStartDate().isAfter(b.getStartDate()) ? 1 : -1;
      })
      .forEach((node) => timeline.appendChild(node));
  }
}
