// lib/products.js
const fetch = require('isomorphic-unfetch');

export async function getProducts() {
  const response = await fetch('https://api.example.com/products');
  const data = await response.json();
  return data;
}
