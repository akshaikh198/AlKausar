import React, { useEffect, useState } from "react";

const imgs = [
  "https://cdn.21st.dev/assets/mirror/77/772b01bcdfd57bcc1bd29180c5b72ac19f2c6439f6040ed8ba52f2c5515eaaeb.jpg",
  "https://cdn.21st.dev/assets/mirror/67/67329e8812f94cbb8721b62c68eaf00f6590adbb18e86504fc51fb41ff7398f8.jpg",
  "https://cdn.21st.dev/assets/mirror/b9/b938d805c4b6ae32ed52384c016d1b58ba667ba444e280a743bcd4548cb97b48.jpg",
  "https://cdn.21st.dev/assets/mirror/0c/0cd00230184aada375c09dd6d625fc17ede342fe9f6a6bec4b63aaadf3d3f074.jpg",
  "https://cdn.21st.dev/assets/mirror/06/0662b5af43d89a5c93b92109aea601d8a8f799459a7923ac3a43655840efbd46.jpg",
  "https://cdn.21st.dev/assets/mirror/94/9423ddf2c9b27bf41a0a5a6f0c5c7145347e2cad65d85a70ea702962c983f260.jpg",
  "https://cdn.21st.dev/assets/mirror/b9/b9133df58c7388629382c5914d8d5cec1e8893d1589a3def81666af338702ca7.jpg",
];

const AUTO_DELAY = 5000;

const styles = {
  shell: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "16px 0 8px",
    fontFamily: 'Inter, "Segoe UI", sans-serif',
    color: "#f7f4ef",
    background: "transparent",
  },
  frame: {
    width: "100%",
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "14px",
  },
  viewport: {
    width: "100%",
    overflow: "hidden",
    borderRadius: "26px",
    background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.18)",
  },
  track: {
    display: "flex",
    transition: "transform 400ms ease",
  },
  slide: {
    minWidth: "100%",
    height: "360px",
    position: "relative",
    background: "#171410",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  controls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: "4px",
    padding: "0 4px",
  },
  arrowButton: {
    width: "38px",
    height: "38px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#f9f6f1",
    fontSize: "18px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbs: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    width: "100%",
    marginTop: "4px",
  },
  thumbButton: {
    width: "52px",
    height: "52px",
    padding: 0,
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.03)",
    cursor: "pointer",
    transition: "transform 150ms ease, border-color 150ms ease, opacity 150ms ease",
  },
};

function ProductDetailGallery() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % imgs.length);
    }, AUTO_DELAY);

    return () => window.clearInterval(intervalId);
  }, []);

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? imgs.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % imgs.length);
  };

  return (
    <div style={styles.shell}>
      <div style={styles.frame}>
        <div style={styles.viewport}>
          <div
            style={{
              ...styles.track,
              transform: `translateX(-${activeIndex * 100}%)`,
            }}
          >
            {imgs.map((src, idx) => (
              <div key={`${src}-${idx}`} style={styles.slide}>
                <img
                  src={src}
                  alt={`Product detail view ${idx + 1}`}
                  style={styles.image}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={styles.controls}>
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Previous image"
            style={styles.arrowButton}
          >
            ←
          </button>

          <div style={{...styles.thumbs, display:"none"}}>
            {imgs.map((src, idx) => (
              <button
                key={`thumb-${idx}`}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`View image ${idx + 1}`}
                style={{
                  ...styles.thumbButton,
                  borderColor: idx === activeIndex ? "rgba(212,175,124,0.9)" : "rgba(255,255,255,0.12)",
                  transform: idx === activeIndex ? "scale(1.06)" : "scale(1)",
                  opacity: idx === activeIndex ? 1 : 0.7,
                  boxShadow:
                    idx === activeIndex ? "0 0 0 2px rgba(212,175,124,0.35)" : "none",
                }}
              >
                <img
                  src={src}
                  alt={`Thumbnail ${idx + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Next image"
            style={styles.arrowButton}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailGallery;
