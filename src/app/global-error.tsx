"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f5f5f5" }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ textAlign: "center", maxWidth: 400 }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#1a1a1a", marginBottom: 8 }}>
              服务暂时不可用
            </h1>
            <p style={{ fontSize: "0.875rem", color: "#666", marginBottom: 24 }}>
              页面加载时发生错误，请稍后重试或联系客服。
            </p>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: "10px 20px",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#fff",
                background: "#0d5c2e",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              重新加载
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
