"use client";
import SideBar from "@/app/products/[userId]/_components/SideBar";
import React from "react";
import ProductCreateNew from "./ProductCreateNew";

export const menuList: menuItemType[] = [
  "Products",
  "Create New",
  "Media",
  "Files",
  "Orders",
];
export type menuItemType =
  | "Products"
  | "Create New"
  | "Media"
  | "Files"
  | "Orders";

const ProductPageContent = ({ userId }: { userId: string }) => {
  const [active, setActive] = React.useState<menuItemType>("Create New");
  return (
    <div className="flex h-full">
      <SideBar active={active} setActive={setActive} />

      <div className={"flex-1"}>
        <ProductCreateNew userId={userId} />
      </div>
    </div>
  );
};

export default ProductPageContent;
