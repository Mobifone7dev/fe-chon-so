"use client";

import React from "react";
import { useState, useEffect, ChangeEvent } from "react";

import { ProvinceData, DistrictData, WardData } from "@/types/locationTypes";

const Page = (props) => {
  const [submittedData, setSubmittedData] = useState();
  const [province, setProvince] = useState([]);
  const [districts, setDistricts] = useState([]);
  const[fullAddress, setFullAddress] = useState();

  const[formData, setFormData] = useState({})
  const[isdn, setIsdn] = useState('');

  // Hàm xử lý thay đổi tỉnh
  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;

    import(`../../mock/tinh-tp/tinh_tp.json`)
      .then((module) => {
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
            setDistricts(Object.values(module.default));
            setWards([]); // Reset xã/phường khi thay đổi tỉnh
          })
          .catch((error) => {
            console.error("Không tìm thấy dữ liệu huyện:", error);
            setDistricts([]); // Reset districts khi có lỗi
            setWards([]); // Reset wards khi có lỗi
          });
      })
      .catch((error) => {
        console.error("Không tìm thấy dữ liệu tỉnh:", error);
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

  return (
    <div className="content">
      <div className="form-selected-number">
        <h2>Form chọn số</h2>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            
            <div>
              <label htmlFor="isdn">Số thuê bao</label>
              <input
                type="text"
                id="isdn"
                name="isdn"
                value={formData.isdn}
                placeholder=""
                required
                disabled={true}
              />
            </div>
            <div>
              <label htmlFor="idDiemBan">Mã giữ chỗ</label>
              <input
                type="text"
                id="codeqs"
                name="codeqs"
                value={formData.codeqs}
                onChange={handleChange}
                placeholder="Mã giữ chỗ"
                required
              />
            </div>

            <div>
              <label htmlFor="">Số CCCD</label>
              <input
                type="text"
                id="personalID"
                name="personalID"
                value={personalID.personalID}
                onChange={handleChange}
                placeholder="Số CCCD của khách hàng"
                required
              />
            </div>
                   
            <div className="form-row">
              {/* Province Selection */}
              <div className="">
                <label htmlFor="province">Tỉnh/Thành phố:</label>
                <select
                  id="provinceCode"
                  name="provinceCode"
                  value={formData.provinceCode || ""} // Đảm bảo giá trị không phải undefined
                  onChange={handleProvinceChange}
                  required
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
              <div className="">
                <label htmlFor="district">Quận/Huyện:</label>
                <select
                  id="district"
                  name="district"
                  value={formData.districtCode}
                  onChange={handleDistrictChange}
                  required
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

              {/* Ward Selection */}
              {/* <div>
                <label htmlFor="ward">Xã/Phường:</label>
                <select
                  id="ward"
                  name="ward"
                  value={formData.wardCode}
                  onChange={handleWardChange}
                  required
                >
                  <option value="">Chọn xã/phường</option>
                  {wards.length > 0 ? (
                    wards.map((ward) => (
                      <option key={ward.code} value={ward.code}>
                        {ward.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Chọn quận để thấy các xã/phường</option>
                  )}
                </select>
              </div> */}
            </div>
            <div>
              <label htmlFor="phone">Địa chỉ cụ thể</label>
              <input
                type="text"
                id="address"
                name="address"
                value={fullAddress}
                onChange={handleChange}
                placeholder="Địa chỉ cụ thể"
                required
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Page;
