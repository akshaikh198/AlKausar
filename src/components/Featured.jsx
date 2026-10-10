import products from "../data/products";
import SliderModule from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slider =
  typeof SliderModule === "function" ? SliderModule : SliderModule.default;


function Featured() {

    const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true, 
    autoplaySpeed: 2500,  
  };

  return (   
    <>
    <section className="mx-auto py-5 px-2 " style={{ maxWidth: '80%', backgroundColor: "#f5efe5" }}>
       <div className=" row g-4">
  <Slider {...settings}>
        {products.map((product) => (
           
          <div key={product.id} className=" col-12 col-md-6 col-lg-3 col-xl-3 royal-product-card">
            <div className="royal-product-image rounded mx-auto d-block" sstyle={{ height:"200px", position: "relative", overflow: "hidden" }}>
              <img src={product.image} alt={product.name} className="rounded mx-auto d-block"/>
            </div>
            <div className="royal-product-info">
              <p className="royal-product-name" style={{ fontSize: "1rem", fontWeight: "500", color: "#333" }}>{product.name}</p>
            </div>
          </div>
        
      
        ))}
  </Slider>
</div>
       
    </section>
    
    </>

  );
}
export default Featured;