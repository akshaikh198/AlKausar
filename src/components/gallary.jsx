import { useEffect, useState } from "react";

const DEFAULT_IMAGES = [
  {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image 1",
  },
  {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image 2",
  },
  {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image 3",
  },
  {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image 4",
  },
];

const styles = {
  section: {
    width: "100%",
    overflow: "hidden",
    padding: "64px 5%",
    background: "#f5f0e8",
    color: "#17130f",
    fontFamily: 'Inter, "Segoe UI", sans-serif',
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "32px",
  },
  title: {
    margin: 0,
    fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
    lineHeight: 1,
    letterSpacing: "-0.06em",
    fontWeight: 700,
  },
  description: {
    marginTop: "18px",
    maxWidth: "620px",
    fontSize: "1rem",
    lineHeight: 1.7,
    color: "rgba(23, 19, 15, 0.72)",
  },
  galleryWrap: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  viewport: {
    width: "100%",
    overflow: "hidden",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.25)",
    border: "1px solid rgba(23,19,15,0.08)",
    boxShadow: "0 18px 40px rgba(13, 10, 8, 0.08)",
  },
  track: {
    display: "flex",
    transition: "transform 400ms ease",
  },
  slide: {
    minWidth: "100%",
    height: "420px",
    flexShrink: 0,
    background: "#ddd3c6",
  },
  image: {
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
  },
  dots: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
    padding: 0,
    transition: "all 0.2s ease",
  },
  navButtons: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  navButton: {
    width: "46px",
    height: "46px",
    borderRadius: "999px",
    border: "1px solid rgba(23,19,15,0.12)",
    background: "rgba(255,255,255,0.45)",
    color: "#17130f",
    fontSize: "20px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

const Gallery21 = ({
  heading = "Image Gallery",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  images = DEFAULT_IMAGES,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [images.length]);

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>{heading}</h2>
          <p style={styles.description}>{description}</p>
        </div>

        <div style={styles.galleryWrap}>
          <div style={styles.viewport}>
            <div
              style={{
                ...styles.track,
                transform: `translateX(-${activeIndex * 100}%)`,
              }}
            >
              {images.map((image, index) => (
                <div key={`${image.alt || "gallery"}-${index}`} style={styles.slide}>
                  <img
                    src={image.src}
                    alt={image.alt || `Gallery image ${index + 1}`}
                    style={styles.image}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={styles.controls}>
            <div style={styles.dots}>
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  style={{
                    ...styles.dot,
                    background: index === activeIndex ? "#17130f" : "rgba(23,19,15,0.24)",
                    transform: index === activeIndex ? "scale(1.2)" : "scale(1)",
                  }}
                />
              ))}
            </div>

            <div style={styles.navButtons}>
              <button type="button" aria-label="Previous slide" onClick={goToPrevious} style={styles.navButton}>
                ←
              </button>
              <button type="button" aria-label="Next slide" onClick={goToNext} style={styles.navButton}>
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Gallery21 };
export default Gallery21;
