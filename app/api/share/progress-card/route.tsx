import { ImageResponse } from "next/og";
import { APP_SHARE_HOST, parseProgressSharePayload } from "@/lib/share";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const payload = parseProgressSharePayload(searchParams);
  const completion = Math.round((payload.memorized / 99) * 100);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at top, rgba(244,221,154,0.2), transparent 34%), linear-gradient(180deg, #11172b 0%, #080b12 100%)",
          color: "#fff8eb",
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
            borderRadius: "36px",
            border: "1px solid rgba(244,221,154,0.24)",
            background:
              "linear-gradient(180deg, rgba(20,26,44,0.96) 0%, rgba(10,14,25,0.96) 100%)",
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: "rgba(233,223,198,0.62)",
                }}
              >
                Asma ul Husna
              </div>
              <div
                style={{
                  fontSize: 62,
                  fontWeight: 700,
                  lineHeight: 1.05,
                }}
              >
                Memorization Progress
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "8px",
              }}
            >
              <div
                style={{
                  fontSize: 92,
                  fontWeight: 700,
                  color: "#f4dd9a",
                }}
              >
                {payload.memorized}/99
              </div>
              <div
                style={{
                  fontSize: 28,
                  color: "rgba(233,223,198,0.72)",
                }}
              >
                {completion}% complete
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div
              style={{
                height: "14px",
                width: "100%",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${completion}%`,
                  borderRadius: "999px",
                  background:
                    "linear-gradient(90deg, #f4dd9a 0%, #d7b067 55%, #b38436 100%)",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "18px",
              }}
            >
              {[
                {
                  label: "Learning",
                  value: String(payload.learning),
                },
                {
                  label: "Quiz accuracy",
                  value: `${payload.accuracy}%`,
                },
                {
                  label: "Day streak",
                  value: String(payload.streak),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    borderRadius: "24px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    padding: "24px 26px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 44,
                      fontWeight: 700,
                    }}
                  >
                    {item.value}
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      textTransform: "uppercase",
                      letterSpacing: "0.16em",
                      color: "rgba(233,223,198,0.62)",
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 28,
                color: "rgba(233,223,198,0.72)",
              }}
            >
              <div>Studying the 99 Beautiful Names of Allah</div>
              <div>{APP_SHARE_HOST}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
