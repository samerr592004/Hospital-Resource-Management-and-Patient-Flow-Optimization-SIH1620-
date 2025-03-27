import React, { useEffect, useRef, useState } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";

const ImageCropper = ({ image, onCropComplete, onClose,aspectRatio = 1 }) => {
  const cropperRef = useRef(null);
  const [cropper, setCropper] = useState(null);

  useEffect(() => {
    if (image && cropperRef.current) {
      const cropperInstance = new Cropper(cropperRef.current, {
        aspectRatio: aspectRatio,
        viewMode: 2,
        autoCropArea: 1,
      });
      setCropper(cropperInstance);
    }
  }, [image]);

  // Apply cropped image
  const applyCrop = () => {
    if (cropper) {
      const canvas = cropper.getCroppedCanvas();
      if (canvas) {
        canvas.toBlob((blob) => {
          onCropComplete(blob); // Send the cropped image back
          onClose(); // Close the popup
        }, "image/png");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full text-center">
        <h2 className="text-lg font-semibold mb-4">Crop Image</h2>
        <div className="w-full flex justify-center">
          <img ref={cropperRef} src={URL.createObjectURL(image)} alt="Crop" className="max-w-full" />
        </div>

        <div className="mt-4 flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={applyCrop}
            className="bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Crop & Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
