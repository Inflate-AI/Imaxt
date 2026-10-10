# Timeline / Event

A chronological sequence, in the order given.

## Data shape

```ts
interface EventData {
  date: string;   // a label, not necessarily a real date: "Step 1", "2024"
  title: string;
  html: string;    // this event's body (plain, <strong>, <em>, <br>)
}

interface TimelineData {
  items: EventData[];
}
```

## EditorJS

`TimelineTool` is composite: one tool manages a repeatable list of Event
entries (date, title, body), with add/remove controls. There is no
separate `EventTool`.

## Astro / MDX

```mdx
<Timeline>
  <Event date="Step 1" title="Propose">A leader suggests a value.</Event>
  <Event date="Step 2" title="Promise">Machines promise to ignore older proposals.</Event>
  <Event date="Step 3" title="Accept">A majority accepts it.</Event>
</Timeline>
```
