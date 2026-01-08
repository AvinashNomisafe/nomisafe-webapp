/* Image Carousel Component */

import React from "react";
import { Box, Card } from "@mui/material";

const ImageCarousel = () => {
  const images = [
    {
      id: 1,
      url: "https://via.placeholder.com/400x200/4DB6AC/ffffff?text=Secure+Your+Future",
      alt: "Secure Your Future",
    },
    {
      id: 2,
      url: "https://via.placeholder.com/400x200/FF6B6B/ffffff?text=Protect+What+Matters",
      alt: "Protect What Matters",
    },
    {
      id: 3,
      url: "https://via.placeholder.com/400x200/9C27B0/ffffff?text=Peace+of+Mind",
      alt: "Peace of Mind",
    },
  ];

  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <Card sx={{ mb: 3, overflow: "hidden" }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 200,
          overflow: "hidden",
        }}
      >
        <img
          src={images[currentIndex].url}
          alt={images[currentIndex].alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 1,
          }}
        >
          {images.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentIndex(index)}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor:
                  index === currentIndex ? "#fff" : "rgba(255,255,255,0.5)",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            />
          ))}
        </Box>
      </Box>
    </Card>
  );
};

export default ImageCarousel;
