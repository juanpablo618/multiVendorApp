import { useState, useCallback } from "react";

export const useHttpHook = () => {
  // These All State Will Handle State Of Application
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorHeader, setErrorHeader] = useState();
  const [errorDescripion, setErrorDescripion] = useState();
  //   This Method Will Be Used To Make Ajax Call
  const makeRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      try {
        setIsLoading(true);
        const JSONData = await fetch(url, {
          method,
          body,
          headers
        });
        const Data = await JSONData.json();
        if (Data.Status === "Fail") {
          throw new Error(Data.error.message || Data.Message);
        }
        setIsLoading(false);
        return Data;
      } catch (error) {
        setIsLoading(false);
        setIsError(true);
        setErrorDescripion(error.message);
        setErrorHeader("Error Occur");
        throw error;
      }
    },
    []
  );
  //   This Method Is Used To Clear Error So That We Can Hide Error Popup Box-
  const clearError = useCallback(() => {
    setIsError(false);
  }, []);

  return [
    isLoading,
    isError,
    errorHeader,
    errorDescripion,
    makeRequest,
    clearError
  ];
};
