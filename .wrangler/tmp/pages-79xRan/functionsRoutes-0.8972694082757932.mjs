import { onRequestGet as __api_healthz_ts_onRequestGet } from "/home/kris/forge/Quantum-pi-forge/functions/api/healthz.ts"
import { onRequestGet as __api_livez_ts_onRequestGet } from "/home/kris/forge/Quantum-pi-forge/functions/api/livez.ts"
import { onRequestGet as __api_readyz_ts_onRequestGet } from "/home/kris/forge/Quantum-pi-forge/functions/api/readyz.ts"
import { onRequest as __api_resonance_ts_onRequest } from "/home/kris/forge/Quantum-pi-forge/functions/api/resonance.ts"
import { onRequest as __api_stats_js_onRequest } from "/home/kris/forge/Quantum-pi-forge/functions/api/stats.js"
import { onRequestGet as ___health_ts_onRequestGet } from "/home/kris/forge/Quantum-pi-forge/functions/_health.ts"

export const routes = [
    {
      routePath: "/api/healthz",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_healthz_ts_onRequestGet],
    },
  {
      routePath: "/api/livez",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_livez_ts_onRequestGet],
    },
  {
      routePath: "/api/readyz",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_readyz_ts_onRequestGet],
    },
  {
      routePath: "/api/resonance",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_resonance_ts_onRequest],
    },
  {
      routePath: "/api/stats",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_stats_js_onRequest],
    },
  {
      routePath: "/_health",
      mountPath: "/",
      method: "GET",
      middlewares: [],
      modules: [___health_ts_onRequestGet],
    },
  ]