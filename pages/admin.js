import { useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const Admin = () => {
  const [product, setProduct] = useState({ name: '', description: '', price: '' });

  const handleInputChange = (event) => {
    setProduct({ ...product, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('/api/products', product)
      .then(() => setProduct({ name: '', description: '', price: '' }))
      .catch((err) => console.error(err));
  };

  return (
    <Layout>
      <h1>Admin</h1>
      <form onSubmit={handleSubmit}>
        <input type='text' name='name' placeholder='Name' onChange={handleInputChange} value={product.name} required aria-label='Product Name' />
        <input type='text' name='description' placeholder='Description' onChange={handleInputChange} value={product.description} required aria-label='Product Description' />
        <input type='number' name='price' placeholder='Price' onChange={handleInputChange} value={product.price} required aria-label='Product Price' />
        <button type='submit'>Legg til produkt</button>
      </form>
    </Layout>
  );
};

export default Admin;