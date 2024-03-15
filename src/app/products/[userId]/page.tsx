import WrapperFullWidth from "@/components/WrapperFullWidth";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import ProductPageContent from "./_components/ProductPageContent";

interface Props {
  params: {
    userId: string;
  };
}

const ProductPage = ({ params }: Props) => {
  const { userId } = params;

  if (!userId) {
    redirect("/sign-in");
  }
  return (
    <WrapperFullWidth>
      <ProductPageContent userId={userId} />
    </WrapperFullWidth>
  );
};

export default ProductPage;
