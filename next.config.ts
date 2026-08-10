import type { NextConfig } from "next";
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
