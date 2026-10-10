import Testimonial from "../components/Testimonial";

function About() {
  return (
    <main className="premium-page">
      <section className="page-banner">
        <p className="luxury-label">About Us</p>
        <hr />
      </section>

      <div className="checkout-shell">
        <div className="checkout-form mb-4">
          <div className="field-group">
            <h3>Where Fragrance Becomes an Experience</h3>
            <p className="detail-copy">
              At Al-Kausar, we believe that fragrance is more than a scent — it is an expression of personality, a reflection of memories, and a beautiful part of everyday life
            </p>
            <p className="detail-copy">
              Our journey is built around a simple philosophy: Purity. Quality. Trust.
            </p>
            <p className="detail-copy">
              We bring together the timeless tradition of fine fragrances with a modern approach to quality and presentation. From rich and soulful Attars to elegant Perfumes, Deos, and Bakhoor, every product is carefully selected and crafted to offer a memorable fragrance experience.
            </p>

            <h3>Our Story</h3>
            <p className="detail-copy">
             Al-Kausar was created with a vision to make premium fragrances accessible to people who appreciate quality, elegance, and authenticity.
            </p>
            <p className="detail-copy">
             Inspired by the rich heritage of traditional perfumery, we continue to explore beautiful aromas, refined compositions, and distinctive fragrances that leave a lasting impression.
            </p>
            <p className="detail-copy">
             Every fragrance has its own character. Some are bold and captivating, some are soft and graceful, while others create a warm and comforting atmosphere. Our collection is designed to help you find the fragrance that feels uniquely yours.
            </p>

          </div>
        </div>

        <aside className="summary-card">

        <h3>Our Commitment to Quality</h3>
            <p className="detail-copy">
             Quality is at the heart of everything we do.
            </p>
            <p className="detail-copy">
             We carefully focus on the ingredients, fragrance experience, presentation, and overall value of every product. Our goal is not simply to offer a pleasant fragrance, but to deliver products that our customers can confidently choose and enjoy.
            </p>
            <p className="detail-copy fw-bold">
             From the first impression to the final note, we strive for excellence in every detail.
            </p>

          <h3>Signature values</h3>
          <div className="summary-line"><span>Rare ingredients</span><strong>Curated</strong></div>
          <div className="summary-line"><span>Artisanal blending</span><strong>Traditional</strong></div>
          <div className="summary-line"><span>Luxury ritual</span><strong>Modern</strong></div>
        </aside>
      </div>

      <Testimonial />

    </main>
  );
}

export default About;
