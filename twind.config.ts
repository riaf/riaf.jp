import { Options } from "$fresh/plugins/twind.ts";

export default {
  selfURL: import.meta.url,
  theme: {
    extend: {
      colors: {
        "primary": "#0099bd",
      },
    },
  },
} as Options;
