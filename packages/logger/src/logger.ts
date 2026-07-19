import * as Sentry from "@sentry/node"

export interface SentryOptions {
    dsn: string
    environment?: string
    tracesSampleRate?: number
}

export class Logger {
    private readonly context: string

    constructor(context: string) {
        this.context = context
    }

    static init(options: SentryOptions) {
        Sentry.init({
            dsn: options.dsn,
            environment: options.environment ?? process.env.NODE_ENV,
            tracesSampleRate: options.tracesSampleRate ?? 0.2,
        })
    }

    log(payload: Record<string, unknown>) {
        console.log(JSON.stringify({ level: "info", context: this.context, ...payload }))
    }

    warn(payload: Record<string, unknown>) {
        console.warn(JSON.stringify({ level: "warn", context: this.context, ...payload }))
        Sentry.captureMessage(JSON.stringify(payload), "warning")
    }

    error(payload: Record<string, unknown>, error?: unknown) {
        console.error(JSON.stringify({ level: "error", context: this.context, ...payload }))

        if (error instanceof Error) {
            Sentry.captureException(error, { extra: payload })
        } else {
            Sentry.captureMessage(JSON.stringify(payload), "error")
        }
    }

    debug(payload: Record<string, unknown>) {
        if (process.env.NODE_ENV !== "production") {
            console.debug(JSON.stringify({ level: "debug", context: this.context, ...payload }))
        }
    }
}