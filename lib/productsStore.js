const makeId = () => Math.random().toString(36).substr(2, 9);

const initialProducts = [
  {
    id: makeId(),
    name: "Classic Tee",
    slug: "classic-tee",
    sku: "TEE-CLSC-001",
    price: 1999,
    currency: "USD",
    description: "A timeless classic tee made from organic cotton.",
    attributes: [
      {
        group: "General",
        items: [
          { name: "Brand", value: "SimplePIM" },
          { name: "Material", value: "100% Organic Cotton" }
        ]
      },
      {
        group: "Fit",
        items: [
          { name: "Gender", value: "Unisex" },
          { name: "Fit", value: "Regular" }
        ]
      }
    ],
    variants: [
      {
        id: makeId(),
        sku: "TEE-CLSC-001-BLK-S",
        attributes: [
          { name: "Color", value: "Black" },
          { name: "Size", value: "S" }
        ],
        priceDelta: 0,
        stock: 25
      },
      {
        id: makeId(),
        sku: "TEE-CLSC-001-BLK-M",
        attributes: [
          { name: "Color", value: "Black" },
          { name: "Size", value: "M" }
        ],
        priceDelta: 0,
        stock: 34
      },
      {
        id: makeId(),
        sku: "TEE-CLSC-001-WHT-L",
        attributes: [
          { name: "Color", value: "White" },
          { name: "Size", value: "L" }
        ],
        priceDelta: 100,
        stock: 12
      }
    ],
    media: [
      { kind: "image", url: "/images/classic-tee/black-front.jpg", alt: "Classic Tee Black - Front" },
      { kind: "image", url: "/images/classic-tee/black-back.jpg", alt: "Classic Tee Black - Back" }
    ]
  },
  {
    id: makeId(),
    name: "Everyday Hoodie",
    slug: "everyday-hoodie",
    sku: "HD-ED-002",
    price: 4999,
    currency: "USD",
    description: "Cozy fleece-lined hoodie for everyday comfort.",
    attributes: [
      {
        group: "General",
        items: [
          { name: "Brand", value: "SimplePIM" },
          { name: "Material", value: "Fleece Blend" }
        ]
      },
      {
        group: "Care",
        items: [
          { name: "Machine Wash", value: "Cold" },
          { name: "Tumble Dry", value: "Low" }
        ]
      }
    ],
    variants: [
      {
        id: makeId(),
        sku: "HD-ED-002-GRY-S",
        attributes: [
          { name: "Color", value: "Grey" },
          { name: "Size", value: "S" }
        ],
        priceDelta: 0,
        stock: 8
      },
      {
        id: makeId(),
        sku: "HD-ED-002-GRY-XL",
        attributes: [
          { name: "Color", value: "Grey" },
          { name: "Size", value: "XL" }
        ],
        priceDelta: 300,
        stock: 5
      }
    ],
    media: [
      { kind: "image", url: "/images/everyday-hoodie/grey-front.jpg", alt: "Everyday Hoodie Grey - Front" }
    ]
  },
  {
    id: makeId(),
    name: "Trail Sneakers",
    slug: "trail-sneakers",
    sku: "SNK-TRL-003",
    price: 7999,
    currency: "USD",
    description: "Lightweight trail sneakers with superior grip.",
    attributes: [
      {
        group: "General",
        items: [
          { name: "Brand", value: "SimplePIM" },
          { name: "Upper", value: "Mesh" }
        ]
      },
      {
        group: "Specs",
        items: [
          { name: "Drop", value: "8mm" },
          { name: "Weight", value: "270g" }
        ]
      }
    ],
    variants: [
      {
        id: makeId(),
        sku: "SNK-TRL-003-GRN-42",
        attributes: [
          { name: "Color", value: "Green" },
          { name: "EU Size", value: "42" }
        ],
        priceDelta: 0,
        stock: 16
      },
      {
        id: makeId(),
        sku: "SNK-TRL-003-GRN-43",
        attributes: [
          { name: "Color", value: "Green" },
          { name: "EU Size", value: "43" }
        ],
        priceDelta: 0,
        stock: 10
      }
    ],
    media: [
      { kind: "image", url: "/images/trail-sneakers/green-side.jpg", alt: "Trail Sneakers Green - Side" }
    ]
  }
];

let products = initialProducts.map((p) => ({ ...p }));

function list() {
  return products.map((p) => ({ ...p }));
}

function getById(id) {
  return products.find((p) => p.id === id) || null;
}

function create(input) {
  const id = makeId();
  const now = Date.now();
  const base = {
    id,
    name: String(input.name || "Untitled"),
    slug: String(input.slug || (String(input.name || "product") + "-" + id)).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    sku: String(input.sku || ("SKU-" + id)).toUpperCase(),
    price: Number.isFinite(input.price) ? Math.floor(input.price) : 0,
    currency: input.currency || "USD",
    description: input.description || "",
    attributes: Array.isArray(input.attributes) ? input.attributes : [],
    variants: Array.isArray(input.variants) ? input.variants.map((v) => ({ id: makeId(), ...v })) : [],
    media: Array.isArray(input.media) ? input.media : [],
    createdAt: now,
    updatedAt: now
  };
  products.unshift(base);
  return { ...base };
}

function update(id, patch) {
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const prev = products[idx];
  const next = {
    ...prev,
    ...patch,
    slug: patch.slug ? String(patch.slug) : prev.slug,
    updatedAt: Date.now()
  };
  products[idx] = next;
  return { ...next };
}

function remove(id) {
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  products.splice(idx, 1);
  return true;
}

function reset(seed) {
  products = (seed || initialProducts).map((p) => ({ ...p }));
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  reset
};
