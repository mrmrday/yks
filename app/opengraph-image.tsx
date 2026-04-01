import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          background: "#efefec",
          color: "#111111",
          fontFamily: "Georgia, serif",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top left, rgba(123,0,255,0.14), transparent 40%), radial-gradient(circle at bottom right, rgba(123,0,255,0.1), transparent 34%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 56,
            left: 64,
            width: 220,
            height: 16,
            borderRadius: 999,
            background: "#7B00FF",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "110px 64px 64px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              maxWidth: 900,
            }}
          >
            <div
              style={{
                fontSize: 116,
                lineHeight: 0.9,
                letterSpacing: "-0.06em",
                fontWeight: 800,
                fontFamily: "Arial, sans-serif",
              }}
            >
              YKS
            </div>

            <div
              style={{
                fontSize: 54,
                lineHeight: 1.04,
                letterSpacing: "-0.04em",
                fontFamily: "Arial, sans-serif",
                fontWeight: 700,
                maxWidth: 980,
              }}
            >
              Design and creative work across brand, campaign, film, and
              digital.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 32,
              color: "rgba(17, 17, 17, 0.72)",
            }}
          >
            <div
              style={{
                fontSize: 28,
                lineHeight: 1.2,
              }}
            >
              yad kram studio
            </div>

            <div
              style={{
                fontSize: 28,
                lineHeight: 1.2,
                color: "#7B00FF",
              }}
            >
              www.yks.works
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
