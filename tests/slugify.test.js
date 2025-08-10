const { slugify } = require("../lib/slugify");

describe("slugify", () => {
  test("basic spacing and casing", () => {
    expect(slugify("Red Shirt XL")).toBe("red-shirt-xl");
  });

  test("removes accents", () => {
    expect(slugify("Café crème")).toBe("cafe-creme");
  });

  test("strips symbols and percentages", () => {
    expect(slugify("Hello!!! 100%")),
    expect(slugify("Hello!!! 100%")).toBe("hello-100");
  });

  test("collapses dashes and trims", () => {
    expect(slugify(" --A__B-- ")).toBe("a-b");
  });
});
