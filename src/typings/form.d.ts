namespace Form {
  export interface IProps {
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    catData: any;
    manData: any;
    containerReset: () => void;
    setFilters: React.Dispatch<React.SetStateAction<string[]>>;
    setCurrency: React.Dispatch<React.SetStateAction<string>>;
    currency: string;
    setPageData: React.Dispatch<React.SetStateAction<Global.pageParam>>;
  }

  export interface Data {
    VehicleType: number;
    ForRent: string;
    Mans: string[] | any;
    Cats: string[] | any;
    PriceFrom: string;
    PriceTo: string;
  }
}
