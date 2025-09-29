import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import dsHuyen from "../../mock/ds_huyen_ct7.json";
import copy from "copy-to-clipboard";
import { set } from "date-fns";
import Select from "react-select";
const provinceList = [
  {
    value: "KHO",
    label: "Khánh Hòa",
  },
  {
    value: "DLA",
    label: "Đăk Lăk",
  },
  {
    value: "GLA",
    label: "Gia Lai",
  },
  {
    value: "LDO",
    label: "Lâm Đồng",
  },
  { value: "QNG", label: "Quảng Ngãi" },
];
const API_URL = process.env.NEXTAUTH_APP_API_URL_SSL;
const FormChooseNumber1 = (props) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTelNumber, setSelectedTelNumber] = useState(
    props.selectedTelNumber
  );
  const [codeGS, setCodeGS] = useState();
  const [ip, setIp] = useState("");
  const [listShopCode, setListShopCode] = useState([]);
  const [error, setError] = useState(null);
  const [isHidenButtonSave, setIsHidenButtonSave] = useState(false);
  const [widthWindow, setWidthWindow] = useState(0);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);
  const [filePath, setFilePath] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWidthWindow(window.innerWidth);
    }
  }, []);

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
    shopCode: "",
    fullName: "",
    personalID: "",
    fullAddress: "",
    selectedTelNumber: "",
  });
  // Hàm xử lý thay đổi tỉnh
  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    console.log("provinceCode", provinceCode);

    import(`../../mock/ds_shopcode_moi.json`)
      .then((module) => {
        // const provinceFilter = module
        const tempListShopSode = Object.values(module.default).filter(
          (item) => {
            return item.PROVINCE == provinceCode && item.STATUS == 1;
          }
        );
        console.log("tempListShopSode", tempListShopSode);
        setListShopCode(tempListShopSode);
        const province = provinceList.find(
          (item) => item.value === provinceCode
        );
        const provinceName = province ? province.label : "";
        setFormData({
          ...formData,
          provinceCode: provinceCode,
          provinceName: provinceName,
        });
      })
      .catch((error) => {
        console.error("Error loading shop code data:", error);
      });
  };
  // Hàm xử lý thay đổi shop code
  const handleShopCodeChange = (selectedOption) => {
    setFormData({
      ...formData,
      shopCode: selectedOption ? selectedOption.value : "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const {
      selectedTelNumber,
      provinceCode,
      fullAddress,
      personalID,
      shopCode,
      fullName,
      provinceName,
    } = formData;
    if (
      selectedTelNumber.length == 0 ||
      provinceCode.length == 0 ||
      fullAddress.length == 0 ||
      personalID.length == 0 ||
      shopCode.length == 0
    ) {
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

 

    let postData = {
      in_hoten_kh: fullName,
      in_cccd_kh: personalID,
      in_tinh_kh: provinceCode,
      in_huyen_kh: "",
      in_diachi_kh: fullAddress,
      in_ip: ip,
      in_shop_code: shopCode,
      in_isdn: selectedTelNumber,
    };

    if (file && file.size > 2000 * 1024) return;

    setLoading(true);
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setUploading(true);
      setMessage("Đang tải lên tờ trình phê duyệt hạ cam kết...");
      try {
        const response = await fetch(API_URL + "/chon-so/upload-file", {
          method: "POST",
          body: formData,
        });
        setMessage("");
        setUploading(false);
        if (response.status === 200) {
          const data = await response.json();
          postData = {
            ...postData,
            in_link_phieu: data.filePath ? data.filePath : null,
            in_is_ha_ck: 1,
          };
          console.log("data", data);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setLoading(false);
        setMessage("Tải lên tờ trình phê duyệt hạ cam kết thất bại");
        return;
      }
    }

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
        if (data && data.code == 1) {
          const result = await fetch(API_URL + "/chon-so/update-is-hold", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              telNumberKey: selectedTelNumber,
              newValue: "1",
            }),
          });
          setLoading(false);
          if (result.status == 200) {
            console.log("truoc khi reset data");
            props.handleClose(true);
            console.log("sau khi reset data");

            resetForm();
            setCodeGS(data.codeGS);
            setError(data.message);
            setIsHidenButtonSave(true);
          } else {
            setLoading(false);
            setError("Cập nhật trạng thái giữ số thất bại");
            return;
          }
        } else {
          setLoading(false);
          setError(data.message);
        }
      } else {
        setLoading(false);
        setError(data.message);
        return;
      }
    } catch (error) {
      setLoading(false);
      console.log("error", error);
      setError(error.message);
      return;
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
      provinceName: "",
      fullName: "",
      shopCode: "",
      personalID: "",
      fullAddress: "",
    });
    setError();
    setLoading(false);
    setCodeGS("");
    setIsHidenButtonSave(false);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCopy = async () => {
    copy(codeGS);
  };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
    if (e.target.files[0] > 2000 * 1024) {
      alert("File phải nhỏ hơn 2000KB");
      return;
    }
  };

  const handleClearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Tạo options từ listShopCode
  const shopOptions = listShopCode.map((shop) => ({
    value: shop.SHOP_CODE,
    label: `${shop.SHOP_CODE} - ${shop.NAME}`,
  }));

  // Tìm object tương ứng với formData.shopCode
  const selectedShopOption =
    shopOptions.find((option) => option.value === formData.shopCode) || null;

  return (
    <Modal
      size={widthWindow > 768 ? "md" : "sm"}
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
                  {provinceList.map((province) => (
                    <option key={province.value} value={province.value}>
                      {province.label} {/* Hiển thị tên tỉnh */}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shop Selection */}
              <div className="from-group">
                <label htmlFor="shopCode">Chọn Shop:</label>

                <Select
                  id="shopCode"
                  name="shopCode"
                  value={selectedShopOption} // Sử dụng object { value, label }
                  onChange={handleShopCodeChange}
                  isSearchable={true}
                  required
                  options={shopOptions}
                  placeholder="Chọn shop"
                  isMulti={false}
                />
              </div>
              <div className="form-group">
                <label htmlFor="fullName">Tên khách hàng:</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nhập tên khách hàng"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="personnalID">
                  Số CCCD/Passport khách hàng:
                </label>
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
              <div className="max-w-md mx-auto p-6 space-y-4">
                <label className="">
                  Tờ trình phê duyệt hạ cam kết(nếu có):
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
                {message && <p>{message}</p>}
                {file && (
                  <div className="text-sm">
                    📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    <button
                      onClick={handleClearFile}
                      className="ml-2 text-red-500 underline"
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </div>
              <span style={{ color: "red" }}>
                {error && error.length > 0 ? error : ""}
              </span>
            </form>
            <span
              onClick={handleCopy}
              style={{
                fontSize: "20px",
                color: "green",
                fontWeight: 500,
                fontStyle: "italic",
              }}
            >
              {codeGS && codeGS.length > 0 ? codeGS : ""}
            </span>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="mt-4 d-flex justify-content-start w-100">
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

export default FormChooseNumber1;
