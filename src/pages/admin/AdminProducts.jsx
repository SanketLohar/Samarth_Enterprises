import ProductsTable from '../../components/admin/ProductsTable'

export default function AdminProducts() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Product Inventory</h1>
          <p className="text-xs text-slate-500 mt-1">Manage your full product catalog. Add, edit, hide or show products.</p>
        </div>
      </div>
      <ProductsTable />
    </div>
  )
}
