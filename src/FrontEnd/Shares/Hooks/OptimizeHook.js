import React from "react";
import Background from "../../Shares/Background/Background";
import LoadingSpinner from "../../Shares/Loading_Spinner/LoadingSpinner";
import Model from "../../Shares/Model/Model";
function OptimizeHook({
  isLoading,
  errorHeader,
  errorDescripion,
  clearError,
  isError
}) {
  if (isLoading)
    return (
      <React.Fragment>
        <Background />
        <LoadingSpinner asOverlay />
      </React.Fragment>
    );
  if (!isLoading && isError) {
    return (
      <React.Fragment>
        <Background />
        <Model
          header={errorHeader}
          description={errorDescripion}
          closeModel={clearError}
        />
      </React.Fragment>
    );
  }
}
export default OptimizeHook;
