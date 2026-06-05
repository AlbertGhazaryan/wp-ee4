import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  appDirectory: "app",
  buildDirectory: "build",
  serverBuildFile: "index.js",
  serverModuleFormat: "cjs",
} satisfies Config;