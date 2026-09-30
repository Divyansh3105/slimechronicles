/* exported renderTimelineMarkers, renderTimelineYears */
const escapeText = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );

function renderEvent(e) {
  const importance = e.importance ? ` data-importance="${escapeText(e.importance)}"` : "";
  const consequences = e.consequences.map((c) => `<li>${escapeText(c)}</li>`).join("");
  const characters = e.characters
    .map(
      (c) =>
        `<a href="${escapeText(c.href)}" class="character-link"><img src="${escapeText(c.img)}" alt="${escapeText(c.alt)}" loading="lazy" decoding="async" /><span>${escapeText(c.name)}</span></a>`
    )
    .join("");
  return (
    `<div class="timeline-event" onclick="toggleEvent(this)"${importance}>` +
    `<div class="event-header">${e.icon ? `<div class="event-icon">${escapeText(e.icon)}</div>` : ""}<div class="event-title">${escapeText(e.title)}</div><div class="event-date">${escapeText(e.date)}</div><div class="event-expand-hint">${escapeText(e.hint || "Click to expand")}</div></div>` +
    `<div class="event-content"><div class="event-description">${escapeText(e.description)}</div>` +
    `<div class="event-consequences"><h4>Consequences:</h4><ul>${consequences}</ul></div>` +
    `<div class="event-characters"><h4>Key Characters:</h4><div class="character-links">${characters}</div></div></div>` +
    `</div>`
  );
}

function renderArc(a) {
  const event = a.event ? ` data-event="${escapeText(a.event)}"` : "";
  const aria = a.slug !== undefined;
  const arcAttrs = aria ? ` role="region" aria-labelledby="${escapeText(a.slug)}-title"` : "";
  const headerAttrs = aria
    ? ` tabindex="0" role="button" aria-expanded="false" aria-controls="${escapeText(a.slug)}-content"`
    : "";
  const titleId = aria ? ` id="${escapeText(a.slug)}-title"` : "";
  const contentAttrs = aria ? ` id="${escapeText(a.slug)}-content" aria-hidden="true"` : "";
  return (
    `<div class="timeline-arc"${event}${arcAttrs}>` +
    `<div class="arc-header" onclick="toggleArcSimple(this)"${headerAttrs}>${a.icon ? `<div class="arc-icon">${escapeText(a.icon)}</div>` : ""}<div class="arc-title"${titleId}>${escapeText(a.title)}</div><div class="arc-toggle">▼</div></div>` +
    `<div class="arc-content"${contentAttrs}>${a.events.map(renderEvent).join("")}</div>` +
    `</div>`
  );
}

function renderTimelineYears(years) {
  return years
    .map(
      (y) =>
        `<div class="timeline-year visible" data-era="${escapeText(y.era)}" id="year-${escapeText(y.year)}" style="display: block; opacity: 1; transform: translateY(0)">` +
        `<div class="year-marker"><div class="year-number">${escapeText(y.year)}</div><div class="year-label">${escapeText(y.label)}</div></div>` +
        y.arcs.map(renderArc).join("") +
        `</div>`
    )
    .join("");
}

function renderTimelineMarkers(years) {
  return years
    .map(
      (y) =>
        `<div class="progress-marker" data-year="${escapeText(y.year)}" data-era="${escapeText(y.era)}"><div class="marker-dot"></div><div class="marker-label">${escapeText(y.year)}<br /><span>${escapeText(y.navLabel)}</span></div></div>`
    )
    .join("");
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { renderTimelineMarkers, renderTimelineYears };
}
