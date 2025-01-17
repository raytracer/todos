import * as chrono from "npm:chrono-node@2.7.7";

export const custom = chrono.de.casual.clone();
custom.parsers.push({
  pattern: () => { return /\bfrüh\b/i },
  extract: (context, match) => {
    return {
      hour: 8,
    }
  }
});
custom.parsers.push({
  pattern: () => { return /\b(\d+)\.(\d+)\./i },
  extract: (context, match) => {
    const day = +match[1];
    const month = +match[2];
    return { day, month };
  }
});
