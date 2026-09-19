import { ImageResponse } from "next/og"

export const alt = "Techlynk | Oracle Fusion Staff Augmentation & Consulting"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#050914",
          backgroundImage: "linear-gradient(135deg, #050914 0%, #0b1330 55%, #12224a 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: -2,
          }}
        >
          Techlynk
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 36,
            color: "#818cf8",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Oracle Fusion Staff Augmentation &amp; Consulting
        </div>
        <div
          style={{
            marginTop: 22,
            fontSize: 24,
            color: "#94a3b8",
          }}
        >
          Pre-vetted certified specialists · Deployed in 24-48 hours
        </div>
      </div>
    ),
    { ...size }
  )
}
