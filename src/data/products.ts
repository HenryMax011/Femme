import type { Product, Review } from "@/types";

export const products: Product[] = [
  {
    id: "prod-001",
    name: "Sérum Aqua Radiance",
    slug: "serum-aqua-radiance",
    shortDesc: "Hidratação profunda com ácido hialurônico e niacinamida.",
    description:
      "O Sérum Aqua Radiance é formulado com ácido hialurônico de baixo peso molecular e niacinamida para iluminar, hidratar e uniformizar a pele. Textura ultraleve de rápida absorção, ideal para uso diário sob o protetor solar.",
    ingredients:
      "Aqua, Sodium Hyaluronate, Niacinamide, Glycerin, Panthenol, Tocopherol, Aloe Barbadensis Leaf Juice, Phenoxyethanol.",
    howToUse:
      "Após limpeza, aplique 3 a 4 gotas no rosto e pescoço. Massageie até absorção. Use manhã e noite. Finalize com protetor solar durante o dia.",
    price: 189.9,
    compareAt: 230,
    brand: "Selavie Femme",
    gender: "UNISEX",
    images: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900&q=80",
      "https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=900&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80",
    ],
    stock: 80,
    soldCount: 420,
    rating: 4.9,
    reviewCount: 76,
    isNew: false,
    isBestSeller: true,
    categorySlug: "skincare",
    createdAt: "2025-11-12T10:00:00.000Z",
  },
  {
    id: "prod-002",
    name: "Eau de Parfum Lumière",
    slug: "eau-de-parfum-lumiere",
    shortDesc: "Floral aquático com notas de jasmim e âmbar branco.",
    description:
      "Lumière é uma fragrância floral aquática que celebra a delicadeza e a presença. Abertura fresca de bergamota e lírio d'água, coração de jasmim e base envolvente de âmbar branco e musk.",
    ingredients:
      "Alcohol Denat, Parfum, Aqua, Limonene, Linalool, Coumarin, Benzyl Salicylate.",
    howToUse:
      "Aplique nos pulsos, pescoço e clavícula. Evite esfregar. Ideal para o dia a dia e ocasiões especiais.",
    price: 349.9,
    brand: "Selavie Femme",
    gender: "FEMALE",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=900&q=80",
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=900&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900&q=80",
    ],
    stock: 45,
    soldCount: 310,
    rating: 4.8,
    reviewCount: 42,
    isNew: true,
    isBestSeller: false,
    categorySlug: "perfumes",
    createdAt: "2026-02-01T10:00:00.000Z",
  },
  {
    id: "prod-003",
    name: "Creme Corporal Velouté",
    slug: "creme-corporal-velours",
    shortDesc: "Hidratação aveludada com manteiga de karité e óleo de amêndoas.",
    description:
      "Velouté envolve a pele com uma textura rica e não oleosa. Manteiga de karité, óleo de amêndoas doces e vitamina E promovem hidratação por até 24 horas com aroma sutil de algodão e baunilha.",
    ingredients:
      "Aqua, Butyrospermum Parkii Butter, Prunus Amygdalus Dulcis Oil, Glycerin, Tocopherol, Cetearyl Alcohol, Fragrance.",
    howToUse:
      "Aplique em todo o corpo após o banho, com a pele ainda úmida, massageando até completa absorção.",
    price: 129.9,
    compareAt: 159,
    brand: "Selavie Femme",
    gender: "UNISEX",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80",
      "https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=900&q=80",
    ],
    stock: 100,
    soldCount: 520,
    rating: 4.7,
    reviewCount: 58,
    isNew: false,
    isBestSeller: false,
    categorySlug: "cremes-corporais",
    createdAt: "2025-08-20T10:00:00.000Z",
  },
  {
    id: "prod-004",
    name: "Máscara Facial Cloud Glow",
    slug: "mascara-facial-cloud-glow",
    shortDesc: "Máscara em gel com vitamina C e extrato de algas.",
    description:
      "Cloud Glow revitaliza a pele cansada em apenas 10 minutos. A combinação de vitamina C estabilizada e extrato de algas marinhas promove luminosidade imediata e sensação de frescor.",
    ingredients:
      "Aqua, Ascorbyl Glucoside, Algae Extract, Glycerin, Cucumis Sativus Fruit Extract, Xanthan Gum, Phenoxyethanol.",
    howToUse:
      "Aplique camada generosa no rosto limpo. Deixe agir por 10 minutos e remova com água morna. Use 2 a 3 vezes por semana.",
    price: 99.9,
    compareAt: 119.9,
    brand: "Selavie Femme",
    gender: "FEMALE",
    images: [
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=900&q=80",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900&q=80",
    ],
    stock: 70,
    soldCount: 180,
    rating: 4.6,
    reviewCount: 64,
    isNew: true,
    isBestSeller: false,
    categorySlug: "cuidados-faciais",
    createdAt: "2026-03-10T10:00:00.000Z",
  },
  {
    id: "prod-005",
    name: "Gel de Limpeza Pure Balance",
    slug: "gel-limpeza-pure-balance",
    shortDesc: "Limpeza suave que respeita o pH da pele.",
    description:
      "Pure Balance remove impurezas sem ressecar. Fórmula com glicerina e extrato de camomila, indicada para todos os tipos de pele, inclusive oleosa e sensível.",
    ingredients:
      "Aqua, Cocamidopropyl Betaine, Glycerin, Chamomilla Recutita Extract, Panthenol, Citric Acid, Phenoxyethanol.",
    howToUse:
      "Com o rosto úmido, massageie suavemente e enxágue. Use manhã e noite como primeiro passo da rotina.",
    price: 79.9,
    brand: "Selavie Femme",
    gender: "UNISEX",
    images: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900&q=80",
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=900&q=80",
    ],
    stock: 120,
    soldCount: 640,
    rating: 4.8,
    reviewCount: 91,
    isNew: false,
    isBestSeller: false,
    categorySlug: "skincare",
    createdAt: "2025-06-01T10:00:00.000Z",
  },
  {
    id: "prod-006",
    name: "Perfume Masculino Noir Horizon",
    slug: "perfume-masculino-noir-horizon",
    shortDesc: "Amadeirado aromático com vetiver e pimenta rosa.",
    description:
      "Noir Horizon é intensidade e sofisticação. Notas de saída de bergamota e pimenta rosa, coração de lavanda e base de vetiver, cedro e âmbar cinzento.",
    ingredients:
      "Alcohol Denat, Parfum, Aqua, Limonene, Coumarin, Eugenol, Linalool.",
    howToUse:
      "Borrife a 15 cm da pele nos pontos de pulso e pescoço. Relance conforme necessário.",
    price: 329.9,
    brand: "Selavie Femme",
    gender: "MALE",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=900&q=80",
    ],
    stock: 55,
    soldCount: 210,
    rating: 4.7,
    reviewCount: 78,
    isNew: false,
    isBestSeller: true,
    categorySlug: "perfumes",
    createdAt: "2025-10-05T10:00:00.000Z",
  },
  {
    id: "prod-007",
    name: "Óleo Facial Midnight Repair",
    slug: "oleo-facial-midnight-repair",
    shortDesc: "Reparação noturna com óleos botânicos e retinol vegetal.",
    description:
      "Midnight Repair nutre a pele durante o sono. Blend de óleos de rosa mosqueta, jojoba e bakuchiol para estimular renovação sem irritação, deixando a pele macia e regenerada ao acordar.",
    ingredients:
      "Rosa Canina Fruit Oil, Simmondsia Chinensis Seed Oil, Bakuchiol, Tocopherol, Lavandula Angustifolia Oil.",
    howToUse:
      "À noite, após o sérum, aqueça 3 gotas nas mãos e pressione sobre o rosto. Evite a área dos olhos.",
    price: 219.9,
    compareAt: 259.9,
    brand: "Selavie Femme",
    gender: "FEMALE",
    images: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900&q=80",
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=900&q=80",
    ],
    stock: 40,
    soldCount: 95,
    rating: 4.9,
    reviewCount: 42,
    isNew: true,
    isBestSeller: false,
    categorySlug: "cuidados-faciais",
    createdAt: "2026-04-15T10:00:00.000Z",
  },
  {
    id: "prod-008",
    name: "Balm Pós-Barba Calm Man",
    slug: "balm-pos-barba-calm-man",
    shortDesc: "Calma e hidrata a pele após o barbear.",
    description:
      "Calm Man alivia vermelhidão e hidrata sem sensação oleosa. Com aloe vera, panthenol e extrato de pepino, é o finalizador ideal da rotina masculina.",
    ingredients:
      "Aqua, Aloe Barbadensis Leaf Juice, Panthenol, Cucumis Sativus Extract, Glycerin, Mentha Piperita Oil.",
    howToUse:
      "Após o barbear, aplique quantidade generosa no rosto e no pescoço até absorção completa.",
    price: 89.9,
    brand: "Selavie Femme",
    gender: "MALE",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&q=80",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900&q=80",
    ],
    stock: 90,
    soldCount: 150,
    rating: 4.5,
    reviewCount: 51,
    isNew: false,
    isBestSeller: false,
    categorySlug: "masculino",
    createdAt: "2025-09-18T10:00:00.000Z",
  },
  {
    id: "prod-009",
    name: "Hidratante Facial Daily Soft",
    slug: "hidratante-facial-daily-soft",
    shortDesc: "Hidratação diária com cerâmidas e toque aveludado.",
    description:
      "Daily Soft reforça a barreira cutânea com cerâmidas e ácido hialurônico. Acabamento matte-soft perfeito para maquiagem e uso em pele mista.",
    ingredients:
      "Aqua, Ceramide NP, Sodium Hyaluronate, Dimethicone, Glycerin, Squalane, Phenoxyethanol.",
    howToUse:
      "Aplique após o sérum, manhã e noite. Espalhe em movimentos ascendentes até absorção.",
    price: 159.9,
    brand: "Selavie Femme",
    gender: "UNISEX",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900&q=80",
    ],
    stock: 85,
    soldCount: 280,
    rating: 4.8,
    reviewCount: 112,
    isNew: false,
    isBestSeller: true,
    categorySlug: "skincare",
    createdAt: "2025-07-22T10:00:00.000Z",
  },
  {
    id: "prod-010",
    name: "Body Mist Soft Horizon",
    slug: "body-mist-soft-horizon",
    shortDesc: "Névoa corporal fresca com notas de peônia e algodão.",
    description:
      "Soft Horizon refresca e perfuma a pele com leveza. Ideal para o dia, com fragrância floral limpa que dura até 4 horas.",
    ingredients:
      "Alcohol Denat, Aqua, Parfum, PEG-40 Hydrogenated Castor Oil, Limonene, Citronellol.",
    howToUse:
      "Borrife à distância sobre o corpo e as roupas. Reaplique ao longo do dia conforme desejado.",
    price: 69.9,
    brand: "Selavie Femme",
    gender: "FEMALE",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=900&q=80",
    ],
    stock: 110,
    soldCount: 340,
    rating: 4.6,
    reviewCount: 89,
    isNew: true,
    isBestSeller: false,
    categorySlug: "feminino",
    createdAt: "2026-05-01T10:00:00.000Z",
  },
  {
    id: "prod-011",
    name: "Protetor Solar Fluid SPF 50",
    slug: "protetor-solar-fluid-spf-50",
    shortDesc: "Fluido ultraleve com alta proteção e toque seco.",
    description:
      "Proteção UVA/UVB com acabamento invisível. Fórmula oil-free, sem deixar resíduos brancos, perfeita para pele oleosa e uso sob maquiagem.",
    ingredients:
      "Aqua, Ethylhexyl Methoxycinnamate, Zinc Oxide, Niacinamide, Silica, Glycerin, Tocopherol.",
    howToUse:
      "Aplique generosamente como último passo da rotina matinal. Reaplique a cada 2 horas de exposição solar.",
    price: 119.9,
    brand: "Selavie Femme",
    gender: "UNISEX",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80",
      "https://images.unsplash.com/photo-1571781926291-c77df043bb43?w=900&q=80",
    ],
    stock: 95,
    soldCount: 390,
    rating: 4.9,
    reviewCount: 167,
    isNew: false,
    isBestSeller: true,
    categorySlug: "cuidados-faciais",
    createdAt: "2025-05-10T10:00:00.000Z",
  },
  {
    id: "prod-012",
    name: "Kit Ritual Completo",
    slug: "kit-ritual-completo",
    shortDesc: "Limpeza, sérum e hidratante em um set premium.",
    description:
      "O Kit Ritual Completo reúne os best-sellers da Selavie Femme: Gel Pure Balance, Sérum Aqua Radiance e Hidratante Daily Soft. Ideal para iniciar ou presentear uma rotina completa de cuidados.",
    ingredients:
      "Consulte a composição individual de cada produto do kit.",
    howToUse:
      "1) Limpeza com Pure Balance. 2) Sérum Aqua Radiance. 3) Hidratante Daily Soft. Inclua protetor solar pela manhã.",
    price: 399.9,
    compareAt: 469.7,
    brand: "Selavie Femme",
    gender: "UNISEX",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80",
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=900&q=80",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900&q=80",
    ],
    stock: 30,
    soldCount: 88,
    rating: 5,
    reviewCount: 34,
    isNew: true,
    isBestSeller: true,
    categorySlug: "skincare",
    createdAt: "2026-06-01T10:00:00.000Z",
  },
];

