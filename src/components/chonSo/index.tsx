"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.scss";
const API_URL_TABLE = process.env.NEXTAUTH_APP_API_URL_SSL;
import FormChooseNumber from "@components/modals/FormChooseNumber";
import ReactLoading from 'react-loading';

interface NumberRecord {
  TEL_NUMBER: string;
  HLR_EXISTS: string;
  SPE_NUMBER_TYPE: number;
  LOAI_CK: string;
  NAME: string;
  CHANGE_DATETIME: string | null;
  IS_HOLD: string | null;
}

const NumberTable: React.FC = () => {
  const [data, setData] = useState<NumberRecord[]>([]); // Dữ liệu số điện thoại
  const [loading, setLoading] = useState<boolean>(false); // Trạng thái loading
  const [searchTerm, setSearchTerm] = useState<string>(""); // Từ khóa tìm kiếm
  const [warning, setWarning] = useState<string>(""); // Cảnh báo nhập liệu
  const [type, setType] = useState<string>(""); // Lưu giá trị type
  const [shopCodeInput, setShopCodeInput] = useState<string>("");
  const [totalCount, setTotalCount] = useState<number>(0); // Tổng số bản ghi
  const limit = 100; // Số dòng trên mỗi trang (cập nhật thành 100)
  const [showTooltip, setShowTooltip] = useState(false); // State điều khiển tooltip
  const [ip, setIp] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State điều khiển popup
  const [selectedTelNumber, setSelectedTelNumber] = useState<string | null>(""); // Số điện thoại được chọn
  const [codeGS, setCodeGS] = useState<string>(""); // Mã QR được chọn

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((res) => res.json())
      .then((data) => setIp(data.ip))
      .catch((err) => console.error('Failed to fetch IP:', err));
  }, []);
  // Fetch dữ liệu từ API
  const fetchData = async (term: string) => {
    setLoading(true);

    const startTime = new Date().toLocaleString(); // Thời gian bắt đầu tìm kiếm
    // console.log("Thời gian bắt đầu tìm kiếm:", startTime); // In ra thời gian bắt đầu
    try {
      // Thay dấu '*' thành '%' trong từ khóa trước khi gửi yêu cầu tới API
      let searchTermForAPI = term.replace(/\*/g, "%");

      // Sử dụng encodeURIComponent để đảm bảo các ký tự đặc biệt không gây lỗi trong URL
      searchTermForAPI = encodeURIComponent(searchTermForAPI);
      const shopCodeForAPI = encodeURIComponent(shopCodeInput); // Encode shopCodeInput

      // Gửi yêu cầu tới API
      const response = await axios.get(
        `${API_URL_TABLE}/chon-so/get-chon-so?search=${searchTermForAPI}&limit=${limit}&page=1&type=${type}&shopCode=${shopCodeForAPI}`
      );
      // console.log("Dữ liệu trả về từ API:", response.data);
      const resultTime = new Date().toLocaleString();
      // console.log("⏳ Thời gian kết quả trả về:", resultTime); // In ra thời gian khi có kết quả

      const result = response.data;

      if (result && Array.isArray(result.result)) {
        setData(result.result); // Cập nhật dữ liệu từ API
        setTotalCount(result.totalCount || 0); // Cập nhật tổng số bản ghi
      } else {
        setData([]); // Nếu không có dữ liệu, đặt lại mảng trống
      }
    } catch (error) {
      console.error("Error fetching data:", error); // Xử lý lỗi khi gọi API
    } finally {
      setLoading(false); // Đặt lại trạng thái loading
    }
  };

  // Hàm kiểm tra nhập liệu hợp lệ (chỉ cho phép * và số)
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const regex = /^[0-9*]*$/; // Biểu thức chính quy chỉ cho phép số và *

    if (regex.test(input)) {
      setSearchTerm(input); // Nếu hợp lệ, cập nhật searchTerm
      setWarning(""); // Xóa thông báo cảnh báo
    } else {
      setWarning("Cảnh báo: Chỉ được phép nhập số và dấu *!"); // Cảnh báo nếu có ký tự không hợp lệ
    }
  };

  const handleShopCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const regex = /^[A-Za-z0-9 ]*$/; // Biểu thức chính quy chỉ cho phép chữ cái, số và khoảng trắng

    if (regex.test(input)) {
      setShopCodeInput(input); // Nếu hợp lệ, cập nhật shopCodeInput
      setWarning(""); // Xóa thông báo cảnh báo
    } else {
      setWarning("Cảnh báo: Chỉ được phép nhập chữ cái, số và khoảng trắng!"); // Cảnh báo nếu có ký tự không hợp lệ
    }
  };

  // Xử lý khi người dùng chọn một giá trị từ select
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value); // Cập nhật giá trị type khi chọn
  };

  // Xử lý khi người dùng nhấn nút tìm kiếm
  const handleSearchClick = () => {
    fetchData(searchTerm); // Gọi lại fetchData với từ khóa tìm kiếm
  };

  const handleChooseTelNumber = async (telNumber: string) => {
    // try {

    //   const res = await fetch(`${API_URL_TABLE}/chonso/insertChonSo`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       isdn: telNumber,
    //     }),
    //   });

    //   const data = await res.json();
    //   if (data.result === 1) {
    //     alert("✅ Chọn số thành công");
    //     setSelectedNumbers((prev) => [...prev, telNumber]);
    //   } else {
    //     alert("❌ Có lỗi xảy ra khi chọn số");
    //   }
    // } catch (err) {
    //   console.error("Lỗi khi gọi API chọn số:", err);
    //   alert("❌ Lỗi hệ thống");
    // }

    setSelectedTelNumber(telNumber); // Cập nhật số điện thoại được chọn
    setShowPopup(true); // Hiện popup khi người dùng chọn số
  };
  const resetData = (isReset: boolean) => {
    if (isReset) {
      const copyData = [...data]; // Tạo một bản sao của mảng data
      const updatedData = copyData.map((item) => {
        if (item.TEL_NUMBER === selectedTelNumber) {
          return { ...item, IS_HOLD: "1" }; // Cập nhật trường IS_HOLD thành "1"
        }
        return item; // Trả về item không thay đổi
      });
      setData(updatedData); // Cập nhật lại state data với dữ liệu đã thay đổi
    }

    setShowPopup((prev) => !prev);
    setSelectedTelNumber(null); // Đặt lại số điện thoại được chọn
  }
  return (
    <div className="table-container">
      <h1 style={{ textAlign: "left" }}>Tra Cứu Kho Số</h1>
      <div className="search-container">
        <div style={{ position: "relative" }}>
          {/* input và tooltip ở đây */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch} // Cập nhật từ khóa khi người dùng nhập
            placeholder="Tìm kiếm số điện thoại"
            className="search-input" // Thêm class cho input
            onFocus={() => setShowTooltip(true)} // Hiện tooltip khi focus
            onBlur={() => setShowTooltip(false)} // Ẩn tooltip khi blur
          />
          {showTooltip && (
            <div className="tooltip-text">
              <strong>Hướng dẫn tìm kiếm:</strong>
              <br />
              Để tìm số bắt đầu bằng 88: <code>88*</code>
              <br />
              Để tìm số kết thúc bằng 88: <code>*88</code>
              <br />
              Để tìm số bắt đầu bằng 88 và kết thúc bằng 99: <code>88*99</code>
              <br />
              Để tìm số có chứa 88: <code>*88*</code>
              <br />
              Để tìm số có chứa 88 và 99: <code>*88*99*</code>
            </div>
          )}
        </div>
        {/* <input
          type="text"
          value={shopCodeInput}
          onChange={handleShopCode} // Cập nhật từ khóa khi người dùng nhập
          placeholder="Tìm kiếm kho số"
          className="search-input" // Thêm class cho input
        /> */}
        <select
          className="search-select"
          value={type}
          onChange={handleTypeChange} // Gọi hàm handleTypeChange khi thay đổi
        >
          <option value="">Tất cả</option>
          <option value="1">CK1500 Giá 1,500,000 đ</option>
          <option value="2">CK1200 Giá 1,200,000 đ</option>
          <option value="3">CK1000 Giá 1,000,000 đ</option>
          <option value="4">CK800 Giá 800,000 đ</option>
          <option value="5">CK500 Giá 500,000 đ</option>
          <option value="6">CK400 Giá 400,000 đ</option>
          <option value="7">CK300 Giá 300,000 đ</option>
          <option value="8">CK250 Giá 250,000 đ</option>
          <option value="9">CK150 Giá 150,000 đ</option>
          <option value="10">Tự Do</option>
        </select>
        <button
          className="search-button"
          onClick={handleSearchClick}
          disabled={!!warning} // Vô hiệu hóa nút khi có cảnh báo
        >
          Tìm kiếm
        </button>{" "}
        {/* Nút tìm kiếm */}
        {warning && <p className="warning-message">{warning}</p>}{" "}
        {/* Hiển thị cảnh báo */}
      </div>
      {loading ? (
        <div className="d-flex justify-center align-items-start flex-column" >
          <p>Bạn đợi chút nhé!</p>
          <ReactLoading type={'balls'} color={"#00e673"} height={67} width={40} />

        </div>

      ) : (
        <>
          {data.length === 0 ? (
            <p>No phone numbers found.</p>
          ) : (
                <div className="table-responsive" style={{ maxWidth: 610 }}>
                  <table className=" table table table-row-dashed table-striped  table-row-gray-300 align-middle gs-0 gy-3">
                    <thead>
                      <tr>
                        <th>Số Thuê Bao</th>
                        <th>Loại Cam Kết</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item) => (
                        <tr key={item.TEL_NUMBER}>
                          <td>{item.TEL_NUMBER}</td>
                          <td>{item.LOAI_CK}</td>
                          <td>
                            <div className="actions-container">
                              {
                                item.IS_HOLD === "1" ? (
                                  <span style={{ fontWeight: 500, fontStyle: 'italic', color: "red" }}>Số đang giữ</span>
                                ) :
                                  item.SPE_NUMBER_TYPE > 6 ? (
                                    <button
                                      className="choose-btn"
                                      onClick={() => handleChooseTelNumber(item.TEL_NUMBER)}
                                    >
                                      Chọn số
                                    </button>
                                  ) : (
                                    null
                                  )

                              }

                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>

          )}
        </>
      )}
      <FormChooseNumber show={showPopup} handleClose={resetData} selectedTelNumber={selectedTelNumber} />
    </div>
  );
};

export default NumberTable;
