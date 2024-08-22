"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Product } from "../types";

export default function Page() {
  let stt: number = 0;
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    productName: "",
    price: 0,
    image: "",
    quantity: 1,
  });
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      setError("Lỗi khi lấy danh sách sản phẩm");
    }
  };

  const handleAddProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post("/api/products", newProduct);
      fetchProducts();
      setNewProduct({ productName: "", price: 0, image: "", quantity: 1 });
    } catch (error) {
      setError("Lỗi khi thêm sản phẩm");
    }
  };

  const handleUpdateProduct = async () => {
    if (editProduct) {
      setLoading(true);
      setError(null);
      try {
        await axios.put(`/api/products?id=${editProduct.id}`, editProduct);
        fetchProducts();
        setEditProduct(null);
      } catch (error) {
        setError("Lỗi khi cập nhật sản phẩm");
      }
    }
  };

  const handleDeleteProduct = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/products?id=${id}`);
      fetchProducts();
    } catch (error) {
      setError("Lỗi khi xóa sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold">Quản lý sản phẩm</h1>
      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="mt-5">
        <h2 className="text-lg font-semibold">
          {editProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        </h2>
        <input
          type="text"
          value={editProduct ? editProduct.productName : newProduct.productName}
          onChange={(e) =>
            editProduct
              ? setEditProduct({ ...editProduct, productName: e.target.value })
              : setNewProduct({ ...newProduct, productName: e.target.value })
          }
          placeholder="Tên sản phẩm"
          className="border p-2"
        />
        <input
          type="number"
          value={editProduct ? editProduct.price : newProduct.price}
          onChange={(e) =>
            editProduct
              ? setEditProduct({
                  ...editProduct,
                  price: parseFloat(e.target.value),
                })
              : setNewProduct({
                  ...newProduct,
                  price: parseFloat(e.target.value),
                })
          }
          placeholder="Giá"
          className="border p-2 ml-2"
        />
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                if (editProduct) {
                  setEditProduct({
                    ...editProduct,
                    image: reader.result as string,
                  });
                } else {
                  setNewProduct({
                    ...newProduct,
                    image: reader.result as string,
                  });
                }
              };
              reader.readAsDataURL(file);
            }
          }}
          className="border p-2 ml-2"
        />
        <input
          type="number"
          value={editProduct ? editProduct.quantity : newProduct.quantity}
          onChange={(e) =>
            editProduct
              ? setEditProduct({
                  ...editProduct,
                  quantity: parseInt(e.target.value),
                })
              : setNewProduct({
                  ...newProduct,
                  quantity: parseInt(e.target.value),
                })
          }
          placeholder="Số lượng"
          className="border p-2 ml-2"
        />
        <button
          onClick={editProduct ? handleUpdateProduct : handleAddProduct}
          className="bg-blue-500 text-white p-2 ml-2"
        >
          {editProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
        </button>
        {editProduct && (
          <button
            onClick={() => setEditProduct(null)}
            className="bg-gray-500 text-white p-2 ml-2"
          >
            Hủy
          </button>
        )}
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              STT
            </th>
            <th scope="col" className="px-6 py-3">
              Tên sản phẩm
            </th>
            <th scope="col" className="px-6 py-3">
              Hình ảnh
            </th>
            <th scope="col" className="px-6 py-3">
              Giá
            </th>
            <th scope="col" className="px-6 py-3">
              Số lượng
            </th>
            <th scope="col" className="px-6 py-3">
              Chức năng
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => {
            return (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4">{stt++}</td>
                <td className="px-6 py-4">{product.productName}</td>
                <td className="px-6 py-4">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.productName}
                      className="w-16 h-16 object-cover mr-2"
                    />
                  )}
                </td>
                <td className="px-6 py-4">{formatCurrency(product.price)}</td>
                <td className="px-6 py-4">{product.quantity}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      setEditProduct(product);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="bg-yellow-500 text-white p-2 ml-2"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-500 text-white p-2 ml-2"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
