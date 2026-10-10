import { Link } from "react-router-dom";

const journalMap = {
  oud: {
    title: "Understanding Oud",
    excerpt: "Oud brings depth, richness, and traceable warmth to a fragrance.",
  },
  saffron: {
    title: "The Scent of Saffron",
    excerpt: "Saffron adds radiance and a golden softness to fragrance.",
  },
  attar: {
    title: "How to Wear Attar",
    excerpt: "Apply attar to pulse points, warm skin, or clothing for best results.",
  },
};

function JournalList() {
  return (
    <main className="premium-page">
      <section className="page-banner">
        <p className="luxury-label">Latest</p>
        <h1>Journal</h1>
      </section>

      <div className="checkout-shell">
        <div className="checkout-form">
          <div className="field-group">
            <h3>From the house</h3>
            <div className="journal-list">
              {Object.entries(journalMap).map(([slug, meta]) => (
                <article key={slug} className="journal-item">
                  <h4>{meta.title}</h4>
                  <p className="detail-copy">{meta.excerpt}</p>
                  <Link className="primary-link" to={`/journal/${slug}`}>Read more</Link>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className="summary-card">
          <h3>Categories</h3>
          <div className="summary-line"><span>Ingredients</span><strong>Stories</strong></div>
          <div className="summary-line"><span>Events</span><strong>News</strong></div>
          <div className="summary-line"><span>Launches</span><strong>Updates</strong></div>
        </aside>
      </div>
    </main>
  );
}

export default JournalList;
