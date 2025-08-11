const sampleProducts = [
  {
    id: "prod_aurora_tee",
    slug: "aurora-cotton-tshirt",
    name: "Aurora Cotton T-Shirt",
    description:
      "Ultra-soft 100% cotton tee with a classic fit. Built for everyday comfort and durability.",
    sku: "AUR-TEE",
    status: "active",
    currency: "USD",
    price: 1999,
    compareAtPrice: 2499,
    inventory: {
      policy: "deny",
      total: 320,
      locations: [
        { id: "wh_nyc", name: "NYC Warehouse", available: 180 },
        { id: "wh_sfo", name: "SFO Warehouse", available: 140 }
      ]
    },
    images: [
      { src: "/images/products/aurora-tee/main.jpg", alt: "Aurora Cotton T-Shirt front" },
      { src: "/images/products/aurora-tee/back.jpg", alt: "Aurora Cotton T-Shirt back" },
      { src: "/images/products/aurora-tee/detail.jpg", alt: "Fabric detail" }
    ],
    options: [
      { name: "Color", values: ["Black", "White", "Navy", "Moss"] },
      { name: "Size", values: ["XS", "S", "M", "L", "XL"] }
    ],
    variants: [
      { id: "var_aurtee_blk_s", sku: "AUR-TEE-BLK-S", options: { Color: "Black", Size: "S" }, barcode: "1111111111111", price: 1999, inventory: 40 },
      { id: "var_aurtee_blk_m", sku: "AUR-TEE-BLK-M", options: { Color: "Black", Size: "M" }, barcode: "1111111111112", price: 1999, inventory: 60 },
      { id: "var_aurtee_wht_m", sku: "AUR-TEE-WHT-M", options: { Color: "White", Size: "M" }, barcode: "1111111111123", price: 1999, inventory: 55 },
      { id: "var_aurtee_nvy_l", sku: "AUR-TEE-NVY-L", options: { Color: "Navy", Size: "L" }, barcode: "1111111111134", price: 1999, inventory: 25 },
      { id: "var_aurtee_mos_xl", sku: "AUR-TEE-MOS-XL", options: { Color: "Moss", Size: "XL" }, barcode: "1111111111145", price: 1999, inventory: 18 }
    ],
    attributeGroups: [
      {
        name: "Basics",
        attributes: [
          { key: "brand", label: "Brand", type: "text", value: "Aurora" },
          { key: "material", label: "Material", type: "text", value: "100% Cotton" },
          { key: "care", label: "Care", type: "text", value: "Machine wash cold, tumble dry low" }
        ]
      },
      {
        name: "Dimensions",
        attributes: [
          { key: "weight", label: "Weight", type: "number", unit: "g", value: 180 },
          { key: "package_dimensions", label: "Package Dimensions", type: "text", value: "30 x 25 x 3 cm" }
        ]
      },
      {
        name: "SEO",
        attributes: [
          { key: "metaTitle", label: "Meta Title", type: "text", value: "Aurora Cotton T-Shirt | Everyday Comfort" },
          { key: "metaDescription", label: "Meta Description", type: "text", value: "Our best-selling cotton t-shirt offers a perfect blend of comfort and durability." }
        ]
      }
    ]
  },
  {
    id: "prod_nimbus_shoes",
    slug: "nimbus-running-shoes",
    name: "Nimbus Running Shoes",
    description:
      "Lightweight road running shoes with breathable mesh upper and responsive foam. Designed for daily training and long runs.",
    sku: "NIM-RUN",
    status: "active",
    currency: "USD",
    price: 8999,
    compareAtPrice: null,
    inventory: {
      policy: "continue",
      total: 145,
      locations: [
        { id: "wh_nyc", name: "NYC Warehouse", available: 70 },
        { id: "wh_sfo", name: "SFO Warehouse", available: 75 }
      ]
    },
    images: [
      { src: "/images/products/nimbus/main.jpg", alt: "Nimbus Running Shoes - side view" },
      { src: "/images/products/nimbus/sole.jpg", alt: "Nimbus Running Shoes - outsole" }
    ],
    options: [
      { name: "Color", values: ["Graphite", "Crimson", "Cobalt"] },
      { name: "Size", values: ["7", "8", "9", "10", "11", "12"] },
      { name: "Width", values: ["Regular", "Wide"] }
    ],
    variants: [
      { id: "var_nim_gra_9_reg", sku: "NIM-GRA-9-R", options: { Color: "Graphite", Size: "9", Width: "Regular" }, barcode: "2222222222001", price: 8999, inventory: 10 },
      { id: "var_nim_gra_10_reg", sku: "NIM-GRA-10-R", options: { Color: "Graphite", Size: "10", Width: "Regular" }, barcode: "2222222222002", price: 8999, inventory: 12 },
      { id: "var_nim_cri_9_wide", sku: "NIM-CRI-9-W", options: { Color: "Crimson", Size: "9", Width: "Wide" }, barcode: "2222222222003", price: 8999, inventory: 8 },
      { id: "var_nim_cob_11_reg", sku: "NIM-COB-11-R", options: { Color: "Cobalt", Size: "11", Width: "Regular" }, barcode: "2222222222004", price: 8999, inventory: 9 }
    ],
    attributeGroups: [
      {
        name: "Performance",
        attributes: [
          { key: "drop", label: "Heel-to-Toe Drop", type: "number", unit: "mm", value: 8 },
          { key: "stack", label: "Stack Height", type: "number", unit: "mm", value: 28 },
          { key: "terrain", label: "Terrain", type: "text", value: "Road" }
        ]
      },
      {
        name: "Materials",
        attributes: [
          { key: "upper", label: "Upper", type: "text", value: "Engineered Mesh" },
          { key: "midsole", label: "Midsole", type: "text", value: "Responsive EVA Foam" },
          { key: "outsole", label: "Outsole", type: "text", value: "Rubber" }
        ]
      }
    ]
  },
  {
    id: "prod_luna_mug",
    slug: "luna-ceramic-mug",
    name: "Luna Ceramic Mug",
    description:
      "12 oz ceramic mug with matte glaze and ergonomic handle. Microwave and dishwasher safe.",
    sku: "LUN-MUG",
    status: "draft",
    currency: "USD",
    price: 1499,
    compareAtPrice: 1799,
    inventory: {
      policy: "deny",
      total: 520,
      locations: [
        { id: "wh_nyc", name: "NYC Warehouse", available: 300 },
        { id: "wh_sfo", name: "SFO Warehouse", available: 220 }
      ]
    },
    images: [
      { src: "/images/products/luna-mug/main.jpg", alt: "Luna ceramic mug - matte gray" },
      { src: "/images/products/luna-mug/handle.jpg", alt: "Luna mug handle detail" }
    ],
    options: [
      { name: "Color", values: ["Matte Gray", "Ivory", "Forest"] }
    ],
    variants: [
      { id: "var_luna_gray_std", sku: "LUN-GRY-12OZ", options: { Color: "Matte Gray" }, barcode: "3333333333001", price: 1499, inventory: 180 },
      { id: "var_luna_ivory_std", sku: "LUN-IVR-12OZ", options: { Color: "Ivory" }, barcode: "3333333333002", price: 1499, inventory: 210 },
      { id: "var_luna_forest_std", sku: "LUN-FOR-12OZ", options: { Color: "Forest" }, barcode: "3333333333003", price: 1499, inventory: 130 }
    ],
    attributeGroups: [
      {
        name: "Specs",
        attributes: [
          { key: "capacity", label: "Capacity", type: "number", unit: "oz", value: 12 },
          { key: "finish", label: "Finish", type: "text", value: "Matte glaze" },
          { key: "dimensions", label: "Dimensions", type: "text", value: "9.5 cm x 8.5 cm" }
        ]
      },
      {
        name: "Compliance",
        attributes: [
          { key: "foodSafe", label: "Food Safe", type: "boolean", value: true },
          { key: "microwaveSafe", label: "Microwave Safe", type: "boolean", value: true },
          { key: "dishwasherSafe", label: "Dishwasher Safe", type: "boolean", value: true }
        ]
      }
    ]
  }
];

module.exports = sampleProducts;
