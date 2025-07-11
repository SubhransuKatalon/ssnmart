import { useState } from 'react';
import axios from 'axios';

export default function Admin() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    category: 'Electronics'
  });

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Furniture',
    'Beauty & Personal care',
    'Grocery'
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${import.meta.env.VITE_API_URL}/api/products`, form)
      .then(() => alert('✅ Product added!'))
      .catch(() => alert('❌ Failed to add product'));
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: 'auto' }}>
      <h2>Add Product (Admin)</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" onChange={handleChange} required />
        <input name="image" placeholder="Image URL" onChange={handleChange} required />
        <input name="description" placeholder="Description" onChange={handleChange} required />
        <select name="category" onChange={handleChange} value={form.category}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}
