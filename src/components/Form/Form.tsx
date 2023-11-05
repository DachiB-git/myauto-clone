import { useEffect, useState } from "react";
import selectArrow from "../../svgs/arrow.svg";

const Form = ({
  setQuery,
  catData,
  manData,
  containerReset,
  setFilters,
  setCurrency,
  currency,
  setPageData,
}: Form.IProps) => {
  const [formData, setFormData] = useState<Form.Data>({
    VehicleType: 0,
    ForRent: "",
    Mans: [],
    Cats: [],
    PriceFrom: "",
    PriceTo: "",
  });
  const [modelData, setModelData] = useState<any>({});
  const filteredCatData = catData.filter(
    (cat: any) => formData.VehicleType === cat.category_type
  );
  const filteredManData = manData
    .filter((man: any) => {
      switch (formData.VehicleType) {
        case 0:
          return man.is_car === "1";
        case 1:
          return man.is_spec === "1";
        case 2:
          return man.is_moto === "1";
        default:
          return "";
      }
    })
    .sort((a: any, b: any) => a.man_name.localeCompare(b.man_name));
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    (e.target as Element).classList.toggle("active-form");
    const params: any = Object.entries(formData);
    function handleParam(param: string, i: number) {
      switch (param) {
        case "VehicleType":
        case "PriceFrom":
        case "PriceTo":
        case "ForRent":
          return params[i][1];
        case "Mans":
          return params[i][1]
            .map(
              (man: any) =>
                `${man[0]}${man[1].length ? `.${man[1].join(".")}` : ""}`
            )
            .join("-");
        case "Cats":
          return (
            params[i][1].join(".") ||
            filteredCatData.map((cat: any) => cat.category_id).join(".")
          );
      }
    }

    let query_arr = [];
    for (let i = 0; i < params.length; i++) {
      query_arr.push(`${params[i][0]}=${handleParam(params[i][0], i)}`);
    }
    setQuery(query_arr.join("&"));
    setFilters(() => {
      let new_filters: any = [];
      new_filters.push(
        document.querySelector(`label[for=deal-${formData.ForRent}]`)
          ?.textContent ?? "",
        ...(formData?.Mans.map(
          (item: any) =>
            document.querySelector(`label[for=man-${item[0]}]`)?.textContent
        ) ?? ""),
        ...(formData?.Mans.map((item: any) =>
          item[1].map(
            (model: string) =>
              `${
                document.querySelector(`label[for=model-${model}]`)?.textContent
              }-${
                document.querySelector(`label[for=man-${item[0]}]`)?.textContent
              }`
          )
        ).flat() ?? ""),
        ...(formData?.Cats.map(
          (item: any) =>
            `${document.querySelector(`label[for=cat-${item}]`)?.textContent}`
        ) ?? "")
      );
      new_filters = new_filters.filter((item: string) => item !== "");
      return new_filters.length !== 0 ? new_filters : [];
    });
    setPageData({ current: 1, last: null });
  }

  function handleFormChange(e: any) {
    switch (e.currentTarget.id) {
      case "deal":
        setFormData((prevFormData) => ({
          ...prevFormData,
          ForRent:
            prevFormData.ForRent === e.target.value ? "" : e.target.value,
        }));
        break;
      case "manufacturer":
        setFormData((prevFormData: Form.Data) => ({
          ...prevFormData,
          Mans: prevFormData.Mans?.find(
            (item: any) => item[0] === e.target.value
          )
            ? prevFormData.Mans.filter(
                (item: any) => item[0] !== e.target.value
              )
            : [...(prevFormData.Mans ?? []), [e.target.value, []]],
        }));
        break;
      case "category":
        setFormData((prevFormData: Form.Data) => ({
          ...prevFormData,
          Cats: prevFormData.Cats?.includes(e.target.value)
            ? prevFormData.Cats.filter(
                (item: string) => item !== e.target.value
              )
            : [...(prevFormData.Cats ?? []), e.target.value],
        }));
        break;
      case "price":
        setFormData((prevFormData: Form.Data) => ({
          ...prevFormData,
          [`${e.target.id}`]: e.target.value,
        }));
        break;
      case "vehicle-type":
        setFormData((prevFormData: Form.Data) => ({
          ...prevFormData,
          VehicleType: Number(e.target.value),
        }));
        break;
      case "model":
        setFormData((prevFormData: any) => ({
          ...prevFormData,
          Mans: prevFormData.Mans.map((man: any) => {
            const target = e.target as any;
            if (man[0] === target.parentNode.parentNode.dataset.man_id) {
              if (man[1].includes(e.target.value)) {
                return [
                  man[0],
                  man[1].filter((item: any) => item !== e.target.value),
                ];
              } else {
                return [man[0], [...man[1], e.target.value]];
              }
            } else {
              return man;
            }
          }),
        }));
        break;
    }
  }
  function toggleCheckboxes(e: any) {
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
    } else if (e.target.className.includes("type-btn")) {
      e.target.classList.add("active-type-btn");
      setFormData((prevFormData) => ({
        VehicleType: prevFormData.VehicleType,
        ForRent: prevFormData.ForRent,
        Mans: [],
        Cats: [],
        PriceFrom: "",
        PriceTo: "",
      }));
      Array.from(e.target.parentNode.children).map((item: any) =>
        e.target !== item ? item.classList.remove("active-type-btn") : item
      );
      Array.from(document.querySelectorAll("input[type=checkbox]")).map(
        (item: any) =>
          item.id.includes("cat") || item.id.includes("man")
            ? (item.checked = false)
            : item
      );
      setModelData([]);
      setFilters((prevFilter: any) =>
        prevFilter.filter(
          (item: string) => item === "იყიდება" || item === "ქირავდება"
        )
      );
    }
  }
  useEffect(() => {
    formData.Mans.forEach((man: any) => {
      fetch(`https://api2.myauto.ge/ka/getManModels?man_id=${man[0]}`)
        .then((res) => res.json())
        .then((data) =>
          setModelData((prevModelData: any) => ({
            ...prevModelData,
            [man[0]]: data.data,
          }))
        );
    });
    setModelData((prevModaelData: any) =>
      Object.fromEntries(
        Object.entries(prevModaelData).filter((item: any) =>
          formData.Mans.find((_: any) => _[0] === item[0])
        )
      )
    );
  }, [formData.Mans.length]);
  return (
    <form
      className="search-form"
      id="search-form"
      onSubmit={handleSubmit}
      onClick={toggleCheckboxes}
    >
      <div
        className="vehicle-type-switcher"
        id="vehicle-type"
        onClick={handleFormChange}
      >
        <button className="type-btn active-type-btn" value={0} type="button">
          <svg
            className="type-icon"
            width="30"
            height="15"
            viewBox="0 0 30 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.719 10.973C19.7021 10.3542 19.8701 9.74436 20.2016 9.22153C20.5332 8.69871 21.0131 8.28664 21.58 8.03801C22.147 7.78939 22.7752 7.7155 23.3843 7.82581C23.9935 7.93611 24.5559 8.22559 24.9997 8.65724C25.4434 9.08888 25.7484 9.64307 25.8755 10.2489C26.0026 10.8548 25.9462 11.4848 25.7133 12.0585C25.4805 12.6321 25.0819 13.1232 24.5684 13.4691C24.055 13.8149 23.4501 13.9998 22.831 14C22.4278 14.006 22.0274 13.9323 21.6527 13.7834C21.278 13.6344 20.9363 13.413 20.6473 13.1319C20.3582 12.8507 20.1275 12.5153 19.9682 12.1449C19.8089 11.7744 19.7242 11.3762 19.719 10.973ZM21.89 10.973C21.8846 11.1599 21.9351 11.3442 22.0351 11.5023C22.135 11.6604 22.2798 11.785 22.4509 11.8604C22.6221 11.9357 22.8118 11.9583 22.9959 11.9252C23.18 11.8921 23.35 11.8049 23.4842 11.6746C23.6184 11.5444 23.7107 11.3771 23.7493 11.1942C23.788 11.0112 23.7711 10.8209 23.701 10.6475C23.6309 10.4741 23.5106 10.3256 23.3557 10.221C23.2007 10.1163 23.018 10.0603 22.831 10.06C22.5855 10.0571 22.3487 10.1515 22.1726 10.3225C21.9965 10.4936 21.8952 10.7275 21.891 10.973H21.89ZM4.262 10.973C4.26774 10.57 4.35282 10.1721 4.51239 9.802C4.67195 9.4319 4.90288 9.09687 5.19197 8.81604C5.48106 8.53522 5.82265 8.3141 6.19722 8.16533C6.5718 8.01656 6.97201 7.94306 7.375 7.94901C7.78033 7.93624 8.18409 8.00505 8.56231 8.15136C8.94054 8.29766 9.28551 8.51847 9.57674 8.80067C9.86797 9.08287 10.0995 9.42072 10.2577 9.79415C10.4158 10.1676 10.4973 10.569 10.4973 10.9745C10.4973 11.38 10.4158 11.7814 10.2577 12.1549C10.0995 12.5283 9.86797 12.8661 9.57674 13.1483C9.28551 13.4306 8.94054 13.6514 8.56231 13.7977C8.18409 13.944 7.78033 14.0128 7.375 14C6.97188 14.0057 6.57159 13.9319 6.197 13.7828C5.82241 13.6338 5.48086 13.4124 5.19186 13.1313C4.90286 12.8502 4.67208 12.5149 4.5127 12.1445C4.35333 11.7742 4.26848 11.3761 4.263 10.973H4.262ZM6.434 10.973C6.42883 11.1597 6.47943 11.3436 6.57932 11.5014C6.67922 11.6591 6.82388 11.7835 6.99482 11.8586C7.16576 11.9338 7.35522 11.9562 7.53899 11.9232C7.72276 11.8901 7.8925 11.803 8.02651 11.6729C8.16052 11.5429 8.25273 11.3759 8.29134 11.1932C8.32996 11.0105 8.31323 10.8205 8.24329 10.6473C8.17336 10.4742 8.0534 10.3258 7.89873 10.2212C7.74407 10.1166 7.56172 10.0605 7.375 10.06C7.12954 10.0573 6.89297 10.1518 6.71689 10.3228C6.5408 10.4939 6.43947 10.7276 6.435 10.973H6.434ZM26.761 11.349C26.7806 11.2278 26.7937 11.1056 26.8 10.983C26.7678 9.98498 26.3487 9.0386 25.6313 8.34399C24.914 7.64939 23.9545 7.26102 22.956 7.26102C21.9575 7.26102 20.998 7.64939 20.2807 8.34399C19.5633 9.0386 19.1442 9.98498 19.112 10.983C19.1182 11.1056 19.1312 11.2278 19.151 11.349H11.051C11.0703 11.2278 11.083 11.1056 11.089 10.983C11.0809 10.4861 10.975 9.99558 10.7774 9.53957C10.5797 9.08356 10.2941 8.67096 9.937 8.32533C9.57985 7.97969 9.15811 7.7078 8.69587 7.52519C8.23363 7.34257 7.73994 7.2528 7.243 7.26101C6.24014 7.2455 5.27213 7.62866 4.55158 8.32634C3.83102 9.02402 3.41684 9.97917 3.4 10.982C3.40636 11.1046 3.41904 11.2267 3.438 11.348H0.509C0.443171 11.3492 0.377754 11.3374 0.316505 11.3132C0.255257 11.2891 0.199382 11.2531 0.152089 11.2072C0.104795 11.1614 0.0670144 11.1067 0.0409149 11.0463C0.0148153 10.9858 0.000910982 10.9208 0 10.855L0 8.94201C0.00184142 8.83768 0.0449894 8.73835 0.119978 8.6658C0.194967 8.59325 0.295672 8.5534 0.4 8.55501V7.11101C0.403745 6.78367 0.517389 6.46709 0.722682 6.21211C0.927976 5.95712 1.21301 5.77853 1.532 5.70501L6.716 4.45301L10.568 1.45301C11.7883 0.508844 13.2881 -0.00235085 14.831 8.73995e-06H21.738C22.176 -0.0013529 22.5996 0.15643 22.93 0.444009L26.33 3.40901L27.423 3.35101C27.7962 3.3263 28.1649 3.4434 28.4554 3.67887C28.746 3.91434 28.9369 4.25082 28.99 4.62101L29.49 8.55801C29.5559 8.55668 29.6214 8.56841 29.6828 8.5925C29.7442 8.6166 29.8002 8.65259 29.8476 8.69841C29.895 8.74423 29.9328 8.79897 29.959 8.85949C29.9852 8.92 29.9991 8.98509 30 9.05101V10.851C29.9992 10.917 29.9854 10.9822 29.9593 11.0428C29.9332 11.1035 29.8953 11.1583 29.8479 11.2043C29.8005 11.2502 29.7445 11.2863 29.683 11.3104C29.6216 11.3346 29.556 11.3463 29.49 11.345L26.761 11.349ZM11.448 2.75501L9.6 4.19101L19.237 3.71901V1.54901H14.984C13.704 1.54637 12.4596 1.97076 11.448 2.75501ZM20.842 3.63801L24.024 3.48201L22.057 1.76901C21.8942 1.62689 21.6851 1.54902 21.469 1.55001H20.843L20.842 3.63801Z"
              fill="#8C929B"
            />
          </svg>
        </button>
        <button className="type-btn" value={1} type="button">
          <svg
            className="type-icon"
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.735 14.2707C7.69898 13.2695 7.27574 12.3213 6.55438 11.6257C5.83302 10.9301 4.86981 10.5414 3.8675 10.5414C2.86519 10.5414 1.90198 10.9301 1.18062 11.6257C0.459259 12.3213 0.0360222 13.2695 0 14.2707C0.0360222 15.2719 0.459259 16.2201 1.18062 16.9157C1.90198 17.6113 2.86519 18 3.8675 18C4.86981 18 5.83302 17.6113 6.55438 16.9157C7.27574 16.2201 7.69898 15.2719 7.735 14.2707ZM4.513 14.2707C4.51779 14.3992 4.48404 14.5262 4.41609 14.6353C4.34814 14.7445 4.2491 14.8308 4.13169 14.8833C4.01427 14.9358 3.88384 14.9519 3.75716 14.9298C3.63047 14.9076 3.51331 14.848 3.42073 14.7588C3.32815 14.6696 3.26437 14.5547 3.23759 14.429C3.2108 14.3032 3.22224 14.1724 3.27043 14.0532C3.31862 13.934 3.40136 13.8319 3.50801 13.7601C3.61467 13.6882 3.74039 13.6499 3.869 13.65C4.03655 13.6473 4.19832 13.7112 4.31885 13.8275C4.43939 13.9439 4.50884 14.1033 4.512 14.2707H4.513ZM22 13.0303C21.9742 11.6885 21.4166 10.4119 20.4496 9.48091C19.4826 8.54994 18.1854 8.04083 16.843 8.06545C15.5011 8.0411 14.2044 8.55022 13.2378 9.48097C12.2712 10.4117 11.7138 11.688 11.688 13.0293C11.7135 14.3706 12.2708 15.6469 13.2375 16.5775C14.2042 17.5082 15.5011 18.017 16.843 17.9921C18.1849 18.017 19.4819 17.5084 20.4488 16.578C21.4158 15.6476 21.9737 14.3716 22 13.0303V13.0303ZM18.778 13.0303C18.7685 13.5338 18.5594 14.013 18.1965 14.3624C17.8336 14.7118 17.3468 14.9028 16.843 14.8934C16.3394 14.9025 15.8528 14.7114 15.4901 14.362C15.1275 14.0126 14.9185 13.5336 14.909 13.0303C14.919 12.5273 15.1282 12.0487 15.4908 11.6998C15.8534 11.3509 16.3397 11.16 16.843 11.1691C17.3464 11.1597 17.833 11.3505 18.1958 11.6994C18.5586 12.0484 18.768 12.5271 18.778 13.0303ZM10.4 14.8934V13.0303H8.863C8.9697 13.4352 9.02415 13.852 9.025 14.2707C9.0256 14.4783 9.01224 14.6857 8.985 14.8914L10.4 14.8934ZM17.489 13.0303C17.4938 12.9019 17.4601 12.775 17.3922 12.6659C17.3244 12.5568 17.2254 12.4704 17.1081 12.4179C16.9908 12.3654 16.8605 12.3491 16.7339 12.3711C16.6073 12.3931 16.4901 12.4525 16.3974 12.5415C16.3048 12.6305 16.2409 12.7452 16.2138 12.8708C16.1868 12.9964 16.198 13.1272 16.2459 13.2464C16.2937 13.3657 16.3762 13.4679 16.4826 13.54C16.589 13.612 16.7145 13.6507 16.843 13.651C17.0109 13.6539 17.1732 13.5903 17.2942 13.474C17.4153 13.3576 17.4853 13.1981 17.489 13.0303ZM10.529 11.7898C10.8563 10.3662 11.6612 9.09746 12.8099 8.19443C13.9585 7.29141 15.3817 6.80851 16.843 6.826C18.3304 6.82407 19.775 7.32382 20.943 8.24437L21.764 7.28679C20.4674 6.26889 18.8869 5.67797 17.2403 5.59544C15.5937 5.51291 13.962 5.94284 12.57 6.826H3.864C3.19403 6.81528 2.54707 7.07013 2.06455 7.53483C1.58202 7.99954 1.30319 8.6363 1.289 9.30591V9.97361C2.07704 9.53427 2.96467 9.30437 3.867 9.30591C4.7621 9.30064 5.64341 9.52642 6.42563 9.9614C7.20785 10.3964 7.86449 11.0258 8.332 11.7888L10.529 11.7898ZM6.446 5.58454V3.72336C6.43602 3.22034 6.22676 2.74184 5.86416 2.3929C5.50156 2.04395 5.01525 1.85308 4.512 1.86218V3.09864C4.67981 3.09569 4.84195 3.15938 4.96286 3.27574C5.08377 3.3921 5.15358 3.55163 5.157 3.71936V5.58454H6.446ZM12.2 5.58454C14.1898 4.44004 16.5323 4.07054 18.778 4.547L18.778 1.24045H20.066V0H9.752V1.24045H10.874L9.69 5.58454H12.2Z"
              fill="#8C929B"
            />
          </svg>
        </button>
        <button className="type-btn" value={2} type="button">
          <svg
            className="type-icon"
            width="23"
            height="17"
            viewBox="0 0 23 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.448 12.665C6.44598 11.8924 6.17796 11.1441 5.689 10.546L6.56 9.47498C7.09609 10.0582 7.47287 10.7698 7.65401 11.541C7.73565 11.9098 7.77722 12.2863 7.778 12.664C7.77533 12.8376 7.84162 13.0052 7.96234 13.1301C8.08306 13.2549 8.24837 13.3268 8.422 13.33L14.502 13.33C14.7535 14.0982 15.239 14.7686 15.8904 15.2471C16.5419 15.7257 17.3267 15.9886 18.135 15.999C19.1776 15.9795 20.1701 15.5476 20.8949 14.7979C21.6197 14.0481 22.0178 13.0417 22.002 11.999C22.0181 10.9562 21.62 9.9496 20.8952 9.1998C20.1703 8.45 19.1777 8.01818 18.135 7.99898C17.0919 8.01766 16.0988 8.44925 15.3735 9.19911C14.6483 9.94896 14.2499 10.9559 14.266 11.999H12.935C12.936 10.948 13.2417 9.91983 13.815 9.03898C13.5376 8.43408 13.1165 7.90618 12.5884 7.50129C12.0603 7.0964 11.4412 6.8268 10.785 6.71598C10.6959 6.70107 10.6108 6.66765 10.5354 6.61788C10.46 6.5681 10.3958 6.50307 10.347 6.42698L8.87801 4.15098C8.55697 3.64693 8.102 3.24216 7.564 2.98198C7.564 2.98698 7.555 2.98898 7.549 2.99498C7.21771 2.82741 6.85902 2.72072 6.49 2.67998V1.39098C6.67489 1.35961 6.86162 1.34024 7.049 1.33298H7.778C7.9503 1.3263 8.11332 1.25316 8.23287 1.1289C8.35241 1.00464 8.41918 0.838908 8.41918 0.666479C8.41918 0.49405 8.35241 0.328321 8.23287 0.204059C8.11332 0.0797958 7.9503 0.00665379 7.778 -2.09808e-05L7.049 -2.09808e-05C5.51042 0.0408154 4.04941 0.684205 2.98052 1.79162C1.91163 2.89904 1.32036 4.38192 1.33401 5.92098C1.31783 6.48616 1.52599 7.03478 1.913 7.44698C2.08272 7.62247 2.28617 7.76183 2.51112 7.85669C2.73607 7.95155 2.97787 7.99995 3.222 7.99898C3.58794 7.9995 3.95275 8.03973 4.31001 8.11898C4.75067 8.22446 5.17142 8.40039 5.55601 8.63998L4.68501 9.71098C4.23726 9.46653 3.73611 9.33634 3.22601 9.33198C2.35693 9.34776 1.52955 9.70745 0.925217 10.3322C0.320883 10.957 -0.0111084 11.7959 0.00200462 12.665C-0.0132446 13.0978 0.0588322 13.5292 0.213936 13.9336C0.36904 14.3379 0.603994 14.7069 0.904783 15.0184C1.20557 15.33 1.56603 15.5778 1.96466 15.7471C2.3633 15.9163 2.79193 16.0035 3.225 16.0035C3.65808 16.0035 4.08671 15.9163 4.48535 15.7471C4.88398 15.5778 5.24444 15.33 5.54523 15.0184C5.84602 14.7069 6.08097 14.3379 6.23607 13.9336C6.39118 13.5292 6.46325 13.0978 6.448 12.665ZM5.158 12.665C5.16634 12.9241 5.12251 13.1822 5.02912 13.424C4.93573 13.6658 4.79468 13.8863 4.61436 14.0725C4.43404 14.2588 4.21813 14.4068 3.97946 14.5079C3.74078 14.6091 3.48421 14.6612 3.225 14.6612C2.96579 14.6612 2.70923 14.6091 2.47055 14.5079C2.23188 14.4068 2.01597 14.2588 1.83565 14.0725C1.65533 13.8863 1.51428 13.6658 1.42089 13.424C1.3275 13.1822 1.28367 12.9241 1.29201 12.665C1.28371 12.1434 1.4827 11.6399 1.8453 11.2649C2.2079 10.89 2.70447 10.6742 3.22601 10.665C3.44116 10.6676 3.65426 10.7072 3.856 10.782L2.722 12.248C2.6146 12.3871 2.56505 12.5623 2.58368 12.7371C2.60231 12.9118 2.68769 13.0726 2.822 13.186C2.88732 13.2408 2.96308 13.2818 3.0447 13.3066C3.12632 13.3313 3.21211 13.3393 3.29689 13.3299C3.38166 13.3206 3.46366 13.2941 3.53793 13.2522C3.6122 13.2103 3.6772 13.1537 3.729 13.086L4.86201 11.615C5.05447 11.9314 5.1565 12.2946 5.15701 12.665H5.158ZM20.712 11.999C20.7227 12.694 20.4575 13.365 19.9745 13.8649C19.4915 14.3648 18.83 14.6528 18.135 14.666C17.6794 14.6618 17.2331 14.5359 16.8425 14.3013C16.4518 14.0668 16.1309 13.7321 15.913 13.332H17.489C18.0105 13.3225 18.5069 13.1067 18.8694 12.7317C19.232 12.3568 19.431 11.8535 19.423 11.332C19.4264 11.2452 19.4123 11.1586 19.3814 11.0775C19.3506 10.9963 19.3037 10.9222 19.2435 10.8596C19.1833 10.797 19.1111 10.7472 19.0312 10.7131C18.9513 10.6791 18.8653 10.6616 18.7785 10.6616C18.6917 10.6616 18.6057 10.6791 18.5258 10.7131C18.4459 10.7472 18.3737 10.797 18.3135 10.8596C18.2533 10.9222 18.2064 10.9963 18.1756 11.0775C18.1447 11.1586 18.1306 11.2452 18.134 11.332C18.1367 11.5059 18.0703 11.6738 17.9494 11.7988C17.8285 11.9238 17.6629 11.9958 17.489 11.999H15.556C15.5453 11.3036 15.8108 10.6323 16.2942 10.1324C16.7777 9.63245 17.4397 9.3446 18.135 9.33198C18.83 9.34513 19.4915 9.6332 19.9745 10.1331C20.4575 10.633 20.7227 11.3039 20.712 11.999ZM18.779 6.66398C19.6476 6.6482 20.4746 6.28875 21.0787 5.66439C21.6828 5.04003 22.0148 4.20167 22.002 3.33298C22.0035 3.24661 21.9879 3.16081 21.9561 3.08048C21.9244 3.00014 21.8771 2.92686 21.817 2.86481C21.7569 2.80277 21.6852 2.75318 21.6059 2.71889C21.5266 2.6846 21.4414 2.66628 21.355 2.66498H18.527L14.391 5.20698C13.852 5.53262 13.2826 5.80523 12.691 6.02098C13.5193 6.47782 14.2139 7.14312 14.706 7.95098C14.706 7.96198 14.706 7.97298 14.716 7.98398C15.2653 7.49512 15.9099 7.12543 16.6092 6.89824C17.3085 6.67104 18.0473 6.59128 18.779 6.66398ZM13.73 4.06398L14.759 3.42298C14.3582 2.78754 13.804 2.26304 13.1475 1.89767C12.4911 1.5323 11.7533 1.33778 11.002 1.33198C10.1495 1.33894 9.31785 1.59589 8.61 2.07098C9.14508 2.41934 9.60204 2.87495 9.952 3.40898L11.052 5.12398C11.9987 4.92583 12.9045 4.56697 13.73 4.06298V4.06398Z"
              fill="#8C929B"
            />
          </svg>
        </button>
      </div>
      <p className="label">გარიგების ტიპი</p>
      <div
        id="deal"
        onChange={handleFormChange}
        className="search-type-container"
      >
        <span className={`select-span ${formData.ForRent ? "selected" : ""}`}>
          <p>
            {formData.ForRent
              ? document.querySelector(`label[for=deal-${formData.ForRent}]`)
                  ?.textContent
              : "ყველა გარიგება"}
          </p>
          <img className="select-arrow" src={selectArrow} alt="Select Arrow" />
        </span>
        <div className="checkbox-container">
          <label htmlFor="deal-0">
            <input
              type="checkbox"
              value="0"
              id="deal-0"
              onChange={(e): any => {
                const checkboxes: any =
                  e.target.parentNode?.parentNode?.querySelectorAll(
                    "input[type=checkbox]"
                  );
                Array.from(checkboxes).map((input: any) =>
                  input === e.target ? input : (input.checked = false)
                );
              }}
            />
            იყიდება
          </label>
          <label htmlFor="deal-1">
            <input
              type="checkbox"
              value="1"
              id="deal-1"
              onChange={(e): any => {
                const checkboxes: any =
                  e.target.parentNode?.parentNode?.querySelectorAll(
                    "input[type=checkbox]"
                  );
                Array.from(checkboxes).map((input: any) =>
                  input === e.target ? input : (input.checked = false)
                );
              }}
            />
            ქირავდება
          </label>
        </div>
      </div>
      <p className="label">მწარმოებელი</p>
      <div
        id="manufacturer"
        onChange={handleFormChange}
        className="search-type-container"
      >
        <span
          className={`select-span ${formData.Mans.length ? "selected" : ""}`}
        >
          <p>
            {formData?.Mans.length
              ? formData?.Mans.map(
                  (item: any) =>
                    document.querySelector(`label[for=man-${item[0]}]`)
                      ?.textContent
                ).join(", ")
              : "ყველა მწარმოებელი"}
          </p>
          <img className="select-arrow" src={selectArrow} alt="Select Arrow" />
        </span>
        <div className="checkbox-container" onChange={handleFormChange}>
          {filteredManData.map((man: any) => (
            <label key={man.man_id} htmlFor={`man-${man.man_id}`}>
              <input
                type="checkbox"
                value={man.man_id}
                id={`man-${man.man_id}`}
              />
              {man.man_name}
            </label>
          ))}
        </div>
      </div>
      <p className="label">მოდელი</p>
      <div
        id="model"
        onChange={handleFormChange}
        className="search-type-container"
      >
        <span
          className={`select-span ${
            Object.keys(modelData).length === 0 ? "disabled" : ""
          } ${
            formData.Mans.some((item: any) => item[1].length) ? "selected" : ""
          }`}
        >
          <p>
            {formData.Mans &&
            formData.Mans.some((man: any) => man[1].length !== 0)
              ? formData.Mans.map((man: any) =>
                  man[1].map(
                    (model: any) =>
                      document.querySelector(`label[for=model-${model}]`)
                        ?.textContent
                  )
                )
                  .filter((arr: any) => arr.length)
                  .join(", ")
              : "ყველა მოდელი"}
          </p>
          <img className="select-arrow" src={selectArrow} alt="Select Arrow" />
        </span>
        <div className="checkbox-container">
          {Object.entries(modelData).map((data: any) => (
            <div key={data[0]} data-man_id={data[0]}>
              <p className="model-p">
                {
                  document.querySelector(`label[for=man-${data[0]}]`)
                    ?.textContent
                }
              </p>
              {data[1].map((model: any) => (
                <label key={model.model_id} htmlFor={`model-${model.model_id}`}>
                  <input
                    type="checkbox"
                    value={model.model_id}
                    id={`model-${model.model_id}`}
                  />
                  {model.model_name}
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="label">კატეგორია</p>
      <div
        id="category"
        onChange={handleFormChange}
        className="search-type-container"
      >
        <span
          className={`select-span ${formData.Cats.length ? "selected" : ""}`}
        >
          <p>
            {formData?.Cats.length !== 0
              ? formData?.Cats.map(
                  (item: any) =>
                    document.querySelector(`label[for=cat-${item}]`)
                      ?.textContent
                ).join(", ")
              : "ყველა კატეგორია"}
          </p>
          <img className="select-arrow" src={selectArrow} alt="Select Arrow" />
        </span>
        <div className="checkbox-container">
          {filteredCatData.map((cat: any) => (
            <label key={cat.category_id} htmlFor={`cat-${cat.category_id}`}>
              <input
                type="checkbox"
                value={cat.category_id}
                id={`cat-${cat.category_id}`}
              />
              {cat.title}
            </label>
          ))}
        </div>
      </div>
      <div className="label" id="price-label">
        ფასი{" "}
        <div className="currency-btn-wrapper">
          <button
            type="button"
            onClick={() => setCurrency("GEL")}
            className={`currency-btn ${
              currency === "GEL" ? "active-currency-btn" : ""
            }`}
          >
            ₾
          </button>
          <button
            type="button"
            onClick={() => setCurrency("USD")}
            className={`currency-btn ${
              currency === "USD" ? "active-currency-btn" : ""
            }`}
          >
            $
          </button>
        </div>
      </div>
      <div id="price" onChange={handleFormChange}>
        <input
          type="number"
          min={0}
          step={1}
          placeholder="დან"
          id="PriceFrom"
        ></input>
        {"-"}
        <input
          type="number"
          min={0}
          step={1}
          placeholder="მდე"
          id="PriceTo"
        ></input>
      </div>
      <input type="submit" value="ძებნა" className="search-btn" />
    </form>
  );
};

export default Form;
