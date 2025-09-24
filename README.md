# Timeline (`@webwriter/timeline@1.0.5`)
[License: MIT](LICENSE) | Version: 1.0.5

Create/learn with a digital timeline and test your knowledge.

## Snippets
[Snippets](https://webwriter.app/docs/snippets/snippets/) are examples and templates using the package's widgets.

| Name | Import Path |
| :--: | :---------: |
| Women In Tech | @webwriter/timeline/snippets/women-in-tech.html |
| History Of Olympic Games | @webwriter/timeline/snippets/history-of-olympic-games.html |



## `WebWriterTimeline` (`<webwriter-timeline>`)
Interactive timeline widget for WebWriter applications.

This web component creates an interactive timeline that allows users to:
- Create and manage timeline events with dates and descriptions
- Switch between timeline creation and quiz modes
- Test knowledge with drag-and-drop quiz functionality
- Customize panel visibility (timeline only, quiz only, or both)
- Configure quiz feedback options

The component consists of two main panels:
1. **Timeline Panel**: For creating and editing timeline events
2. **Quiz Panel**: For testing knowledge with interactive quiz features

### Usage

Use with a CDN (e.g. [jsdelivr](https://jsdelivr.com)):
```html
<link href="https://cdn.jsdelivr.net/npm/@webwriter/timeline/widgets/webwriter-timeline.css" rel="stylesheet">
<script type="module" src="https://cdn.jsdelivr.net/npm/@webwriter/timeline/widgets/webwriter-timeline.js"></script>
<webwriter-timeline></webwriter-timeline>
```

Or use with a bundler (e.g. [Vite](https://vite.dev)):

```
npm install @webwriter/timeline
```

```html
<link href="@webwriter/timeline/widgets/webwriter-timeline.css" rel="stylesheet">
<script type="module" src="@webwriter/timeline/widgets/webwriter-timeline.js"></script>
<webwriter-timeline></webwriter-timeline>
```

## Fields
| Name (Attribute Name) | Type | Description | Default | Reflects |
| :-------------------: | :--: | :---------: | :-----: | :------: |
| `tabIndex` (`tabIndex`) | `number` | Tab index for keyboard navigation accessibility. | `-1` | ✓ |
| `currentPanel` (`currentPanel`) | `string` | Currently active panel ('timeline' or 'quiz'). | - | ✓ |
| `_panelVisibility` (`panelvisibility`) | `string` | Controls which panels are visible in the interface. | - | ✓ |
| `quizFeedbackOption` (`quizFeedbackOption`) | - | Selected quiz feedback option (1-4).<br>Determines what feedback is shown after quiz completion:<br>- 1: Show correct answers only<br>- 2: Show score and correct answers<br>- 3: Show detailed explanations<br>- 4: Show progress tracking | - | ✓ |
| `quizFeedbackSelecter` | `SlSelect` | Quiz feedback selection dropdown element | - | ✗ |
| `quiz` | `MainQuiz` | Main quiz component instance | - | ✗ |
| `dialog` | `TimelineDialog` | Timeline dialog component for creating/editing events | - | ✗ |
| `timelinePanel` | `SlTab` | Timeline panel tab element | - | ✗ |
| `quizPanel` | `SlTab` | Quiz panel tab element | - | ✗ |
| `quizToggle` | `SlSwitch` | Toggle switch for enabling/disabling quiz functionality | - | ✗ |
| `feedbackError` | `HTMLDivElement` | Error message container for quiz feedback validation | - | ✗ |
| `addToolTip` | `SlTooltip` | Tooltip for the add event button | - | ✗ |
| `tabGroup` | `SlTabGroup` | Tab group container for switching between panels | - | ✗ |
| `WebWriterTimeline.scopedElements` | - | - | - | ✗ |

*Fields including [properties](https://developer.mozilla.org/en-US/docs/Glossary/Property/JavaScript) and [attributes](https://developer.mozilla.org/en-US/docs/Glossary/Attribute) define the current state of the widget and offer customization options.*

## Methods
| Name | Description | Parameters |
| :--: | :---------: | :-------: |
| `checkSelectedTab` | Handles tab selection changes between timeline and quiz panels.<br>Automatically starts quiz mode when quiz panel is selected and initializes <br>the current panel state. | `selectedTab`
| `openingTLDialog` | Opens the timeline dialog for creating or editing events.<br>This method triggers the timeline dialog to become visible,<br>allowing users to add new events to the timeline. | -
| `startQuiz` | Initializes and starts the quiz with current timeline events.<br>Collects all child event elements and passes them to the quiz component<br>for creating quiz questions. | -
| `saveQuizSelection` | Saves the selected quiz feedback option and validates the selection.<br>Updates the quiz feedback display based on user selection and shows/hides<br>validation errors as appropriate. | -

*[Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions) allow programmatic access to the widget.*

## Slots
| Name | Description | Content Type |
| :--: | :---------: | :----------: |
| `event-slot` | Container for timeline events (event-container elements) | event-container* |

*[Slots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots) define how the content of the widget is rendered.*

## Events
| Name | Description |
| :--: | :---------: |
| request-add | Fired when a new event should be added to the timeline |
| request-remove | Fired when an event should be removed from the timeline |
| show-quiz-feedback-error | Fired when quiz feedback validation fails |

*[Events](https://developer.mozilla.org/en-US/docs/Web/Events) are dispatched by the widget after certain triggers.*

## Custom CSS properties
| Name | Description |
| :--: | :---------: |
| --timeline-background | Background color of the timeline area |
| --timeline-border | Border style for timeline elements |
| --quiz-background | Background color of the quiz area |
| --panel-border | Border style for panel separators |

*[Custom CSS properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties) offer defined customization of the widget's style.*

## Editing config
| Name | Value |
| :--: | :---------: |
| `content` | `event-container*` |

*The [editing config](https://webwriter.app/docs/packages/configuring/#editingconfig) defines how explorable authoring tools such as [WebWriter](https://webwriter.app) treat the widget.*

*No public CSS parts.*


## `EventContainer` (`<event-container>`)
undefined

### Usage

Use with a CDN (e.g. [jsdelivr](https://jsdelivr.com)):
```html
<link href="https://cdn.jsdelivr.net/npm/@webwriter/timeline/widgets/event-container.css" rel="stylesheet">
<script type="module" src="https://cdn.jsdelivr.net/npm/@webwriter/timeline/widgets/event-container.js"></script>
<event-container></event-container>
```

Or use with a bundler (e.g. [Vite](https://vite.dev)):

```
npm install @webwriter/timeline
```

```html
<link href="@webwriter/timeline/widgets/event-container.css" rel="stylesheet">
<script type="module" src="@webwriter/timeline/widgets/event-container.js"></script>
<event-container></event-container>
```

## Editing config
| Name | Value |
| :--: | :---------: |
| `content` | `flow*` |
| `uninsertable` | `true` |

*The [editing config](https://webwriter.app/docs/packages/configuring/#editingconfig) defines how explorable authoring tools such as [WebWriter](https://webwriter.app) treat the widget.*

*No public fields, methods, slots, events, custom CSS properties, or CSS parts.*


---
*Generated with @webwriter/build@1.8.1*