namespace PageController {
  export interface IProps {
    current: number;
    last: number | null;
    setPageData: React.Dispatch<React.SetStateAction<Global.pageParam>>;
  }
}
