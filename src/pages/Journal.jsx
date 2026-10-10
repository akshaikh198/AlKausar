import { Link, useParams } from "react-router-dom";

const journalMap = {
  oud: {
    title: "Understanding Oud",
    eyebrow: "The art of perfumery",
    body:
      "Oud brings depth, richness, and traceable warmth to a fragrance. In perfumery, it is prized for its complexity and its ability to create a luxurious, lingering trail that evolves beautifully over time.",
  },
  saffron: {
    title: "The Scent of Saffron",
    eyebrow: "Ingredients",
    body:
      "Saffron adds radiance and a golden softness to fragrance. When balanced with woods and amber, it creates an elegant, luminous signature that feels warm, rich, and deeply evocative.",
  },
  attar: {
    title: "How to Wear Attar",
    eyebrow: "The ritual",
    body:
      "Apply attar to pulse points, warm skin, or clothing. A small amount is enough to reveal the full composition, and the scent remains intimate and personal as it settles over the day.",
  },
};

function Journal() {
  const { slug } = useParams();
  const article = journalMap[slug] || journalMap.oud;

  return (
    <main className="premium-page">
      <section className="page-banner">
        <p className="luxury-label">{article.eyebrow}</p>
        <h1>{article.title}</h1>
      </section>

      <div className="checkout-shell">
        <div className="checkout-form">
          <div className="field-group">
            <p className="detail-copy">{article.body}</p>
            <p className="detail-copy">
              At Almas, every scent is designed to unfold slowly and leave an impression beyond the first note—an immersive experience that feels layered, intentional, and personal.
            </p>
          </div>
        </div>

        <aside className="summary-card">
          <h3>More reads</h3>
          <div className="summary-line"><span>Oud</span><Link to="/journal/oud">Read</Link></div>
          <div className="summary-line"><span>Saffron</span><Link to="/journal/saffron">Read</Link></div>
          <div className="summary-line"><span>Attar</span><Link to="/journal/attar">Read</Link></div>
        </aside>
      </div>
    </main>
  );
}

export default Journal;
