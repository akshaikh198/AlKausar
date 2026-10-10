import Carousel from "react-bootstrap/Carousel";
import "./Testimonial.css";

const testimonials = [
  {
    id: 1,
    name: "Aisha N.",
    role: "Verified Google review",
    date: "2 weeks ago",
    quote:
      "Absolutely stunning fragrance! The scent is elegant, long-lasting, and smells premium from the moment you apply it. Packaging was beautiful and delivery was quick.",
  },
  {
    id: 2,
    name: "Hassan R.",
    role: "Verified Google review",
    date: "1 month ago",
    quote:
      "I ordered a gift set and it exceeded expectations. The perfume has a rich, warm character and the quality feels truly luxurious. Highly recommended on Google reviews.",
  },

  {
    id: 3,
    name: "Mira K.",
    role: "Verified Google review",
    date: "3 months ago",
    quote:
      "Beautifully blended fragrance with soft floral notes and a lasting trail. The customer service was helpful and the product arrived in perfect condition.",
  },

  {
    id: 4,
    name: "Abu Hamza",
    role: "Verified Google review",
    date: "2 weeks ago",
    quote:
      "Absolutely stunning fragrance! The scent is elegant, long-lasting, and smells premium from the moment you apply it. Packaging was beautiful and delivery was quick.",
  },
  {
    id: 5,
    name: "Abdul Rahman",
    role: "Verified Google review",
    date: "1 month ago",
    quote:
      "I ordered a gift set and it exceeded expectations. The perfume has a rich, warm character and the quality feels truly luxurious. Highly recommended on Google reviews.",
  },
  {
    id: 6,
    name: "Bilal Ahmed",
    role: "Verified Google review",
    date: "3 months ago",
    quote:
      "Beautifully blended fragrance with soft floral notes and a lasting trail. The customer service was helpful and the product arrived in perfect condition.",
  },
];

function Testimonial() {
  return (
    <section className="testimonial-section container py-5">
      <div className="testimonial-header text-center mx-auto mb-5">
        <p className="section-kicker mb-2">Google Reviews</p>
        <h2 className="display-6 fw-light mb-0">What customers are saying</h2>
      </div>

      <Carousel
        className="testimonial-carousel"
        interval={4500}
        pause="hover"
        indicators
        controls
      >
        {testimonials.map((item) => (
          <Carousel.Item key={item.id} className="testimonial-slide-item">
            <div className="testimonial-slide-row row g-4 mx-0">
              <div className="col-12 col-md-8 mx-auto">
                <article className="testimonial-card h-100">
                    <div className="testimonial-top-row">
                      <div className="google-badge">
                        <span className="google-g">G</span>
                        <span className="google-o1">o</span>
                        <span className="google-o2">o</span>
                        <span className="google-g2">g</span>
                        <span className="google-l">l</span>
                        <span className="google-e">e</span>
                      </div>
                      <span className="review-meta">{item.date}</span>
                    </div>

                    <div className="testimonial-stars" aria-label="Five star review">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <i key={`${item.name}-star-${index}`} className="bi bi-star-fill" />
                      ))}
                    </div>

                    <p className="testimonial-quote">“{item.quote}”</p>

                    <div className="testimonial-author">
                      <div className="author-avatar">{item.name.charAt(0)}</div>
                      <div>
                        <h3>{item.name}</h3>
                        <span>{item.role}</span>
                      </div>
                    </div>
                </article>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </section>
  );
}

export default Testimonial;
