import generateSampleProducts from './sampleProductsGenerator';

// Export a default batch of sample products used across the app and tests.
// Keeping this file as a thin wrapper allows other code to `import sampleProducts`
// without having to know about the generator.

const sampleProducts = generateSampleProducts(80);

export default sampleProducts;
export { generateSampleProducts };
