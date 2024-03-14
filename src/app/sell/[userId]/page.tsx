import ProductForm from "@/components/ProductForm";
import WrapperFullWidth from "@/components/WrapperFullWidth";
import { auth } from "@clerk/nextjs";
import { Button } from "@mui/material";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { useState } from "react";

interface Props {
  params: {
    userId: string;
  };
}

const SalePage = ({ params }: Props) => {
  const { userId } = params;

  if (!userId) {
    redirect("/");
  }
  const products = [];

  if (products.length > 0) {
    return (
      <WrapperFullWidth>
        <div>test</div>
      </WrapperFullWidth>
    );
  }

  if (products.length === 0) {
    return (
      <WrapperFullWidth>
        <div className="text-center p-8">
          <p>
            You have not added any products to sell yet.
          </p>

          <Button
            variant="outlined"
            sx={{ marginTop: "16px" }}
          >
            Add a product
          </Button>

          <div className="relative h-96 w-96 mx-auto">
            <Image
              src={"/hippo-empty-cart.png"}
              fill
              alt="empty-shop"
            />
          </div>
        </div>
        {/* <ProductForm
          openForm={openForm}
          setOpenForm={setOpenForm}
        /> */}
      </WrapperFullWidth>
    );
  }
};

export default SalePage;
