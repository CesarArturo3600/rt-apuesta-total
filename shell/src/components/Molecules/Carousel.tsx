import { useEffect, useState } from "react";
import Slider from "react-slick";

// Necesitamos importar los estilos de react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CarouselProps } from "../../interfaces/interface";
import { getSettings } from "../../settings/carousel_settings";

const Carousel: React.FC<CarouselProps> = ({
  autoplay = true,
  speed = 500,
  autoplaySpeed = 3000,
  slidesToShow = 4,
  slidesToScroll = 1,
  slides = [],
}) => {
  //estados
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [processedSlides, setProcessedSlides] = useState([...slides]);

  const noImage =
    "https://thumb.ac-illust.com/b1/b170870007dfa419295d949814474ab2_t.jpeg";

  const settings = getSettings({
    autoplay,
    speed,
    autoplaySpeed,
    slidesToShow,
    slidesToScroll,
  });

  useEffect(() => {
    if (slides.length === 0) return;

    setImagesLoaded(false);
    setLoadedCount(0);
    setProcessedSlides([...slides]);

    const processedSlidesCopy = [...slides];

    const arrSlides = slides.map((slide, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          setLoadedCount((prev) => {
            const count = prev + 1;
            if (count === slides.length) {
              setImagesLoaded(true);
            }
            return count;
          });

          resolve();
        };
        img.onerror = () => {
          processedSlidesCopy[index] = {
            ...processedSlidesCopy[index],
            image: noImage,
          };
          setProcessedSlides(processedSlidesCopy);

          setLoadedCount((prev) => {
            const count = prev + 1;
            if (count === slides.length) {
              setImagesLoaded(true);
            }
            return count;
          });

          resolve();
        };

        img.src = slide.image;
      });
    });

    Promise.all(arrSlides);
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
            <div key={slide?.id || index} style={{ outline: "none" }}>
              <img
                src={slide.image}
                alt={slide.name}
                style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = noImage;
                }}
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
