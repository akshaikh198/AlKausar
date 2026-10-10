import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import products from "../data/products";
import { ShoppingBag, Heart } from "lucide-react";
import Testimonial from "../components/Testimonial";
import ProductDetailGallery from "../components/productdetailsgallary";

const heroSlides = [
    {
    image: new URL("../assets/images/banner/11.jpg", import.meta.url).href,
    kicker: "AL-KAUSAR — THE SIGNATURE",
    title: "Where fragrance becomes an identity.",
    copy: "Immerse yourself in sophisticated fragrances created to express elegance, confidence, and individuality.",
    action: "Explore Collection",
  },
  {
    image: new URL("../assets/images/banner/13.jpg", import.meta.url).href,
    kicker: "CRAFTED FOR YOUR MOMENTS",
    title: "A scent that speaks for you.",
    copy: "From subtle everyday elegance to captivating evenings, discover the fragrance that feels unmistakably yours.",
    action: "Find Your Fragrance",
  },
  {
    image: new URL("../assets/images/banner/7.jpg", import.meta.url).href,
    kicker: "THE ART OF ATTAR",
    title: "Tradition, captured in every drop.",
    copy: "Discover concentrated perfume oils inspired by the timeless heritage of attar and crafted for a beautifully lasting presence.",
    action: "Discover Attars",
  },
];


function Hero(){
    const [activeSlide, setActiveSlide] = useState(0);
      const [isPaused, setIsPaused] = useState(false);
    
      useEffect(() => {
        if (isPaused) return undefined;
    
        const interval = window.setInterval(() => {
          setActiveSlide((currentSlide) => (currentSlide + 1) % heroSlides.length);
        }, 6000);
    
        return () => window.clearInterval(interval);
      }, [isPaused]);
    
      const slide = heroSlides[activeSlide];
    
      const showSlide = (slideIndex) => {
        setActiveSlide((slideIndex + heroSlides.length) % heroSlides.length);
      };
    return (
        <>
  {/* hero slider section */}

    <section
        className="hero-slider position-relative overflow-hidden text-white"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-label="Featured Al-mas fragrances"
      >
        <div
          className="hero-slide-image"
          style={{ backgroundImage: `url(${slide.image})` }}
          key={slide.image}
        />
        <div className="hero-slide-overlay" />

         <div className="container position-relative hero-slider-content">
         
          <div className="hero-copy hero-copy-enter" key={slide.title}>
            <p className="section-kicker text-uppercase mb-3">{slide.kicker}</p>
            <h1 className="display-1 fw-light mb-3">{slide.title}</h1>
            <p className="lead mb-4 text-white-50" style={{ maxWidth: 560 }}>{slide.copy}</p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/shop" className="btn premium-btn btn-lg">
                {slide.action}
              </Link>
              <Link to="/about" className="btn btn-outline-light btn-lg">
                Our story
              </Link>
            </div>
          </div>
        </div> 


      <div className="hero-slider-controls container">
        
          <button type="button" className="hero-arrow" onClick={() => showSlide(activeSlide - 1)} aria-label="Previous slide">
            <i className="bi bi-arrow-left" />
          </button>


          <div className="hero-dots" role="tablist" aria-label="Choose a featured fragrance">
            {heroSlides.map((heroSlide, slideIndex) => (
              <button
                type="button"
                role="tab"
                key={heroSlide.title}
                className={`hero-dot ${slideIndex === activeSlide ? "active" : ""}`}
                onClick={() => showSlide(slideIndex)}
                aria-label={`Show slide ${slideIndex + 1}`}
                aria-selected={slideIndex === activeSlide}
              />
            ))}
          </div>


          <button type="button" className="hero-arrow" onClick={() => showSlide(activeSlide + 1)} aria-label="Next slide">
            <i className="bi bi-arrow-right" />
          </button>
        </div>


      </section>
</>
    );

}

export default Hero;