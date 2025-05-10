import React, { useState } from 'react'
import axios from '@/lib/axios.js'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from "@/components/ui/checkbox"

// Admin Single Product Page
export default function SingleProductPage() {
  const [product, setProduct] = useState({
    id: 'c57c288c-a26d-452e-9945-a5c44ca6dc6b',
    name: 'Nike Air Max Hoodie',
    price: '75.00',
    image: 'https://cloutcloset.com/cdn/shop/files/A2CFCF1B-60DB-4020-9F3B-EAD78A074EDC.jpg?v=1722376618&width=1946',
    stock_quantity: 40,
    categories: 'Hoodies',
    displayed_product: true,
  })
  const [newImageFile, setNewImageFile] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (field) => (e) => {
    setProduct({ ...product, [field]: e.target.value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setNewImageFile(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setProduct({ ...product, image: url })
    }
  }

  const handleRemoveImage = () => {
    setNewImageFile(null)
    setProduct({ ...product, image: '' })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append('name', product.name)
      formData.append('price', product.price)
      formData.append('stock_quantity', product.stock_quantity)
      formData.append('displayed_product', product.displayed_product)
      if (newImageFile) formData.append('image', newImageFile)

      await axios.patch(`/product/${product.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      // Optionally show success toast here
    } catch (err) {
      console.error('Save failed', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="flex flex-col md:flex-row gap-6">
        {/* Image upload / preview */}
        <div className="md:w-1/2 flex flex-col items-center gap-4">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover rounded-md"
            />
          ) : (
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-md">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          <div className="flex gap-2">
            <Input type="file" onChange={handleFileChange} />
            {product.image && (
              <Button variant="destructive" onClick={handleRemoveImage}>
                Remove
              </Button>
            )}
          </div>
        </div>

        {/* Editable details */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">
              <Label>Name</Label>
              <Input
                value={product.name}
                onChange={handleInputChange('name')}
                className="mt-1 text-xl"
              />
            </CardTitle>
            <CardDescription>
              <Label>Category</Label>
              <Input
                value={product.categories}
                onChange={handleInputChange('categories')}
                className="mt-1"
              />
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <Label>Price</Label>
              <Input
                type="number"
                value={product.price}
                onChange={handleInputChange('price')}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Stock Quantity</Label>
              <Input
                type="number"
                value={product.stock_quantity}
                onChange={handleInputChange('stock_quantity')}
                className="mt-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label>Visible</Label>
              <Checkbox
                checked={product.displayed_product}
                onCheckedChange={(val) =>
                  setProduct({ ...product, displayed_product: val })
                }
              />
            </div>
          </CardContent>

          <CardFooter className="mt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full md:w-auto"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </div>
      </Card>
    </div>
  )
}
