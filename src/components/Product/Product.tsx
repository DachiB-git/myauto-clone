import engineImg from "../../svgs/engine.svg";
import gearboxImg from "../../svgs/gearbox.svg";
import distImg from "../../svgs/dist.svg";
import wheelImg from "../../svgs/wheel.svg";
import greenCheckImg from "../../svgs/green_check.svg";
import { useEffect, useState } from "react";
import { gearData, fuelData, locationData } from "./specData";

const Product = ({
  man_id,
  model_id,
  photo,
  car_id,
  car_model,
  photo_ver,
  prod_year,
  man_name,
  price_value,
  price_usd,
  views,
  car_run_km,
  engine_volume,
  currency,
  gear_type_id,
  fuel_type_id,
  right_wheel,
  customs_passed,
  location_id,
}: Product.IProps) => {
  const [data, setData] = useState(null);

  const price = currency === "GEL" ? price_value : Math.round(price_usd);
  useEffect(() => {
    fetch(`https://api2.myauto.ge/ka/getManModels?man_id=${man_id}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res.data.find((item: any) => item.model_id === model_id));
      });
  }, [man_id, model_id]);
  useEffect(() => {
    setTimeout(() => {
      document
        .querySelector(`div[data-car_id="${car_id}"]`)
        ?.classList.remove("loading");
    }, 2000);
  });

  function getName() {
    return (
      <p className="product-title">
        {`${man_name} ${data?.["model_name"]} ${car_model} `}
        <span className="year-span">{prod_year} წ</span>
      </p>
    );
  }
  function newPrice(price: string): string {
    let new_price: string = "";
    let i: number = 3;
    while (i < price.length) {
      new_price =
        "," + price.slice(price.length - i, price.length - i + 3) + new_price;
      i += 3;
    }
    return price.slice(0, price.length - (i - 3)) + new_price;
  }
  return (
    <div className={`product-wrapper`} data-car_id={car_id}>
      <div
        className="product-photo"
        style={{
          backgroundImage: `url(https://static.my.ge/myauto/photos/${photo}/thumbs/${car_id}_1.jpg?v=${photo_ver})`,
        }}
      ></div>
      {(data && getName()) ?? car_id}
      <p className="customs-location-info">
        <span
          style={{
            color: `${customs_passed ? "#02cc59" : "#fa6a30"}`,
            display: "flex",
            alignItems: "center",
            gap: "0.25em",
          }}
        >
          {customs_passed ? (
            <img src={greenCheckImg} alt="green checkmark" />
          ) : (
            ""
          )}
          {customs_passed ? "განბაჟებული" : "გაუნბაჟებელი"}{" "}
        </span>
        <span
          style={{
            display: "inline-block",
            width: "70px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {locationData[location_id]}
        </span>
      </p>
      <p
        className="product-price"
        style={price === 0 ? { fontSize: "0.85rem", color: "#fa6a30" } : {}}
      >
        {price !== 0
          ? String(price_value).length > 3
            ? newPrice(String(price))
            : price
          : "ფასი შეთანხმებით"}{" "}
        {price !== 0 ? (currency === "GEL" ? "₾" : "$") : ""}
      </p>

      <div className="product-specs">
        <p>
          <img src={engineImg} alt="engine icon" />{" "}
          {(engine_volume / 1000).toFixed(1)} {fuelData[fuel_type_id]}
        </p>
        <p className="product-mileage">
          {" "}
          <img src={distImg} alt="mileage icon" /> {car_run_km} კმ
        </p>
        <p className="product-gear-type">
          <img src={gearboxImg} alt="gearbox icon" />
          {gearData[gear_type_id]}
        </p>
        <p className="product-wheel">
          <img src={wheelImg} alt="wheel icon" />{" "}
          {right_wheel ? "მარჯვენა" : "მარცხენა"}
        </p>
      </div>
      <div className="product-info">
        <p className="product-views">{views} ნახვა</p>
      </div>
    </div>
  );
};

export default Product;
