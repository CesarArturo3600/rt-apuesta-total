interface Props {
  urlImg: string;
}

const imgSlider = ({ urlImg }: Props) => {
  return (
    <div className="imgSlider">
      <img src={urlImg} alt="" />
    </div>
  );
};

export default imgSlider;