export const productReviews: Record<string, Review[]> = {
  "prod-001": [
    {
      id: "rev-1",
      author: "Mariana S.",
      rating: 5,
      comment:
        "Pele luminosa desde a primeira semana. Textura leve e absorção rápida.",
      createdAt: "2026-01-15T12:00:00.000Z",
    },
    {
      id: "rev-2",
      author: "Camila R.",
      rating: 5,
      comment: "Não oleoso e combina perfeitamente com meu protetor solar.",
      createdAt: "2026-02-02T12:00:00.000Z",
    },
    {
      id: "rev-3",
      author: "Lucas A.",
      rating: 4,
      comment: "Excelente para pele masculina também. Hidrata sem pesar.",
      createdAt: "2026-03-08T12:00:00.000Z",
    },
  ],
  "prod-002": [
    {
      id: "rev-4",
      author: "Beatriz M.",
      rating: 5,
      comment: "Fragrância sofisticada e delicada. Recebo muitos elogios.",
      createdAt: "2026-02-20T12:00:00.000Z",
    },
  ],
  "prod-006": [
    {
      id: "rev-5",
      author: "Rafael T.",
      rating: 5,
      comment: "Projeção excelente e cheiro masculino moderno.",
      createdAt: "2026-01-30T12:00:00.000Z",
    },
  ],
};

export const brands = Array.from(new Set(products.map((p) => p.brand)));

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.categorySlug === product.categorySlug || p.gender === product.gender),
    )
    .slice(0, limit);
}
