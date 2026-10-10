import { useState } from "react";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import logo from "../assets/Al_Kausar_Logo.png";
import { useShop } from "../context/ShopContext";
import "./MyNavbar.css";

function MyNavbar() {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm } = useShop();
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);

  const [, setAllar_100ml] = useState(false);
  const [, setWoAllar_100ml] = useState(false);
  const [, setGiftsOpen] = useState(false);

  return (
    <Navbar
      sticky="top"
      expand="lg"
      className="main-navbar"
    > 
      <Container fluid className="navbar-container">

        {/* ==================================================
            MOBILE MENU BUTTON
        ================================================== */}

        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          className="navbar-toggler-custom"
        >
          <i className="bi bi-list"></i>
        </Navbar.Toggle>


        {/* ==================================================
            LOGO
        ================================================== */}

        <Navbar.Brand
          href="/"
          className="navbar-brand"
        >
          <img
            src={logo}
            alt="Almas Perfume"
            className="navbar-logo"
          />
        </Navbar.Brand>


        {/* ==================================================
            NAVIGATION
        ================================================== */}

        <Navbar.Offcanvas
          id="responsive-navbar-nav"
          aria-labelledby="responsive-navbar-title"
          placement="start"
          responsive="lg"
          className="nav-offcanvas"
        >

          {/* OFFCANVAS HEADER */}

          <Offcanvas.Header closeButton  className="offcanvas-header">
            <Offcanvas.Title id="responsive-navbar-title" className="py-5">

              {/* <img
                src={logo}
                alt="Almas Perfume"
                className="offcanvas-logo"
              /> */}

            </Offcanvas.Title>
          </Offcanvas.Header>


          {/* OFFCANVAS BODY */}

          <Offcanvas.Body>

            <Nav className="main-nav">

              {/* ==================================================
                  HOME
              ================================================== */}

              <Nav.Link
                href="/"
                className="nav-main-link"
              >
                Home
              </Nav.Link>


              {/* ==================================================
                  SHOP
              ================================================== */}

              <div
                className={`custom-dropdown ${
                  shopOpen ? "dropdown-open" : ""
                }`}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") {
                    setShopOpen(true);
                  }
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType === "mouse") {
                    setShopOpen(false);
                    setAllar_100ml(false);
                    setWoAllar_100ml(false);
                    setGiftsOpen(false);
                  }
                }}
              >

                <button
                  type="button"
                  className="nav-main-link dropdown-trigger"
                  aria-expanded={shopOpen}
                  onClick={() => setShopOpen((open) => !open)}
                >

                  <span>Shop</span>

                  <i className="bi bi-chevron-down"></i>

                </button>


                {/* SHOP MENU */}


                              <div className="custom-dropdown-menu collection-menu">

                                  <Nav.Link href="/collection/new-arrivals">
                                      New Arrivals
                                  </Nav.Link>

                                  <Nav.Link href="/collection/best-sellers">
                                      Best Sellers
                                  </Nav.Link>

                                  <Nav.Link href="/collection/sale">
                                      Sale
                                  </Nav.Link>

                              </div>
       

              </div>


              {/* ==================================================
                  COLLECTION
              ================================================== */}

              <div
                className={`custom-dropdown ${
                  collectionOpen ? "dropdown-open" : ""
                }`}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") {
                    setCollectionOpen(true);
                  }
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType === "mouse") {
                    setCollectionOpen(false);
                  }
                }}
              >

                <button
                  type="button"
                  className="nav-main-link dropdown-trigger"
                  aria-expanded={collectionOpen}
                  onClick={() =>
                    setCollectionOpen((open) => !open)
                  }
                >

                  <span>Collection</span>

                  <i className="bi bi-chevron-down"></i>

                </button>


                              <div className="custom-dropdown-menu collection-menu">

                                  <Nav.Link href="/collection/new-arrivals">
                                      100ml
                                  </Nav.Link>

                                  <Nav.Link href="/collection/best-sellers">
                                      50ml
                                  </Nav.Link>

                                  <Nav.Link href="/collection/sale">
                                      25ml
                                  </Nav.Link>

                                  <Nav.Link href="/collection/sale">
                                      6ml
                                  </Nav.Link>

                              </div>

                          </div>

                          <Nav.Link
                              href="/about"
                              className="nav-main-link"
                          >
                              About
                          </Nav.Link>

                          {/* BLOG / JOURNAL */}

                          <Nav.Link
                              href="/journal"
                              className="nav-main-link"
                          >
                              Journal
                          </Nav.Link>

                          {/* CONTACT */}

                          <Nav.Link
                              href="/contact"
                              className="nav-main-link"
                          >
                              Contact
                          </Nav.Link>

            </Nav>

          </Offcanvas.Body>

        </Navbar.Offcanvas>


        {/* ==================================================
            RIGHT SIDE
        ================================================== */}

        <div className="navbar-tools">

          {/* SEARCH */}

          <div
            className={`nav-search ${
              searchOpen ? "is-open" : ""
            }`}
          >

            {searchOpen && (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  navigate("/shop");
                  setSearchOpen(false);
                }}
              >
                <input
                  type="search"
                  placeholder="Search products..."
                  autoFocus
                  className="search-input"
                  aria-label="Search products"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </form>
            )}

            <button
              type="button"
              className="search-toggle"
              aria-label={
                searchOpen
                  ? "Close search"
                  : "Open search"
              }
              onClick={() =>
                setSearchOpen((open) => !open)
              }
            >

              <i
                className={
                  searchOpen
                    ? "bi bi-x-lg"
                    : "bi bi-search"
                }
              ></i>

            </button>

          </div>


          {/* ACTION ICONS */}

          <Nav className="action-link">

            {/* CART */}

            <Nav.Link
              href="/cart"
              className="action-icon"
              aria-label="Shopping cart"
            >
              <i className="bi bi-bag-check"></i>
            </Nav.Link>


            {/* WISHLIST */}

            <Nav.Link
              href="/wishlist"
              className="action-icon"
              aria-label="Wishlist"
            >
              <i className="bi bi-heart"></i>
            </Nav.Link>


            {/* ACCOUNT */}

            <Nav.Link
              href="/login"
              className="action-icon"
              aria-label="Account"
            >
              <i className="bi bi-person"></i>
            </Nav.Link>

          </Nav>

        </div>

      </Container>
    </Navbar>
  );
}

export default MyNavbar;
