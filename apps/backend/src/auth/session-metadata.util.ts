import type { Request } from "express"

import geoipLite = require("geoip-lite")

export interface SessionClientMetadata {
  surface?: string
  device_label?: string
  user_agent?: string
}

export interface ParsedSessionMetadata {
  surface: string | null
  browser: string | null
  os: string | null
  userAgent: string | null
  ipAddress: string | null
  location: string | null
  deviceLabel: string | null
}

export function resolveClientIp(req: Request): string | null {
  const forwarded = req.headers["x-forwarded-for"]
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]?.trim() ?? null
  }
  return req.ip ?? null
}

function parseUserAgent(userAgent: string | undefined) {
  if (!userAgent) {
    return { browser: null, os: null }
  }

  let browser: string | null = null
  if (/Edg\//i.test(userAgent)) browser = "Edge"
  else if (/Chrome\//i.test(userAgent)) browser = "Chrome"
  else if (/Safari\//i.test(userAgent) && !/Chrome/i.test(userAgent))
    browser = "Safari"
  else if (/Firefox\//i.test(userAgent)) browser = "Firefox"

  let os: string | null = null
  if (/iPhone|iPad|iPod/i.test(userAgent)) os = "iOS"
  else if (/Android/i.test(userAgent)) os = "Android"
  else if (/Mac OS X|Macintosh/i.test(userAgent)) os = "macOS"
  else if (/Windows/i.test(userAgent)) os = "Windows"
  else if (/Linux/i.test(userAgent)) os = "Linux"

  return { browser, os }
}

function resolveLocation(ipAddress: string | null) {
  if (!ipAddress) return null
  const normalized = ipAddress.replace(/^::ffff:/, "")
  if (normalized === "127.0.0.1" || normalized === "::1") {
    return "Local"
  }

  if (typeof geoipLite.lookup !== "function") {
    return null
  }

  const lookup = geoipLite.lookup(normalized)
  if (!lookup) return null

  const city = lookup.city?.trim()
  const country = lookup.country?.trim()
  if (city && country) return `${city}, ${country}`
  return country ?? city ?? null
}

export function parseSessionMetadata(
  req: Request,
  client?: SessionClientMetadata
): ParsedSessionMetadata {
  const userAgent =
    client?.user_agent ??
    (typeof req.headers["user-agent"] === "string"
      ? req.headers["user-agent"]
      : null)

  const { browser, os } = parseUserAgent(userAgent ?? undefined)
  const ipAddress = resolveClientIp(req)

  return {
    surface: client?.surface ?? null,
    browser,
    os,
    userAgent,
    ipAddress,
    location: resolveLocation(ipAddress),
    deviceLabel: client?.device_label ?? null,
  }
}

export function formatSessionDeviceLabel(metadata: {
  deviceLabel: string | null
  os: string | null
  browser: string | null
}) {
  if (metadata.deviceLabel && !metadata.deviceLabel.includes("Mozilla")) {
    return metadata.deviceLabel
  }

  const osLabel =
    metadata.os === "macOS"
      ? "Mac"
      : metadata.os === "Windows"
        ? "Windows"
        : metadata.os === "iOS"
          ? "iPhone"
          : metadata.os

  return osLabel ?? "Unknown device"
}
