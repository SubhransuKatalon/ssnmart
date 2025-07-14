import './Admin.css'; // 👈 Add this at the top

return (
  <div className="admin-container">
    <h2>Add Product (Admin)</h2>
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
      <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} required />
      <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
      <select name="category" onChange={handleChange} value={form.category}>
        {categories.map(c => <option key={c}>{c}</option>)}
      </select>

      <div className="spec-section">
        <input
          type="text"
          placeholder="Add Specification"
          value={specInput}
          onChange={(e) => setSpecInput(e.target.value)}
        />
        <button type="button" className="add-spec-btn" onClick={addSpec}>Add Spec</button>
      </div>

      <ul className="spec-list">
        {specifications.map((spec, idx) => (
          <li key={idx}>
            {spec}
            <button type="button" className="remove-spec-btn" onClick={() => removeSpec(idx)}>❌</button>
          </li>
        ))}
      </ul>

      <button type="submit">Add Product</button>
    </form>
  </div>
);