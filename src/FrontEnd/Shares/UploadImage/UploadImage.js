import React, { useRef, useState, useEffect } from "react";
import "./UploadImage.css";

function UploadImage(props) {
  //uploadImage will put refference of input of type file-
  const uploadImage = useRef();
  //   This will used to set Image
  const [image, setImage] = useState();
  //   This will used to set url for img tag to show selected image-
  const [previewUrl, setPreviewUrl] = useState();
  //   When Click On Button It Will Open A Dialog Box For Selecting Image From File System-
  const OpenDialog = e => {
    uploadImage.current.click();
  };
  //   It Will Set Image When User Will Select Image From File System-
  const SetImg = e => {
    let pickedImage;
    let isValid;
    if (e.target.files && e.target.files.length === 1) {
      pickedImage = e.target.files[0];
      setImage(e.target.files[0]);
      isValid = true;
    } else {
      isValid = false;
    }
    props.onInput(props.id, pickedImage, isValid);
  };
  useEffect(() => {
    if (image) {
      // This condition will run when you select an image form file system-
      const fileReader = new FileReader();
      //   This function will execute automatically when the blob will converted into url-
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      //   This will start converting blob into url which can be set to img tag-
      fileReader.readAsDataURL(image);
    } else if (props.Image) {
      setPreviewUrl(props.Image);
    }
    //   This if condition will run when first time value of image will be null
    else if (!image) {
      return;
    }
  }, [image, props.Image]);
  return (
    <div className="upload_Img_Sction">
      <input
        style={{
          display: "none"
        }}
        ref={uploadImage}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={SetImg}
      />
      <div className="img_section">
        {previewUrl ? (
          <img src={previewUrl} alt="No Preview" />
        ) : (
          <p>Please Select An Image</p>
        )}
      </div>
      <button id="Upload_Btn" type="button" onClick={OpenDialog}>
        Upload Image
      </button>
    </div>
  );
}

export default UploadImage;
