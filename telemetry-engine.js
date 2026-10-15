// Proxy / standalone export for telemetry-engine.js
// Loads js/telemetry-engine.js if loaded from root
if (typeof window !== 'undefined' && !window.NanoTelemetryEngine) {
  const s = document.createElement('script');
  s.src = 'js/telemetry-engine.js';
  document.head.appendChild(s);
}
