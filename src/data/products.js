const productImageAssets = import.meta.glob(
  [
    "../assets/product/**/*",
    "../assets/images/Dakkar.jpg",
    "../assets/images/Dakkar_6ml.png",
    "../assets/images/Riyal.jpg",
    "../assets/images/Riyal_8ml.png",
  ],
  { eager: true, query: "?url", import: "default" },
);

const resolveProductImage = (path) =>
  productImageAssets[`../${path.slice("src/".length)}`] ?? path;

const products = [
  {
    id: 1,
    name: "Addictive Ambergris",
    category: "Attar",
    type: "fregrance oil",
    size: "50ml",
    price: 399,
    notes: ["Oud", "Saffron", "Amber"],
    image: "src/assets/product/Al-Kausar 100ml/bottle/Addictive Ambergris.jpeg",
    hoverImage: "src/assets/product/Al-Kausar 100ml/Addictive_Ambergris.jpeg",
    description:
      "A rich, resinous signature with smoky oud, saffron warmth, and a golden amber finish that lingers beautifully on skin.",
  },
  {
    id: 2,
    name: "Aqua 212",
    category: "Attar",
    type: "Pure Attar",
    size: "50ml",
    price: 449,
    notes: ["Musk", "jasmine", "Sandalwood"],
    image: 'src/assets/product/Al-Kausar 100ml/bottle/Aqua_212.jpeg',
    hoverImage: 'src/assets/product/Al-Kausar 100ml/Aqua_212.jpeg',
    description:
      "An elegant musky floral attar layered with rose and sandalwood for a warm and soft, intimate trail."
  },
  {
    id: 3,
    name: "Aqua zoo",
    category: "Attar",
    type: "Concentrated Attar",
    size: "50ml",
    price: 199,
    notes: ["Saffron", "Leather", "Amber"],
    image: 'src/assets/product/Al-Kausar 100ml/bottle/Aqua_Zoo.jpeg',
    hoverImage: 'src/assets/product/Al-Kausar 100ml/Aqua_zoo.jpeg',
    description:
      "A bold and mysterious composition combining saffron glow with leather depth and amber warmth.",
  },
  {
    id: 4,
    name: "Black Heart",
    category: "Attar",
    type: "Concentrated Attar",
    size: "100ml",
    price: 399,
    notes: ["Rose", "Oud", "Musk"],
    image: 'src/assets/product/Al-Kausar 100ml/bottle/Black_Heart (2).jpeg',
    hoverImage: 'src/assets/product/Al-Kausar 100ml/bottle/Black_Heart.jpeg',
    description:
      "Romantic, dark, sensual luxury - soft smoke, scattered petals on black reflective surface, warm cinematic lighting, golden bokeh, label fully visible and unchanged.",
  },
  {
    id: 5,
    name: "Dylan Blue",
    category: "Gift Sets",
    type: "Luxury Gift Set",
    size: "100ml",
    price: 299,
    notes: ["Rose", "Amber", "Musk"],
    image: 'src/assets/product/Al-Kausar 100ml/bottle/Dylan_Blue.jpeg',
    hoverImage: 'src/assets/product/Al-Kausar 100ml/Dylan_Blue.jpeg',
    description:
      "A celebratory set crafted for gifting, with a floral-amber profile and refined elegance for all occasions.",
  },
  {
    id: 6,
    name: "E Rouge",
    category: "Perfume",
    type: "Eau de Parfum",
    size: "100ml",
    price: 2799,
    notes: ["Cedar", "Bergamot", "Patchouli"],
    image: 'src/assets/product/Al-Kausar 100ml/bottle/E_Rouge.jpeg',
    hoverImage: 'src/assets/product/Al-Kausar 100ml/E_Rouge.jpeg',
    description:
      "A fresh-to-woody statement with bright bergamot opening into cedar and patchouli sophistication.",
  },
  {
    id: 7,
    name: "Emarat Gold",
    category: "Attar",
    type: "Pure Attar",
    size: "100ml",
    price: 299,
    notes: ["Sandalwood", "Vanilla", "Musk"],
    image: 'src/assets/product/Al-Kausar 100ml/bottle/Emarat_Gold.jpeg',
    hoverImage: 'src/assets/product/Al-Kausar 100ml/Emarat_Gold.jpeg',
    description:
      "Smooth sandalwood softened by vanilla and musk for a creamy, comforting trail that feels effortlessly premium.",
  },
  {
    id: 8,
    name: "Good Night",
    category: "Attar",
    type: "Pure Attar",
    size: "100ml",
    price: 249,
    notes: ["Jasmine", "Oud", "White Musk"],
    image: "src/assets/product/Al-Kausar 100ml/bottle/good_night.jpeg",
    hoverImage: "src/assets/product/Al-Kausar 100ml/good_night.jpeg",
    description:
      "Floral depth meets Arabian oud in a balanced mist that feels rich yet airy and modern.",
  },
  {
    id: 9,
    name: "Fantasia",
    category: "Attar",
    type: "Attar Oil",
    size: "100ml",
    price: 299,
    notes: ["Cedar", "Vetiver", "Patchouli"],
    image: "src/assets/product/Al-Kausar 100ml/bottle/Fantasia.jpeg",
    hoverImage: "src/assets/product/Al-Kausar 100ml/Fantasia.jpeg",
    description:
      "Clean, woods-driven freshness with earthy depth and a long-lasting premium finish for day-to-night wear.",
  },
  {
    id: 10,
    name: "King Black",
    category: "Attar",
    type: "Attar Oil",
    size: "100ml",
    price: 459,
    notes: ["Oud", "Musk", "Amber"],
    image: "src/assets/product/Al-Kausar 100ml/bottle/King_Black.jpeg",
    hoverImage: "src/assets/product/Al-Kausar 100ml/King_Black.jpeg",
    description:
      "A collector-worthy duo designed for a deep, opulent fragrance ritual with a layered oud signature.",
  },
  {
    id: 11,
    name: "Mud",
    category: "Attar",
    type: "Attar Oil",
    size: "100ml",
    price: 1399,
    notes: ["Amber", "Citrus", "Sandalwood"],
    image: "src/assets/product/Al-Kausar 100ml/bottle/Mud.jpeg",
    hoverImage: "src/assets/product/Al-Kausar 100ml/Mud.jpeg",
    description:
      "A bright, golden profile with citrus lift and warm sandalwood for an uplifting, confident feeling.",
  },
  {
    id: 12,
    name: "Mr Blueberry",
    category: "Attar",
    type: "Attar Oil",
    size: "100ml",
    price: 399,
    notes: ["Black Pepper", "Cherry", "Amber"],
    image: "src/assets/product/Al-Kausar 100ml/bottle/Mr_Blueberry.jpeg",
    hoverImage: "src/assets/product/Al-Kausar 100ml/Mr_Blueberry.jpeg",
    description:
      "A sleek perfume with noir rose and soft spice creating an elegant and memorable evening impression.",
  },
  {
    id: 13,
    name: "Mukhallat Badar",
    category: "Attar",
    type: "Pure Attar",
    size: "100ml",
    price: 799,
    notes: ["Floral Musk", "Rose", "Amber"],
    image: "src/assets/product/Al-Kausar 100ml/bottle/Mukhallat_Badar.jpeg",
    hoverImage: "src/assets/product/Al-Kausar 100ml/Mukhallat_Badar.jpeg",
    description:
      "Soft rose petals and warm amber weave together in a mellow attar that feels luxurious and intimate.",
  },
  
];

export default products.map((product) => ({
  ...product,
  image: resolveProductImage(product.image),
  hoverImage: resolveProductImage(product.hoverImage),
}));
