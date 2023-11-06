const PageController = ({
  current,
  last,
  setPageData,
}: PageController.IProps) => {
  const updatePage = (e: any) => {
    const newPage: number = Number(e.target.value);
    setPageData((prevPageData: Global.pageParam) => ({
      current: newPage,
      last: prevPageData.last,
    }));
    window.scrollTo(0, 0);
  };

  const jump = (dir: number) => {
    setPageData((prevPageData: Global.pageParam) => ({
      current: dir ? Number(prevPageData.last) : 1,
      last: prevPageData.last,
    }));
    window.scrollTo(0, 0);
  };

  const offset = current > 3 ? 3 : current > 2 ? 2 : current > 1 ? 1 : 0;

  const nums = new Array(7)
    .fill(null)
    .map((_: null, i: number) => (
      <button
        key={i - offset}
        onClick={updatePage}
        value={i + current - offset}
        className={`page-btn ${
          i + current - offset === current ? "current-page-btn" : ""
        }`}
      >
        {i + Number(current) - offset}
      </button>
    ))
    .filter((item: any) => item.props.value <= (last ?? 7));

  return (
    <div className="page-control">
      <button
        style={{ background: "#fff", border: "none", cursor: "pointer" }}
        onClick={() => jump(0)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13.414"
          height="8.829"
          viewBox="0 0 13.414 8.829"
        >
          <g transform="translate(1 1.414)">
            <path
              d="M12,12,9,9l3-3"
              transform="translate(-1 -6)"
              style={{
                fill: "none",
                stroke: "rgb(253, 65, 0)",
                strokeLinecap: "round",
                strokeWidth: "2px",
                strokeLinejoin: "round",
              }}
            ></path>
            <path
              d="M12,12,9,9l3-3"
              transform="translate(-6 -6)"
              style={{
                fill: "none",
                stroke: "rgb(253, 65, 0)",
                strokeLinecap: "round",
                strokeWidth: "2px",
                strokeLinejoin: "round",
              }}
            ></path>
            <line
              y2="6"
              transform="translate(0)"
              style={{
                fill: "none",
                stroke: "rgb(253, 65, 0)",
                strokeLinecap: "round",
                strokeWidth: "2px",
              }}
            ></line>
          </g>
        </svg>
      </button>
      {nums}
      <button
        onClick={() => jump(1)}
        style={{ background: "#fff", border: "none", cursor: "pointer" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13.414"
          height="8.829"
          viewBox="0 0 13.414 8.829"
        >
          <g transform="translate(-1134.586 -2682.586)">
            <path
              d="M9,12l3-3L9,6"
              transform="translate(1127 2678)"
              style={{
                fill: "none",
                stroke: "rgb(253, 65, 0)",
                strokeLinecap: "round",
                strokeWidth: "2px",
                strokeLinejoin: "round",
              }}
            ></path>
            <path
              d="M9,12l3-3L9,6"
              transform="translate(1132 2678)"
              style={{
                fill: "none",
                stroke: "rgb(253, 65, 0)",
                strokeLinecap: "round",
                strokeWidth: "2px",
                strokeLinejoin: "round",
              }}
            ></path>
            <line
              y2="6"
              transform="translate(1147 2684)"
              style={{
                fill: "none",
                stroke: "rgb(253, 65, 0)",
                strokeLinecap: "round",
                strokeWidth: "2px",
              }}
            ></line>
          </g>
        </svg>
      </button>
    </div>
  );
};

export default PageController;
