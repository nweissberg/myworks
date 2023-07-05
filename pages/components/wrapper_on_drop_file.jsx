import React, { useState } from "react";

const ImageDropWrapper = (props) => {
  const [droppedImage, setDroppedImage] = useState(null);

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];

    // Check if the dropped file is an image
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = () => {
        // Once the image is loaded, set it as the droppedImage state
        // setDroppedImage(reader.result);
        props.onFileDrop(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      {...props}
      //   style={{ width: '300px', height: '300px', border: '1px solid black' }}
    >
      {/* {droppedImage ? (
        <img src={droppedImage} alt="Dropped" style={{ width: '100%', height: '100%' }} />
      ) : (
        <p>Drop an image here</p>
      )} */}
      {props.children}
    </div>
  );
};

export default ImageDropWrapper;
