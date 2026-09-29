/* exported renderFactionCard */
const escapeText = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );

function renderDetailBody(section) {
  switch (section.kind) {
    case "timeline":
      return `<div class="mini-timeline">${section.nodes
        .map(
          (n) =>
            `<div class="timeline-node${n.state ? " " + n.state : ""}"><span>${escapeText(n.label)}</span><small>${escapeText(n.sub)}</small></div>`
        )
        .join("")}</div>`;
    case "dependencies":
      return `<div class="dependency-grid">${section.items
        .map((t) => `<span>${escapeText(t)}</span>`)
        .join("")}</div>`;
    case "links":
      return `<div class="faction-links">${section.links
        .map(
          (l) => `<a href="${escapeText(l.href)}" class="faction-link">${escapeText(l.text)}</a>`
        )
        .join("")}</div>`;
    default:
      return `<ul>${section.items
        .map(
          (i) =>
            `<li${i.cls ? ` class="${escapeText(i.cls)}"` : ""}>${
              i.label ? `<strong>${escapeText(i.label)}</strong> ` : ""
            }${escapeText(i.text)}</li>`
        )
        .join("")}</ul>`;
  }
}

function renderFactionCard(f) {
  const relation = f.relation ? ` data-relation="${escapeText(f.relation)}"` : "";
  const power = f.power
    .map(
      (p) =>
        `<div class="power-item"><span>${escapeText(p.label)}</span><div class="power-bar"><div style="--power: ${Number(p.value)}"></div></div></div>`
    )
    .join("");
  const details = f.details
    .map(
      (s) =>
        `<div class="detail-section${s.cls ? " " + s.cls : ""}"><h4>${escapeText(s.title)}</h4>${renderDetailBody(s)}</div>`
    )
    .join("");
  return (
    `<article class="faction-card" data-type="${escapeText(f.type)}"${relation}>` +
    `<header class="faction-header"><h2>${escapeText(f.name)}</h2><span class="faction-tag ${escapeText(f.tagClass)}">${escapeText(f.tag)}</span></header>` +
    `<p class="faction-summary">${escapeText(f.summary)}</p>` +
    `<div class="power-snapshot">${power}</div>` +
    `<button class="expand-btn">View Details</button>` +
    `<div class="faction-details">${details}</div>` +
    `</article>`
  );
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { renderFactionCard };
}
