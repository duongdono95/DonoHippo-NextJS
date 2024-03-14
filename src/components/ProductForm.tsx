"use client";
import { Dialog, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

interface Props {
  openForm: boolean;
  setOpenForm: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

const ProductForm = ({ openForm, setOpenForm }: Props) => {
  return (
    <Dialog
      open={openForm}
      onClose={() => setOpenForm(false)}
    >
      <form>
        <TextField />
      </form>
    </Dialog>
  );
};

export default ProductForm;
