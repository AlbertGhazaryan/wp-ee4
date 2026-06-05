import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,           // MUST be true for react-router-serve
  buildDirectory: "build",  // Default is "build"
} satisfies Config;