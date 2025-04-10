

export interface FormRetailData  {
  createdBy: string; // Người tạo (email hoặc tên người dùng)
  avatar: File | null; // Ảnh đại diện
  nameShop: string; // Tên điểm bán
  shopID: string; // Mã điểm bán
  staffSupport: string; // Nhân viên hỗ trợ
  personalID: string; // Số CCCD
  staffCode: string;
  shopCode: string;
  email: string; // Email
  phone: string; // Số điện thoại
  provinceCode: string; // Tỉnhs
  districtCode: string; // Huyện
  wardCode: string; // Phường
  province: string; // Tên Tỉnh
  district: string; // Tên Huyện
  ward: string; // Tên Phường
  address: string; // Địa chỉ
  latitude: number; // Vĩ độ
  longitude: number; // Kinh độ
  images: File[]; // Danh sách ảnh (mảng các file ảnh)
  [key: string]: any;  // Index signature, cho phép truy cập với key là string

  }
  