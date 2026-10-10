function Contact() {
  return (
    <main className="Row premium-page">
      <section className="col-12 page-banner">
        <p className="luxury-label">Get in touch</p>
        <h1>Contact Us</h1>
      </section>

      <div className="row contact-content justify-content-center align-items-center gap-4 py-5">

        <div className="col-lg-5 col-sm-10 contact-form px-5 py-4 text-center justify-content-center align-items-center rounded border" style={{background: 'linear-gradient(180deg, rgba(254, 250, 244, 0.6), rgba(244, 238, 231, 0.9))',
  padding: '3% 7%', }}>
          <form className="form-group gap-3" action="https://formspree.io/f/mnqvovqk" method="POST">
            <h3 className="form-title py-3 px-2 ">Send a message</h3>
            <hr className="form-divider mb-5" />
            <div className="input-group">
    <span className="input-group-text">Username</span>
    <input type="text" className="form-control" placeholder="Username"/>
  </div>
<br />
            <div className="input-group">
    <span className="input-group-text">Email</span>
    <input type="Email" className="form-control" placeholder="Email"/>
  </div>
<br />
            <div className="mb-3 text-start">
    <label htmlFor="message"  className="form-label">Message</label>
    <textarea className="form-control" id="message" placeholder="Message" rows="6"></textarea>
  </div>
<br />
            <button className="btn btn-primary" type="submit">Send</button>
          </form>
        </div>

        <div className="col-lg-3 col-sm-10 contact-details flex flex-column bg-light p-4 rounded border py-4 text-center justify-content-center align-items-center" style={{background: 'linear-gradient(180deg, rgba(254, 250, 244, 0.6), rgba(244, 238, 231, 0.9))'}}>
          <h3>Contact details</h3>
          <hr className="form-divider mb-5" />
          <p className="detail-copy" href="mailto:info@almasperfumes.com">Email: info@almasperfumes.com</p>
          <p className="detail-copy" href="tel:+919022786777">Phone: +91 9022786777</p>
          <p className="detail-copy" href="https://maps.app.goo.gl/NfMPjo4ZYtKRpQZ2A">Address: Shop No. 9 & 9/A, 99 Haji Mahal, Mohammed Ali Rd, Mumbai, Maharashtra 400003</p>
        </div>
      </div>

      <div className="row map-container justify-content-center align-items-center py-5" >
        <div className="col-lg-8 col-sm-10 map rounded border" style={{background: 'linear-gradient(180deg, rgba(254, 250, 244, 0.6), rgba(244, 238, 231, 0.9))'}}>
          <iframe
            title="Almas Perfume Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.5870454026503!2d72.83232367580415!3d18.94966425592535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cf9c3ea0d025%3A0xc648fb1705f9a33c!2sAlmas%20Perfume!5e0!3m2!1sen!2sin!4v1791440838233!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </main>
  );
}

export default Contact;
