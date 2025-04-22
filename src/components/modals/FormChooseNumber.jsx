import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import tinhData from "../../mock/tinh-tp/tinh_tp_cty7.json"; // Dữ liệu tỉnh
import Button from "react-bootstrap/Button";
import dsHuyen from "../../mock/ds_huyen_ct7.json";
import copy from 'copy-to-clipboard';


const API_URL = process.env.NEXTAUTH_APP_API_URL_SSL;
const FormChooseNumber = (props) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTelNumber, setSelectedTelNumber] = useState(
    props.selectedTelNumber
  );
  const [codeGS, setCodeGS] = useState();
  const [ip, setIp] = useState("");
  const [listShopCode, setListShopCode] = useState([]);
  const [error, setError] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [isHidenButtonSave, setIsHidenButtonSave] = useState(false);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIp(data.ip))
      .catch((err) => console.error("Failed to fetch IP:", err));
  }, []);

  const handleClose = (isReset) => {
    resetForm();
    setShow(false);
    props.handleClose(isReset);
  };

  useEffect(() => {
    setShow(props.show);
    setSelectedTelNumber(props.selectedTelNumber);
    setFormData({
      ...formData,
      selectedTelNumber: props.selectedTelNumber,
    });
  }, [props.selectedTelNumber, props.show]);

  const [formData, setFormData] = useState({
    provinceCode: "",
    districtCode: "",
    shopCode: "",
    fullName: "",
    personalID: "",
    fullAddress: "",
    selectedTelNumber: "",
  });
  // Hàm xử lý thay đổi tỉnh
  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;

    import(`../../mock/tinh-tp/tinh_tp.json`)
      .then((module) => {
        // const provinceFilter = module
        const provinces = Object.values(module.default);
        const provinceData = provinces.find(
          (item) => item.code === provinceCode
        );
        const provinceName = provinceData
          ? provinceData.name
          : "Tên tỉnh không có";

        setFormData({
          ...formData,
          provinceCode: provinceCode,
          provinceName: provinceName,
          districtCode: "", // Reset quận
        });

        import(`../../mock/quan-huyen/${provinceCode}.json`)
          .then((module) => {
            // console.log("module.default", module.default);
            setDistricts(Object.values(module.default));
          })
          .catch((error) => {
            console.error("Không tìm thấy dữ liệu huyện:", error);
            setDistricts([]); // Reset districts khi có lỗi
          });
      })
      .catch((error) => {
        console.error("Không tìm thấy dữ liệu tỉnh:", error);
      });
  };

  const handleShopCodeChange = (e) => {
    const shopCode = e.target.value;
    const shopData = listShopCode.find((item) => item.SHOP_CODE === shopCode);
    setFormData({
      ...formData,
      shopCode: shopData ? shopData.SHOP_CODE : "",
    });
  };
  const handleDistrictChange = async (e) => {
    const districtCode = e.target.value;
    const districtData = districts.find((item) => item.code === districtCode);
    // console.log("districtData", districtData);

    const filteredData = dsHuyen.filter((item) =>
      item.DISTRICT_NAME.toLowerCase().includes(districtData.name.toLowerCase())
    );
    // console.log("filteredData", filteredData);
    if (filteredData.length > 0) {
      const result = await fetch(
        API_URL +
          `/chon-so/get-shopcode-by-district?districtCode=${filteredData[0].DISTRICT_CODE}&&provinceCode=${filteredData[0].PROVINCE_CODE}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const data = await result.json();
      if (data && data.data.length > 0) {
        let tempArrActive = data.data
          .filter((item) => item.SHOP_TYPE == 200 || item.SHOP_TYPE == 101|| item.SHOP_TYPE == 102|| item.SHOP_TYPE == 103)
          .filter((item) => item.STATUS == 1);
        setListShopCode(tempArrActive);
      }
    }

    setFormData({
      ...formData,
      districtCode: districtCode,
      districtName: districtData.name,
    });
  };

  // Hàm xử lý thay đổi dữ liệu các trường khác
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const {
      selectedTelNumber,
      provinceCode,
      districtCode,
      fullAddress,
      personalID,
      shopCode,
      fullName,
      districtName,
      provinceName,
    } = formData;
    if (
      selectedTelNumber.length == 0 ||
      provinceCode.length == 0 ||
      districtCode.length == 0 ||
      fullAddress.length == 0 ||
      personalID.length == 0 ||
      shopCode.length == 0
    ) {
      // console.log(
      //   selectedTelNumber,
      //   codeGS,
      //   provinceCode,
      //   districtCode,
      //   fullAddress,
      //   personalID,
      //   shopCode
      // );
      setError("Vui lòng nhập đầy đủ thông tin");
      setLoading(false);
      return;
    }

    if (fullName.trim().length < 3) {
      setError("Tên phải có ít nhất 3 ký tự");
      return;
    }

    if (fullAddress.trim().length < 10) {
      setError("Vui lòng nhập địa chỉ cụ thể hơn");
      return;
    }

    if (isValidID(personalID) == false) {
      setError("Số CCCD hoặc passport không hợp lệ");
      return;
    }
    const huyenData = dsHuyen.filter((item) =>
      item.DISTRICT_NAME.toLowerCase().includes(districtName.toLowerCase())
    );
    const tinhData = dsHuyen.filter((item) =>
      item.PROVINCE_NAME.toLowerCase().includes(provinceName.toLowerCase())
    );

    const postData = {
      in_hoten_kh: fullName,
      in_cccd_kh: personalID,
      in_tinh_kh: tinhData[0].PROVINCE_CODE,
      in_huyen_kh: huyenData[0].DISTRICT_CODE,
      in_diachi_kh: fullAddress,
      in_ip: ip,
      in_shop_code: shopCode,
      in_isdn: selectedTelNumber,
    };
    try {
      const result = await fetch(API_URL + "/chon-so/insertChonSo", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      if (result.status == 200) {
        const data = await result.json();
        // console.log("data", data);
        setLoading(false);
        if (data && data.code == 1) {
          resetForm();
          setCodeGS(data.codeGS);
          setError(data.message);
          setIsHidenButtonSave(true);
          // setTimeout(() => {
          //   handleClose(true);
          // }, 1000);
        } else {
          setLoading(false);
          setError(data.message);
        }
      }
    } catch (error) {
      setLoading(false);
      console.log("error", error);
      setError(error.message);
    }
  };
  function isValidID(input) {
    const cccdRegex = /^\d{12}$/;
    const passportRegex = /^[a-zA-Z0-9]{6,9}$/;
    return cccdRegex.test(input) || passportRegex.test(input);
  }
  const resetForm = () => {
    setFormData({
      selectedTelNumber: "",
      provinceCode: "",
      districtCode: "",
      districtName: "",
      provinceName: "",
      fullName: "",
      shopCode: "",
      personalID: "",
      fullAddress: "",
    });
    setError();
    setDistricts([]);
    setLoading(false);
    setCodeGS("");
    setIsHidenButtonSave(false);
  };

    const handleCopy = async () => {
      copy(codeGS);

    };
  return (
    <Modal
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      animation={false}
      show={show}
      onHide={() => handleClose(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Thông tin khách hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-selected-number">
          {" "}
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <div className="d-flex justify-content-between">
                <div className="form-group me-2">
                  <label htmlFor="selectedTelNumber">Số thuê bao</label>
                  <input
                    type="text"
                    id="selectedTelNumber"
                    name="selectedTelNumber"
                    value={formData.selectedTelNumber}
                    placeholder=""
                    required
                    disabled={true}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="province">Tỉnh/Thành phố:</label>
                <select
                  id="provinceCode"
                  name="provinceCode"
                  value={formData.provinceCode || ""} // Đảm bảo giá trị không phải undefined
                  onChange={handleProvinceChange}
                  required
                  className="form-select"
                >
                  <option value="">Chọn tỉnh/thành phố</option>
                  {Object.values(tinhData).map((province) => (
                    <option key={province.code} value={province.code}>
                      {province.name} {/* Hiển thị tên tỉnh */}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Selection */}
              <div className="form-group">
                <label htmlFor="district">Quận/Huyện:</label>
                <select
                  id="district"
                  name="district"
                  value={formData.districtCode}
                  onChange={handleDistrictChange}
                  required
                  className="form-select"
                >
                  <option value="">Chọn quận/huyện</option>
                  {districts.length > 0 ? (
                    districts.map((district) => (
                      <option key={district.code} value={district.code}>
                        {district.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Chọn tỉnh để thấy các quận/huyện</option>
                  )}
                </select>
              </div>

              {/* Shop Selection */}
              <div className="form-group">
                <label htmlFor="shopCode">Chọn Shop:</label>
                <select
                  id="shopCode"
                  name="shopCode"
                  value={formData.shopCode}
                  onChange={handleShopCodeChange}
                  required
                  className="form-select"
                >
                  <option value="">Chọn shop</option>
                  {listShopCode.length > 0 ? (
                    listShopCode.map((shopCode) => (
                      <option
                        key={shopCode.SHOP_CODE}
                        value={shopCode.SHOP_CODE}
                      >
                       {shopCode.SHOP_CODE} - {shopCode.NAME}
                      </option>
                    ))
                  ) : (
                    <option disabled>Chọn Shop để giữ số:</option>
                  )}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="fullName">Tên khách hàng:</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nhập tên của bạn"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="personnalID">Số CCCD/Passport khách hàng:</label>
                <input
                  type="text"
                  id="personalID"
                  name="personalID"
                  value={formData.personalID}
                  onChange={handleChange}
                  placeholder="Số CCCD của khách hàng"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="fullAddress">Địa chỉ cụ thể:</label>
                <textarea
                  rows={3}
                  type="text-area"
                  id="fullAddress"
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleChange}
                  placeholder="Địa chỉ cụ thể"
                  required
                  className="form-control"
                />
              </div>
              <span style={{ color: "red" }}>
                {error && error.length > 0 ? error : ""}
              </span>
            </form>
            <span onClick={handleCopy} style={{fontSize: "20px", color: "green", fontWeight: 500, fontStyle:"italic"}}>{codeGS&&codeGS.length > 0 ? codeGS : ""}</span>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="mt-4 d-flex justify-content-around">
          <Button
            className="me-4 "
            variant="secondary"
            onClick={() => handleClose(false)}
          >
            Close
          </Button>
          {isHidenButtonSave ? null : (
            <Button variant="primary" onClick={handleSubmit}>
              {loading ? "Saving ..." : "Save"}
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default FormChooseNumber;
