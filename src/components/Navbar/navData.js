const navData = [
  {
    label: "Home",
    href: "/",
  },

  {
    label: "Shop",
    megaMenu: true,

    columns: [
      {
        title: "Attars",
        items: [
          { label: "Oud", href: "/shop/attars/oud" },
          { label: "Musk", href: "/shop/attars/musk" },
          { label: "Mukhallat", href: "/shop/attars/mukhallat" },
          { label: "Woody", href: "/shop/attars/woody" },
          { label: "Floral", href: "/shop/attars/floral" },
        ],
      },

      {
        title: "Perfume Oils",
        items: [
          { label: "Men", href: "/shop/perfume-oils/men" },
          { label: "Women", href: "/shop/perfume-oils/women" },
          { label: "Unisex", href: "/shop/perfume-oils/unisex" },
          { label: "Fresh", href: "/shop/perfume-oils/fresh" },
          { label: "Oriental", href: "/shop/perfume-oils/oriental" },
        ],
      },

      {
        title: "Bakhoor",
        items: [
          { label: "Premium Bakhoor", href: "/shop/bakhoor/premium" },
          { label: "Oud Bakhoor", href: "/shop/bakhoor/oud" },
          { label: "Arabic Bakhoor", href: "/shop/bakhoor/arabic" },
        ],
      },

      {
        title: "Featured",
        items: [
          { label: "New Arrivals", href: "/collection/new-arrivals" },
          { label: "Best Sellers", href: "/collection/best-sellers" },
          { label: "Gift Sets", href: "/collection/gifts" },
          { label: "Sale", href: "/collection/sale" },
        ],
      },
    ],
  },

  {
    label: "Collections",
    children: [
      {
        label: "New Arrivals",
        href: "/collection/new-arrivals",
      },
      {
        label: "Best Sellers",
        href: "/collection/best-sellers",
      },
      {
        label: "Luxury Collection",
        href: "/collection/luxury",
      },
      {
        label: "Arabic Collection",
        href: "/collection/arabic",
      },
    ],
  },

  {
    label: "About",
    href: "/about",
  },

  {
    label: "Blog",
    href: "/journal",
  },

  {
    label: "Contact",
    href: "/contact",
  },
];

export default navData;