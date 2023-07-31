import engineImg from "../svgs/engine.svg";
import gearboxImg from "../svgs/gearbox.svg";
import distImg from "../svgs/dist.svg";
import wheelImg from "../svgs/wheel.svg";
import greenCheckImg from "../svgs/green_check.svg";
import { useEffect, useState } from "react";

interface Prop {
  man_id: string;
  model_id: string;
  photo: string;
  car_id: string;
  car_model: string;
  photo_ver: string;
  prod_year: string;
  man_name: string;
  price_value: number;
  price_usd: number;
  views: string;
  category_name: string;
  car_run_km: string;
  engine_volume: number;
  currency: string;
  gear_type_id: number;
  fuel_type_id: number;
  right_wheel: boolean;
  customs_passed: boolean;
  location_id: number;
}
interface specData {
  [key: number]: string;
}
function Product(props: Prop) {
  const {
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
  } = props;
  const [data, setData] = useState(null);
  const gearData: specData = {
    1: "მექანიკა",
    2: "ავტომატიკა",
    3: "ტიპტრონიკი",
    4: "ვარიატორი",
  };
  const fuelData: specData = {
    2: "ბენზინი",
    3: "დიზელი",
    7: "ელექტრო",
    6: "ჰიბრიდი",
    10: "დატენვადი ჰიბრიდი",
    9: "თხევადი გაზი",
    8: "ბუნებრივი გაზი",
    12: "წყალბადი",
  };
  const locationData: specData = {
    23: "გზაში საქ.-სკენ",
    2: "თბილისი",
    3: "ქუთაისი",
    4: "ბათუმი",
    7: "ფოთი",
    15: "რუსთავი",
    30: "რუსთავის ავტობაზრობა",
    113: "კავკასიის ავტომარკეტი",
    52: "ჩხოროწყუ",
    37: "ახმეტა",
    36: "ზესტაფონი",
    38: "ბორჯომი",
    39: "კასპი",
    40: "საგარეჯო",
    31: "ახალციხე",
    5: "სოხუმი",
    41: "ქობულეთი",
    44: "გურჯაანი",
    47: "მარტვილი",
    48: "ჭიათურა",
    53: "დუშეთი",
    54: "ლაგოდეხი",
    8: "თელავი",
    16: "მცხეთა",
    6: "ცხინვალი",
    14: "ახალქალაქი",
    13: "გორი",
    12: "ხაშური",
    11: "ამბროლაური",
    10: "ოზურგეთი",
    9: "ზუგდიდი",
    55: "სენაკი",
    56: "სიღნაღი",
    57: "ქარელი",
    59: "მარნეული",
    58: "გარდაბანი",
    61: "სამტრედია",
    62: "მესტია",
    63: "საჩხერე",
    64: "ხობი",
    66: "თიანეთი",
    82: "თიანეთი",
    71: 'ფოთის "გეზ"-ი',
    72: 'ბათუმის "გეზ"-ი',
    74: "ყვარელი",
    75: "ტყიბული",
    76: "დედოფლისწყარო",
    77: "ონი",
    78: "ბოლნისი",
    80: "წყალტუბო",
    81: "თეთრიწყარო",
    83: "ხარაგაული",
    84: "წალკა",
    85: "წალენჯიხა",
    86: "წეროვანი",
    87: "ლანჩხუთი",
    88: "სართიჭალა",
    91: "ხონი",
    96: "ნინოწმინდა",
    97: "ასპინძა",
    101: "აბაშა",
    109: "ცაგერი",
    21: "აშშ",
    19: "გერმანია",
    22: "იაპონია",
    33: "ევროპა",
    45: "საფრანგეთი",
    46: "ესპანეთი",
    60: "სამხ. კორეა",
    28: "რუსეთი",
    43: "ირლანდია",
    20: "ჰოლანდია",
    42: "იტალია",
    35: "დუბაი",
    32: "ინგლისი",
    24: "სხვა",
    65: "უკრაინა",
    69: "ჩინეთი",
    70: "კანადა",
    79: "თურქეთი",
    93: "პოლონეთი",
  };
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
}

export default Product;
