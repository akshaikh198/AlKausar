import { useState } from "react";
import {
  Container,
  Navbar,
  Nav,
  NavDropdown,
  Offcanvas,
  Badge,
} from "react-bootstrap";

import navData from "./navData";
import SearchBox from "./SearchBox";

import logo from "../../assets/logo.png";
import { useShop } from "../../context/ShopContext";

function MyNavbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount, wishlistCount } = useShop();

  return (
    <Navbar
      expand="lg"
      sticky="top"
      bg="light"
      variant="light"
      className="main-navbar"
    >
      <Container fluid="lg">

        {/* MOBILE TOGGLE */}
        <Navbar.Toggle
          aria-controls="main-navbar-offcanvas"
          className="border-0 shadow-none"
        />

        {/* LOGO */}
        <Navbar.Brand href="/" className="navbar-brand-custom">
          <img
            src={logo}
            alt="Almas Perfume"
            className="navbar-logo"
          />
        </Navbar.Brand>

        {/* MOBILE / DESKTOP MENU */}
        <Navbar.Offcanvas
          id="main-navbar-offcanvas"
          aria-labelledby="main-navbar-label"
          placement="start"
          responsive="lg"
          className="navbar-offcanvas"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="main-navbar-label">
              <img
                src={logo}
                alt="Almas Perfume"
                className="offcanvas-logo"
              />
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>

            <Nav className="navbar-menu mx-auto">
              {navData.map((item, index) => (
                <NavItem
                  key={`${item.label}-${index}`}
                  item={item}
                />
              ))}
            </Nav>

          </Offcanvas.Body>
        </Navbar.Offcanvas>

        {/* RIGHT SIDE ACTIONS */}
        <div className="navbar-actions">

          {/* SEARCH */}
          <SearchBox
            isOpen={searchOpen}
            setIsOpen={setSearchOpen}
          />

          {/* WISHLIST */}
          <Nav.Link
            href="/wishlist"
            className="navbar-icon-link"
            aria-label="Wishlist"
          >
            <i className="bi bi-heart"></i>

            {wishlistCount > 0 && (
              <Badge className="navbar-badge">
                {wishlistCount}
              </Badge>
            )}
          </Nav.Link>

          {/* CART */}
          <Nav.Link
            href="/cart"
            className="navbar-icon-link"
            aria-label="Shopping cart"
          >
            <i className="bi bi-bag"></i>

            {cartCount > 0 && (
              <Badge className="navbar-badge">
                {cartCount}
              </Badge>
            )}
          </Nav.Link>

          {/* ACCOUNT */}
          <Nav.Link
            href="/account"
            className="navbar-icon-link account-link"
            aria-label="Account"
          >
            <i className="bi bi-person"></i>
          </Nav.Link>

        </div>

      </Container>
    </Navbar>
  );
}


/* ---------------------------------
   REUSABLE NAV ITEM
---------------------------------- */

function NavItem({ item }) {

  if (!item.dropdown) {
    return (
      <Nav.Link
        href={item.href}
        className="navbar-link"
      >
        {item.label}
      </Nav.Link>
    );
  }

  return (
    <NavDropdown
      title={item.label}
      id={`dropdown-${item.label}`}
      className="navbar-dropdown"
    >
      {item.children?.map((child, index) => {

        /* Nested menu */
        if (child.children) {
          return (
            <NavDropdown
              key={`${child.label}-${index}`}
              title={child.label}
              id={`nested-${child.label}`}
              className="nested-dropdown"
            >
              {child.children.map((nestedItem, nestedIndex) => (
                <NavDropdown.Item
                  key={`${nestedItem.label}-${nestedIndex}`}
                  href={nestedItem.href}
                >
                  {nestedItem.label}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          );
        }

        return (
          <NavDropdown.Item
            key={`${child.label}-${index}`}
            href={child.href}
          >
            {child.label}
          </NavDropdown.Item>
        );
      })}
    </NavDropdown>
  );
}

export default MyNavbar;