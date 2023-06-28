import React, { useState, useEffect,useRef } from "react";
import { createWorker } from "@tensorflow/tfjs";
import axios from "axios";
import { caption_image, segment_image } from "../athena/interface_api";

const MyCanvas = () => {
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchImage = async () => {
      const response = await axios.get(
        "https://firebasestorage.googleapis.com/v0/b/my-works-3d.appspot.com/o/chat_photos%2Fpainter_BuwLdO5d_1681198001374_0.jpg?alt=media&token=16bdb5e6-799c-4fb5-9fb2-7e64c4a5df4c",
        { responseType: "blob" }
      );
      setImage(response.data);
    };

    fetchImage();
  }, []);

  useEffect(() => {
    if (image && canvasRef?.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const blobUrl = URL.createObjectURL(image);
      const img = new Image();
      img.src = blobUrl;

      img.onload = () => {
        console.log(img)
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        // caption_image(img)
        console.log(blobUrl)
      };
    }
  }, [image, canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "auto", maxWidth: "600px" }}
    />
  );
};

export default MyCanvas;
