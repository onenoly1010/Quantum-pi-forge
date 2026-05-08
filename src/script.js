/**
 * Legacy browser entrypoint kept for older static pages.
 * The current public landing bundle uses deploy/index.html inline scripts.
 */

window.quantumPiForge = window.quantumPiForge || {};

window.quantumPiForge.scrollToProofStrip = function scrollToProofStrip() {
  const target = document.getElementById('proof-strip');
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.quantumPiForge.setStatusText = function setStatusText(id, value) {
  const target = document.getElementById(id);
  if (target) target.textContent = value;
};
