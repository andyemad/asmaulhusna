import { ImageResponse } from "next/og";
import { APP_SHARE_HOST, parseProgressSharePayload } from "@/lib/share";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const payload = parseProgressSharePayload(searchParams);
  const completion = Math.round((payload.memorized / 99) * 100);

  const statItems = [
    { label: "Learning", value: String(payload.learning) },
    { label: "Quiz accuracy", value: `${payload.accuracy}%` },
    { label: "Day streak", value: String(payload.streak) },
  ];

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at 50% 0%, rgba(120,152,180,0.2), transparent 40%), linear-gradient(180deg, #0a1820 0%, #03090d 100%)",
        color: "#f4eddc",
        padding: "48px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          borderRadius: "18px",
          border: "1px solid rgba(215,182,111,0.28)",
          background:
            "linear-gradient(145deg, rgba(16,39,46,0.97), rgba(4,13,18,0.98))",
          padding: "56px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <span
              style={{
                fontSize: 24,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#d7b66f",
              }}
            >
              Asma ul Husna
            </span>
            <span style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.05 }}>
              Memorization Progress
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: 92, fontWeight: 700, color: "#f0d99c" }}>
              {payload.memorized}/99
            </span>
            <span style={{ fontSize: 28, color: "rgba(216,208,189,0.72)" }}>
              {completion}% complete
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              height: "10px",
              width: "100%",
              background: "rgba(120,152,180,0.14)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                height: "100%",
                width: `${completion}%`,
                background:
                  "linear-gradient(90deg, #f0d99c 0%, #d7b66f 62%, #7898b4 100%)",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "18px" }}>
            {statItems.map((item) => (
              <div
                key={item.label}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  borderLeft: "1px solid rgba(215,182,111,0.28)",
                  background: "rgba(255,255,255,0.025)",
                  padding: "22px 26px",
                }}
              >
                <span style={{ fontSize: 44, fontWeight: 700 }}>{item.value}</span>
                <span
                  style={{
                    fontSize: 22,
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    color: "rgba(216,208,189,0.62)",
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 28,
              color: "rgba(216,208,189,0.72)",
            }}
          >
            <span>Studying the 99 Beautiful Names of Allah</span>
            <span>{APP_SHARE_HOST}</span>
          </div>
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
