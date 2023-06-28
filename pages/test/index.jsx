import React, { useEffect, useState } from "react";
import { blob_to_image, dataToImage, extractHiddenDataFromImage, hideStringInImage, imageToData } from "../utils";
import { Button } from "primereact/button";

const test_promps = [
  "make a painting in davinci style of the museum of art of são paulo masp, red letter, open ceiling, highly detailed, painted by velazquez, beksinski, giger",
  "modelshoot style, analog style, mdjrny-v4 style, nousr robot, mdjrny-v4, masterpiece, best quality, 8k, pastel, minimalistic style, highly detailed, depth of field, sharp focus, hdr, absurdres, high detail, ultra-detailed, highres, high quality, intricate details, outdoors, ultra high res, 4k, extremely detailed, realistic, photorealistic, raw photo, cinematic lighting",
  "symmetrical, blury, deformed, cropped, low quality, bad anatomy, multilated, long neck, mutation, malformed limbs, username, poorly drawn face, mutated, easynegative, blurry, monochrome, missing fingers, error, missing legs, jpeg artifacts, watermark, text, too many fingers, poorly drawn hands, duplicate, extra legs, signature"
  ]

function EditImageMetadata() {
  const [imageObj, setImageObj] = useState(null);

  function handleImageChange(evt) {
    if (!evt.target.files?.[0]) return;
    const file = evt.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setImageObj(e.target.result);
    };

    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div className="flex w-full z-1 absolute top-0 left-0 justify-content-center p-3 bg-black-alpha-80 bg-blur-1">
        <Button
          label="Encode"
          onClick={(e) => {
            imageToData(imageObj).then((imageData) => {
              const encodedImage = hideStringInImage(
                imageData,
                JSON.stringify(test_promps),
								'png'
              );
              console.log(encodedImage);
							setImageObj(encodedImage);
            });
          }}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <Button
          label="Decode"
          onClick={(e) => {
            imageToData(imageObj).then((imageData) => {
              console.log(imageData);
              
              const extractedData = extractHiddenDataFromImage(imageData.data,'png')
              console.log(extractedData);
            });
          }}
        />
      </div>
      <div className="hide-scroll overflow-scroll flex h-full w-screen min-h-screen top-0 left-0 justify-content-center surface-ground">
        {imageObj && (
          <img
            alt="Image Data Encoder"
            className="bitmap relative center"
            src={imageObj}
          />
        )}
      </div>
    </div>
  );
}

export default EditImageMetadata;
