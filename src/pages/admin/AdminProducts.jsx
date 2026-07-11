import ProductsTable from '../../components/admin/ProductsTable'

export default function AdminProducts() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-brand-dark">Product Inventory</h1>
        <p className="text-sm text-brand-muted mt-1">
          Manage your full product catalog. Add, edit, hide or show products.
          Changes persist in your browser session.
        </p>
      </div>
      <ProductsTable />
    </div>
  )
}
