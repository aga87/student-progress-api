const serializeMeta = (meta: unknown): Record<string, unknown> => {
  if (!meta) return {};

  if (meta instanceof Error) {
    return {
      errorMessage: meta.message,
      errorStack: meta.stack,
      errorName: meta.name,
    };
  }

  if (typeof meta === 'object') {
    return meta as Record<string, unknown>;
  }

  return { value: meta };
};

// Minimal logger - in Cloud Run everything written to the console is captured and sent to Cloud Logging
export const logger = {
  info: (message: string, meta?: unknown): void => {
    console.log(
      JSON.stringify({ severity: 'INFO', message, ...serializeMeta(meta) })
    );
  },

  warn: (message: string, meta?: unknown): void => {
    console.warn(
      JSON.stringify({ severity: 'WARNING', message, ...serializeMeta(meta) })
    );
  },

  error: (message: string, meta?: unknown): void => {
    console.error(
      JSON.stringify({ severity: 'ERROR', message, ...serializeMeta(meta) })
    );
  },
};
