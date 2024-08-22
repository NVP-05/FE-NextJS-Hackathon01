import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { Product } from "../../types";

const filePath = path.join(process.cwd(), "database", "products.json");

export async function GET(request: NextRequest) {
  const products = JSON.parse(fs.readFileSync(filePath, "utf8")) as Product[];

  const id = request.nextUrl.searchParams.get("id");
  if (id) {
    const product = products.find((p) => p.id === Number(id));
    if (!product) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }
    return NextResponse.json(product);
  }

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const products = JSON.parse(fs.readFileSync(filePath, "utf8")) as Product[];
  const newProduct = (await request.json()) as Product;

  newProduct.id =
    products.length > 0 ? products[products.length - 1].id + 1 : 1;

  const isDuplicate = products.some(
    (p) => p.productName === newProduct.productName
  );
  if (isDuplicate) {
    return NextResponse.json(
      { message: "Tên sản phẩm đã tồn tại" },
      { status: 400 }
    );
  }

  products.push(newProduct);
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

  return NextResponse.json(newProduct, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const products = JSON.parse(fs.readFileSync(filePath, "utf8")) as Product[];
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "ID là bắt buộc" }, { status: 400 });
  }

  const index = products.findIndex((p) => p.id === Number(id));
  if (index === -1) {
    return NextResponse.json(
      { message: "Không tìm thấy sản phẩm" },
      { status: 404 }
    );
  }

  const updatedProduct = (await request.json()) as Product;
  products[index] = { ...products[index], ...updatedProduct };

  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  return NextResponse.json(products[index], { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const products = JSON.parse(fs.readFileSync(filePath, "utf8")) as Product[];
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "ID là bắt buộc" }, { status: 400 });
  }

  const updatedProducts = products.filter((p) => p.id !== Number(id));

  if (updatedProducts.length === products.length) {
    return NextResponse.json(
      { message: "Không tìm thấy sản phẩm" },
      { status: 404 }
    );
  }

  fs.writeFileSync(filePath, JSON.stringify(updatedProducts, null, 2));
  return NextResponse.json({ message: "Xóa sản phẩm thành công" }, { status: 200 });
}
