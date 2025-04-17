import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import tinhData from "../../mock/tinh-tp/tinh_tp_cty7.json"; // Dữ liệu tỉnh
import Button from "react-bootstrap/Button";
import dsHuyen from"../../mock/ds_huyen_ct7.json";
const API_URL =  process.env.NEXTAUTH_APP_API_URL_SSL ;
const FormChooseNumber = (props) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTelNumber, setSelectedTelNumber] = useState(
    props.selectedTelNumber
  );
  const[codeGS, setCodeGS] = useState(props.codeGS);
  const [ip, setIp] = useState("");
  const [listShopCode, setListShopCode] = useState([]);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIp(data.ip))
      .catch((err) => console.error("Failed to fetch IP:", err));
  }, []);

  const handleClose = () => {
    setShow(false);
    props.handleClose();
  };
  useEffect(() => {
    setShow(props.show);
  }, [props.show]);
  useEffect(() => {
    console.log("props.selectedTelNumber",props.selectedTelNumber  )
    setSelectedTelNumber(props.selectedTelNumber);
    setFormData({
      ...formData,
      selectedTelNumber: props.selectedTelNumber,
      codeGS: props.codeGS,
    });
  }, [props.selectedTelNumber,props.codeGS]);



  const [province, setProvince] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [fullAddress, setFullAddress] = useState();
  const [formData, setFormData] = useState({});
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
          ? provinceData.name_with_type
          : "Tên tỉnh không có";

        setFormData({
          ...formData,
          province: provinceName,
          provinceCode: provinceCode,
          districtCode: "", // Reset quận
          address: "", // Reset địa chỉ
        });

        import(`../../mock/quan-huyen/${provinceCode}.json`)
          .then((module) => {
            console.log("module.default", module.default);
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

  const handleDistrictChange = async (e) => {
    const districtCode = e.target.value;
    const districtData = districts.find((item) => item.code === districtCode);
    const districtName = districtData
      ? districtData.name_with_type
      : "Tên quận không có";
      const filteredData = dsHuyen.filter((item) =>
        item.DISTRICT_NAME.toLowerCase().includes(districtData.name.toLowerCase())
      );

      if(filteredData.length > 0){
        const result = await fetch(API_URL +`chon-so/get-shopcode-by-district?districtCode=${filteredData[0].DISTRICT_CODE}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"}
    });

    const data = await result.json();
    console.log("data shopcode", data);
      }
    

    setFormData({
      ...formData,
      districtCode: districtCode,
      district: districtName,
      wardCode: "", // Reset xã/phường
      address: "", // Reset địa chỉ
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

  const handleSubmit = () => {
    setLoading(true);
    const data = {
      ...formData,
      selectedTelNumber: selectedTelNumber,
      fullAddress: fullAddress,
    };
    console.log(data);
    setTimeout(() => {
      setLoading(false);
      handleClose();
    }, 1000);
  };

  return (
    <Modal
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      animation={false}
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Form chọn số</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-selected-number">
          {" "}
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <div className="d-flex justify-content-between">
                <div className="form-group">
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
                <div className="form-group">
                  <label htmlFor="codeGS">Mã giữ chỗ</label>
                  <input
                    type="text"
                    id="codeGS"
                    name="codeGS"
                    value={formData.codeGS}
                    onChange={handleChange}
                    placeholder="Mã giữ chỗ"
                    required
                    disabled={true}
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

              <div className="form-group">
                <label htmlFor="personnalID">Số CCCD</label>
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
                <label htmlFor="address">Địa chỉ cụ thể</label>
                <textarea
                  rows={3}
                  type="text-area"
                  id="address"
                  name="address"
                  value={fullAddress}
                  onChange={handleChange}
                  placeholder="Địa chỉ cụ thể"
                  required
                  className="form-control"
                />
              </div>
            </form>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="mt-4 d-flex justify-content-around">
          <Button className="me-4 " variant="secondary" onClick={handleClose}>
            Close
          </Button>

          <Button variant="primary" onClick={handleSubmit}>
            {loading ? "Saving ..." : "Save"}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default FormChooseNumber;
