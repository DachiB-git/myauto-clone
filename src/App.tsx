import { useEffect, useState } from "react";
import Product from "./components/Product/Product";
import selectArrow from "./svgs/arrow.svg";
import crossIcon from "./svgs/cross.svg";
import logo from "./svgs/logo.svg";
import Form from "./components/Form/Form";
import "./App.css";

function App() {
  const url = "https://api2.myauto.ge/ka/products";

  const [data, setData] = useState<any>([]);
  const [period, setPeriod] = useState();
  const [sortOrder, setSortOrder] = useState<string>("0");
  const [query, setQuery] = useState<string>("");
  const [manData, setManData] = useState([]);
  const [catData, setCatData] = useState([]);
  const [filters, setFilters] = useState<string[]>([]);
  const [currency, setCurrency] = useState<string>("GEL");
  const [pageData, setPageData] = useState<Global.pageParam>({
    current: 1,
    last: null,
  });
  console.log(query);
  useEffect(() => {
    fetch("https://static.my.ge/myauto/js/mans.json")
      .then((res) => res.json())
      .then((res) => setManData(res));
    fetch("https://api2.myauto.ge/ka/cats/get")
      .then((res) => res.json())
      .then((res) => setCatData(res.data));
  }, []);
  useEffect(() => {
    fetch(
      `${url}?${query}&Period=${period}&SortOrder=${sortOrder}&Page=${pageData?.current}`
    )
      .then((res) => res.json())
      .then((res) => {
        setData([res.data.items, res.data.meta]);
        setPageData((prevPageData) => ({
          current: prevPageData.current,
          last: Number(res.data.meta.last_page),
        }));
      });
    Array.from(document.querySelectorAll(`.product-wrapper`)).map((item: any) =>
      item.classList.add("loading")
    );
  }, [pageData?.current, period, sortOrder, query]);
  useEffect(() => {
    setTimeout(() => {
      document.body.style.height = "auto";
      document.body.style.overflow = "inherit";
      document
        .querySelector(".loading-screen")
        ?.classList.remove("active-loading-screen");
    }, 3000);
  }, []);

  function containerReset() {
    Array.from(document.querySelectorAll(".checkbox-container")).map(
      (item: any) => {
        item.style.display = "";
        item.parentNode.children[0].children[1].classList.remove(
          "active-select"
        );
        return item;
      }
    );
    Array.from(document.querySelectorAll(".option-container")).map(
      (item: any) => {
        item.style.display = "";
        item.parentNode.children[0].children[1].classList.remove(
          "active-select"
        );
        return item;
      }
    );
  }
  function handleOptions(e: any) {
    if (e.target.className.includes("select-span")) {
      const container = e.target.parentNode.children[1];
      if (container.style.display === "flex") {
        containerReset();
        container.style.display = "";
      } else {
        containerReset();
        container.style.display = "flex";
        container.parentNode.children[0].children[1].classList.add(
          "active-select"
        );
      }
    } else if (e.target.tagName === "BUTTON") {
      switch (e.target.parentNode.parentNode.id) {
        case "period":
          setPeriod(e.target.value);
          break;
        case "sort-order":
          setSortOrder(e.target.value);
          break;
      }
      containerReset();
      e.target.parentNode.parentNode.children[0].children[0].textContent =
        e.target.textContent;
    }
  }

  function removeFilter(e: any) {
    setFilters((prevFilters: any) =>
      prevFilters.filter(
        (filter: string) =>
          !filter.includes(e.target.parentNode.children[0].textContent)
      )
    );
    const input: any = Array.from(document.querySelectorAll("label")).find(
      (item: any) =>
        item.textContent === e.target.parentNode.children[0].textContent
    )?.children[0];
    setQuery((prevQuery) =>
      prevQuery
        .split("&")
        .map((item: string) => {
          if (input.id.includes("deal")) {
            if (item.includes("ForRent")) {
              return item.replace(input.value, "");
            }
          } else if (input.id.includes("man")) {
            if (item.includes("Mans")) {
              return item.replace(
                new RegExp(
                  `-${input.value}.*|${input.value}.*-|${input.value}.*`
                ),
                ""
              );
            }
          } else if (input.id.includes("cat")) {
            if (item.includes("Cats")) {
              return item.replace(
                new RegExp(
                  `\\.${input.value}|${input.value}\\.|${input.value}`
                ),
                ""
              );
            }
          } else if (input.id.includes("model")) {
            if (item.includes("Mans")) {
              return item.replace(
                new RegExp(
                  `\\.${input.value}|${input.value}\\.|${input.value}`
                ),
                ""
              );
            }
          }
          return item;
        })
        .join("&")
    );
  }

  function updatePage(e: any) {
    const newPage: number = Number(e.target.value);
    setPageData((prevPageData: Global.pageParam) => ({
      current: newPage,
      last: prevPageData.last,
    }));
    window.scrollTo(0, 0);
  }

  function jump(dir: number) {
    setPageData((prevPageData: Global.pageParam) => ({
      current: dir ? Number(prevPageData.last) : 1,
      last: prevPageData.last,
    }));
    window.scrollTo(0, 0);
  }
  function makePageUI() {
    const offset =
      pageData.current > 3
        ? 3
        : pageData.current > 2
        ? 2
        : pageData.current > 1
        ? 1
        : 0;
    const nums = new Array(7)
      .fill(null)
      .map((_: null, i: number) => (
        <button
          key={i - offset}
          onClick={updatePage}
          value={i + pageData?.current - offset}
          className={`page-btn ${
            i + pageData?.current - offset === pageData.current
              ? "current-page-btn"
              : ""
          }`}
        >
          {i + Number(pageData?.current) - offset}
        </button>
      ))
      .filter((item: any) => item.props.value <= (pageData?.last ?? 7));
    return (
      <>
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
      </>
    );
  }

  return (
    <div
      className="App"
      onClick={(e: any) => {
        const activeContainer: any = Array.from(
          document.querySelectorAll(".checkbox-container")
        )?.find((item: any) => item.style.display === "flex");
        if (
          activeContainer &&
          !activeContainer.contains(e.target) &&
          !e.target.classList.contains("select-span")
        ) {
          containerReset();
        }
      }}
    >
      <div className="loading-screen active-loading-screen">
        <div className="load-img"></div>
      </div>

      <header>
        <a href="#">
          <img src={logo} alt="Myauto Logo" />
        </a>
      </header>
      <main>
        <Form
          setQuery={setQuery}
          catData={catData}
          manData={manData}
          containerReset={containerReset}
          setCurrency={setCurrency}
          setFilters={setFilters}
          currency={currency}
          setPageData={setPageData}
        />
        <div className="product-list-container">
          <div className="product-container-top">
            <div
              className={`filter-container ${
                filters.length !== 0 ? "visible" : ""
              }`}
            >
              <button
                className="filter-btn-mobile"
                onClick={() => {
                  const searchForm = document.getElementById("search-form");
                  searchForm!.classList.toggle("active-form");
                }}
              >
                <svg
                  className="type-icon"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 4H7.5"
                    stroke="#272A37"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  ></path>
                  <circle
                    cx="10"
                    cy="4"
                    r="2.3"
                    stroke="#272A37"
                    strokeWidth="1.4"
                  ></circle>
                  <path
                    d="M12 10L6.5 10"
                    stroke="#272A37"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  ></path>
                  <circle
                    cx="4"
                    cy="10"
                    r="2.3"
                    transform="rotate(-180 4 10)"
                    stroke="#272A37"
                    strokeWidth="1.4"
                  ></circle>
                </svg>
                ფილტრი
              </button>
              {filters.length !== 0 &&
                filters.map((filter: string, i: number) => (
                  <div key={i} className="filter-wrapper">
                    <p>{filter.split("-")[0]}</p>
                    <img
                      src={crossIcon}
                      onClick={removeFilter}
                      alt="remove icon"
                    ></img>
                  </div>
                ))}
            </div>
            <p className="total">{data[1]?.total} განცხადება</p>
            <div className="extra-param-control" onClick={handleOptions}>
              <div id="period" className="param-type-container">
                <span className="select-span">
                  <p>პერიოდი</p>
                  <img
                    src={selectArrow}
                    className="select-arrow"
                    alt="select arrow"
                  />
                </span>
                <div className="checkbox-container">
                  <button value="">პერიოდი</button>
                  <button value="1h">ბოლო 1 საათი</button>
                  <button value="2h">ბოლო 2 საათი</button>
                  <button value="3h">ბოლო 3 საათი</button>
                  <button value="1d">ბოლო 1 დღე</button>
                  <button value="2d">ბოლო 2 დღე</button>
                  <button value="3d">ბოლო 3 დღე</button>
                  <button value="1w">ბოლო 1 კვირა</button>
                  <button value="2w">ბოლო 2 კვირა</button>
                  <button value="3w">ბოლო 3 კვირა</button>
                </div>
              </div>
              <div id="sort-order" className="param-type-container">
                <span className="select-span">
                  <p>თარიღი კლებადი</p>
                  <img
                    src={selectArrow}
                    className="select-arrow"
                    alt="select arrow"
                  />
                </span>
                <div className="checkbox-container">
                  <button value="1">თარიღი კლებადი</button>
                  <button value="2">თარიღი ზრდადი</button>
                  <button value="3">ფასი კლებადი</button>
                  <button value="4">ფასი ზრდადი</button>
                  <button value="5">გარბენი კლებადი</button>
                  <button value="6">გარბენი ზრდადი</button>
                </div>
              </div>
            </div>
          </div>
          {data[0]?.map((car: any, i: number) => (
            <Product
              key={i}
              {...car}
              man_name={
                manData.find((item: any) => item.man_id === car.man_id + "")?.[
                  "man_name"
                ]
              }
              currency={currency}
            />
          ))}

          <div className="page-control">{makePageUI()}</div>
        </div>
      </main>
    </div>
  );
}

export default App;
