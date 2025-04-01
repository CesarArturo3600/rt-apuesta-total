import Slider from "react-slick";

// Necesitamos importar los estilos de react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CarouselProps } from "../../interfaces/interface";
import { getSettings } from "../../settings/carousel_settings";
import { useEffect, useState } from "react";

const Carousel: React.FC<CarouselProps> = ({
  autoplay = true,
  speed = 500,
  autoplaySpeed = 3000,
  slidesToShow = 4,
  slidesToScroll = 1,
  slides = [],
}) => {
  console.log("🚀 ~ slides:", slides);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
  const [loadedCount, setLoadedCount] = useState<number>(0);

  const [processedSlides, setProcessedSlides] = useState(slides);
  console.log("🚀 ~ processedSlides:", processedSlides);

  const settings = getSettings({
    autoplay,
    speed,
    autoplaySpeed,
    slidesToShow,
    slidesToScroll,
  });

  const errorImg =
    "https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=";

  useEffect(() => {
    if (slides.length === 0) return;

    const processedSlidesCopy = [...slides];
    console.log(
      "🚀 ~ useEffect ~ processedSlidesCopy:::::::::",
      processedSlidesCopy
    );

    const arrPromises = slides.map((slide, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          setLoadedCount((prevCount) => {
            const newCount = prevCount + 1;

            if (newCount === slides.length) {
              setImagesLoaded(true);
            }

            return newCount;
          });
          resolve();
        };
        img.onerror = () => {
          processedSlidesCopy[index] = {
            ...slide,
            image: errorImg,
          };

          setProcessedSlides(processedSlidesCopy);

          setLoadedCount((prevCount) => {
            const newCount = prevCount + 1;

            if (newCount === slides.length) {
              setImagesLoaded(true);
            }

            return newCount;
          });
          resolve();
        };

        img.src = slide.image;
      });
    });

    Promise.all(arrPromises);
  }, [slides]);

  if (!imagesLoaded && slides.length > 0) {
    return (
      <div className="carousel-loading">
        <p>
          Cargando imágenes.!!!.. {loadedCount} de {slides.length}
        </p>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{
              width: `${(loadedCount / slides.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="carousel-container"
      style={{ margin: "0 auto", maxWidth: "800px" }}
    >
      <Slider {...settings}>
        {processedSlides.map((slide, index) => {
          return (
            <div key={index} style={{ outline: "none" }}>
              <img
                src={slide.image}
                alt={slide.name}
                style={{ width: "100%", height: "auto", borderRadius: "8px" }}
              />
              <h3 style={{ marginTop: "10px", marginBottom: "5px" }}>
                {slide.name}
              </h3>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default Carousel;
