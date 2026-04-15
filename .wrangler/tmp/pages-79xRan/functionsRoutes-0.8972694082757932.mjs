import { onRequest as __api_resonance_ts_onRequest } from "/home/kris/forge/Quantum-pi-forge/functions/api/resonance.ts"
import { onRequest as __api_stats_js_onRequest } from "/home/kris/forge/Quantum-pi-forge/functions/api/stats.js"

export const routes = [
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
  ]