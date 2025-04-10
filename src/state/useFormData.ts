import { useState, useEffect, ChangeEvent } from 'react';
import { ProvinceData, DistrictData, WardData } from "@/types/locationTypes";
import { FormRetailData } from '@/types/formRetailTypes';
import axios from 'axios';
import { useSession } from 'next-auth/react'; // Hook của next-auth
const defaultCenter = { lat: 12.6883602, lng: 108.0557606 };
const API_URL_FORM = process.env.NEXTAUTH_APP_API_URL_SSL;

export const useFormData = () => {
  
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [province, setProvince] = useState<ProvinceData[]>([]);
  const [districts, setDistricts] = useState<DistrictData[]>([]);
  const [wards, setWards] = useState<WardData[]>([]);

  const { data: session } = useSession();  // Lấy thông tin session người dùng

  
  // In ra session để kiểm tra thông tin
  useEffect(() => {
    console.log("Thông tin session: ", session);
  }, [session]);


  // Khởi tạo formData, bao gồm createdBy
  const [formData, setFormData] = useState<FormRetailData>({
    avatar: null,
    nameShop: "",
    shopID: "",
    staffSupport: "",
    personalID: "",
    staffCode: "",
    shopCode: "",
    email: "",
    phone: "",
    provinceCode: "",
    districtCode: "",
    wardCode: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    latitude: defaultCenter.lat,
    longitude: defaultCenter.lng,
    images: [],
    createdBy: session?.user?.email || "", // Lưu toàn bộ thông tin session dưới dạng chuỗi,
  });

  // Hàm xử lý thay đổi tỉnh
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceCode = e.target.value;
    
    import(`../mock/tinh-tp/tinh_tp.json`)
      .then((module) => {
        const provinces = Object.values(module.default);
        const provinceData = provinces.find(item => item.code === provinceCode);
        const provinceName = provinceData ? provinceData.name_with_type : "Tên tỉnh không có";

        setFormData({
          ...formData,
          province: provinceName,
          provinceCode: provinceCode,
          districtCode: "",  // Reset quận
          wardCode: "",      // Reset xã/phường
          address: "",       // Reset địa chỉ
        });

        import(`../mock/quan-huyen/${provinceCode}.json`)
          .then((module) => {
            setDistricts(Object.values(module.default));
            setWards([]); // Reset xã/phường khi thay đổi tỉnh
          })
          .catch((error) => {
            console.error("Không tìm thấy dữ liệu huyện:", error);
            setDistricts([]);  // Reset districts khi có lỗi
            setWards([]);      // Reset wards khi có lỗi
          });
      })
      .catch((error) => {
        console.error("Không tìm thấy dữ liệu tỉnh:", error);
      });
  };

  // Hàm xử lý thay đổi quận
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtCode = e.target.value;
    const districtData = districts.find(item => item.code === districtCode);
    const districtName = districtData ? districtData.name_with_type : "Tên quận không có";

    setFormData({
      ...formData,
      districtCode: districtCode,
      district: districtName,
      wardCode: "",   // Reset xã/phường
      address: "",    // Reset địa chỉ
    });

    import(`../mock/xa-phuong/${districtCode}.json`)
      .then((module) => {
        setWards(Object.values(module.default));
      })
      .catch((error) => {
        console.error("Không tìm thấy dữ liệu xã:", error);
        setWards([]);  // Reset wards khi có lỗi
      });
  };

  // Hàm xử lý thay đổi xã/phường
  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardCode = e.target.value;
    const wardData = wards.find(item => item.code === wardCode);
    const wardName = wardData ? wardData.name_with_type : "Tên xã/phường không có";

    setFormData({
      ...formData,
      wardCode: wardCode,
      ward: wardName,
      address: "",  // Reset địa chỉ khi thay đổi xã/phường
    });
  };

  // Hàm xử lý thay đổi dữ liệu các trường khác
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setFormData({ ...formData, latitude: lat, longitude: lng });
    }
  };

  // Upload ảnh avatar
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // Để theo dõi file avatar

  // Cập nhật giá trị khi người dùng chọn ảnh
  const handleImageAvata = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
  
    if (file) {
      const maxSize = 1 * 1024 * 1024; // 1MB
      if (file.size > maxSize) {
        alert("Ảnh quá lớn, vui lòng chọn ảnh dưới 1MB.");
        return;
      }
  
      setFormData({
        ...formData,
        avatar: file, 
      });
  
      setAvatarFile(file); // Cập nhật file đã chọn
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl); 
    } else {
      setImagePreview(null); 
      setAvatarFile(null); // Reset file nếu không có file nào
    }
  };
  // Upload nhiều ảnh
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const previews: string[] = []; 
      const fileList: File[] = [];   
  
      Array.from(files).forEach((file) => {
        const maxSize = 1 * 1024 * 1024; 
        if (file.size > maxSize) {
          alert("Ảnh quá lớn, vui lòng chọn ảnh dưới 1MB.");
          return;
        }
  
        previews.push(URL.createObjectURL(file)); 
        fileList.push(file); 
  
        if (previews.length === files.length) {
          setFormData({
            ...formData,
            images: fileList,
          });
          setImagePreviews(previews);
        }
      });
    } else {
      setImagePreviews([]);
      setFormData({
        ...formData,
        images: [],
      });
    }
  };

  const [modalShow, setModalShow] = useState(false); // State điều khiển việc hiển thị modal
  const [errorModalShow, setErrorModalShow] = useState(false); // Modal không thành công
  const [errorMessage, setErrorMessage] = useState<string>(""); // State chứa lỗi từ server

  // Hàm xử lý gửi form
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("handleSubmit")

    // // In thông tin người tạo trước khi gửi form
    // console.log("Thông tin người tạo:", formData.createdBy);
    // // Kiểm tra dữ liệu formData trước khi gửi
    // console.log("Dữ liệu formData trước khi gửi:", formData);
  
    // // Tạo FormData để gửi với axios (multipart/form-data)
    // const formDataToSend = new FormData();
  
    // // Duyệt qua formData và thêm vào FormData object
    // Object.keys(formData).forEach(key => {
    //   if (Array.isArray(formData[key])) {
    //     // Nếu là mảng (ví dụ như ảnh), thêm ảnh vào FormData
    //     formData[key].forEach((image: string | File, index: number) => {
    //       formDataToSend.append(key, image);  // Đảm bảo ảnh được gửi chính xác
    //     });
    //   } else {
    //     formDataToSend.append(key, formData[key]);  // Thêm từng trường vào FormData
    //   }
    // });
  
    // // Kiểm tra dữ liệu sẽ được gửi (chỉ kiểm tra mà không thực sự gửi)
    // console.log("Dữ liệu FormData sẽ được gửi:", formDataToSend);
  
    // // Gửi yêu cầu API tới server

    // // fetch(`${API_URL}/website/createSalePoint`, {
    // //   method: 'POST',
    // //   body: formDataToSend,
    // // })


    // .then(response => {
    //   console.log("Response from server:", response);
    //   setModalShow(true);
  
    //   // Reset formData và các thông tin liên quan
    //   setFormData({
    //     avatar: null,
    //     nameShop: "",
    //     shopID: "",
    //     staffSupport: "",
    //     personalID: "",
    //     staffCode: "",
    //     shopCode: "",  
    //     email: "",
    //     phone: "",
    //     provinceCode: "",
    //     districtCode: "",
    //     wardCode: "",
    //     province: "",
    //     district: "",
    //     ward: "",
    //     address: "",
    //     latitude: defaultCenter.lat,
    //     longitude: defaultCenter.lng,
    //     images: [],
    //     createdBy: session?.user?.email || "", // Giữ thông tin người tạo
    //   });
  
    //   // Reset ảnh xem trước (preview)
    //   setImagePreview(null);
    //   setImagePreviews([]);
    //   // Reset avatarFile sau khi submit thành công
    //   setAvatarFile(null);

    // })
    // .catch(error => {
    //   console.error("Error response:", error.response); // In ra lỗi đầy đủ
    //   const errorMsg = error.response?.data?.errors 
    //     ? error.response.data.errors.map((err: any) => err.msg).join(", ") 
    //     : error.message || "Lỗi không xác định.";  
    //   setErrorMessage(errorMsg);  
    //   setErrorModalShow(true);  
    // });
  };

  return {
    formData,
    handleChange,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
    handleSubmit,
    imagePreview,
    handleImageAvata,
    imagePreviews,
    handleImages,
    handleMapClick,
    modalShow,
    setModalShow,
    errorModalShow,
    setErrorModalShow,
    setDistricts, // Trả về hàm cập nhật
    setWards,
    submittedData, // Sử dụng submittedData từ hook
    districts,
    wards,
    avatarFile,
    setAvatarFile,
    errorMessage,
    setErrorMessage,
  };
};

