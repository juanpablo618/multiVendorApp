import React, { useEffect, useState } from "react";
import { useHttpHook } from "../../Shares/Hooks/httpRequest";
import OptimizeHook from "../../Shares/Hooks/OptimizeHook";
import ProductItem from "../ProductItem/ProductItem";
import Background from "../../Shares/Background/Background";
import LoadingSpinner from "../../Shares/Loading_Spinner/LoadingSpinner";

function ProductList() {
  const [products, setProducts] = useState();
  const [
    isLoading,
    isError,
    errorHeader,
    errorDescripion,
    makeRequest,
    clearError
  ] = useHttpHook();
  useEffect(() => {
    try {
      const LoadData = async () => {
        const Data = await makeRequest("http://localhost:5000/Product/getAll/");
        setProducts(Data.Products);
      };
      LoadData();
    } catch (error) {}
  }, [makeRequest]);
  if (isLoading || isError) {
    return (
      <OptimizeHook
        isLoading={isLoading}
        isError={isError}
        errorHeader={errorHeader}
        errorDescripion={errorDescripion}
        clearError={clearError}
      />
    );
  } else if (products) {
    return <ProductItem products={products} />;
  } else {
    return (
      <>
        <Background />
        <LoadingSpinner asOverlay />
      </>
    );
  }
}

export default ProductList;
