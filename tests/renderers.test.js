import { describe, it, expect } from "vitest";
import factions from "../data/factions.json";
import timeline from "../data/timeline.json";
const { renderFactionCard } = require("../js/faction-cards.js");
const { renderTimelineMarkers, renderTimelineYears } = require("../js/timeline-render.js");

describe("faction cards", () => {
  it("renders one card per faction with its details", () => {
    const doc = new DOMParser().parseFromString(
      factions.map(renderFactionCard).join(""),
      "text/html"
    );
    expect(doc.querySelectorAll(".faction-card")).toHaveLength(factions.length);
    expect(doc.querySelector(".faction-card h2").textContent).toBe(factions[0].name);
    expect(doc.querySelectorAll(".faction-card")[0].querySelectorAll(".power-item")).toHaveLength(
      factions[0].power.length
    );
  });

  it("escapes text from the data", () => {
    const html = renderFactionCard({ ...factions[0], name: "<img src=x onerror=alert(1)>" });
    const doc = new DOMParser().parseFromString(html, "text/html");
    expect(doc.querySelector("img")).toBeNull();
    expect(doc.querySelector("h2").textContent).toBe("<img src=x onerror=alert(1)>");
  });
});

describe("timeline", () => {
  it("renders every year, arc and event, with a nav marker per year", () => {
    const doc = new DOMParser().parseFromString(renderTimelineYears(timeline), "text/html");
    const arcs = timeline.flatMap((y) => y.arcs);
    expect(doc.querySelectorAll(".timeline-year")).toHaveLength(timeline.length);
    expect(doc.querySelectorAll(".timeline-arc")).toHaveLength(arcs.length);
    expect(doc.querySelectorAll(".timeline-event")).toHaveLength(
      arcs.flatMap((a) => a.events).length
    );
    const markers = new DOMParser().parseFromString(renderTimelineMarkers(timeline), "text/html");
    expect(markers.querySelectorAll(".progress-marker")).toHaveLength(timeline.length);
  });
});
