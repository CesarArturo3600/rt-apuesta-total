import { CarouselProps } from "../interfaces/interface";

export const getSettings = (props: CarouselProps) => ({
  dots: true,
  infinite: true,
  speed: props.speed || 500,
  slidesToShow: props.slidesToShow || 4,
  slidesToScroll: props.slidesToScroll || 1,
  autoplay: props.autoplay || true,
  autoplaySpeed: props.autoplaySpeed || 3000,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 1,
        dots: true,
      },
    },
    {
      breakpoint: 500,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        dots: false,
      },
    },
  ],
});
