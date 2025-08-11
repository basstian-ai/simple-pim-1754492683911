const attributeGroups = [
  {
    id: "grp_basics",
    name: "Basics",
    attributes: [
      { id: "attr_name", code: "name", name: "Name", type: "text" },
      { id: "attr_sku", code: "sku", name: "SKU", type: "text" },
      { id: "attr_desc", code: "description", name: "Description", type: "richtext" }
    ]
  },
  {
    id: "grp_dimensions",
    name: "Dimensions",
    attributes: [
      { id: "attr_width", code: "width", name: "Width (cm)", type: "number" },
      { id: "attr_height", code: "height", name: "Height (cm)", type: "number" },
      { id: "attr_length", code: "length", name: "Length (cm)", type: "number" },
      { id: "attr_weight", code: "weight", name: "Weight (kg)", type: "number" }
    ]
  },
  {
    id: "grp_media",
    name: "Media",
    attributes: [
      { id: "attr_images", code: "images", name: "Images", type: "media[]" },
      { id: "attr_video", code: "video", name: "Video URL", type: "url" }
    ]
  },
  {
    id: "grp_seo",
    name: "SEO",
    attributes: [
      { id: "attr_meta_title", code: "meta_title", name: "Meta Title", type: "text" },
      { id: "attr_meta_description", code: "meta_description", name: "Meta Description", type: "textarea" }
    ]
  }
];

module.exports = { attributeGroups };
