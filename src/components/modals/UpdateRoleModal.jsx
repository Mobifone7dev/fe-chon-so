"use client";
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import LoadingComponent from "@components/loading/LoadingComponent";
import { handleGetUserRole } from "../../lib/api";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import MySelectSingle from "@components/selects/MySelectSingle";
import { handleUpdateUseRole} from "../../lib/api";
import {convertKeyToProvinceObject} from "../../lib/utils"

const  provinceList = [
  {
    value:"",
    label:"Không xác định"
  },
  {
    value:"KHO",
    label:"Khánh Hòa"
  },
  {
    value:"DLA",
    label:"Đăk Lăk"
  },
  {
    value:"GLA",
    label:"Gia Lai"
  },
  {
    value:"PYE",
    label:"Phú Yên"
  },
  {
    value:"DNO",
    label:"Đăk Nông"
  },
  {
    value:"KON",
    label:"Kon Tum"
  },
  {
    value:"CTY7",
    label:"VP Công ty"
  }

]


const UpdateRoleModal = (props) => {
  const initDataRoles = [
    {
      MENU_ID: "1",
      MENU_NAME: "DASHBOARD_KPI",
      SELECT_ROLE: 0,
      EDIT_ROLE: 0,
      TTOAN_ROLE: 0,
    },
    {
      MENU_ID: "2",
      MENU_NAME: "ADMIN_PAGE",
      SELECT_ROLE: 0,
      EDIT_ROLE: 0,
      TTOAN_ROLE: 0,
    },
  ];
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedUser, setSelectdUser] = useState(props.selectedUser);
  const [dataRoles, setDataRoles] = useState(initDataRoles);
  const [loading, setLoading] = useState(false);
  const [province, setProvince] = useState({value:"",label:"Không xác định"})

  const handleClose = async (e) => {
    props.handleClose();
  };
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    setShow(props.show);
  }, [props.show]);

  useEffect(() => {
    setSelectdUser(props.selectedUser);
    if(props.selectedUser &&props.selectedUser.PROVINCE){
      setProvince(convertKeyToProvinceObject(props.selectedUser.PROVINCE))
    }
  }, [props.selectedUser]);

  useEffect(() => {
    getRoleUser(selectedUser);
  }, [selectedUser]);

  useEffect(() => {
  }, [dataRoles]);
  const handleSubmit = async () => {
    setLoading(true);
    const data = {
      province : province.value,
      userEmail: selectedUser.USER_EMAIL,
      roles: dataRoles

    }
    const result = await handleUpdateUseRole(data);
    setLoading(false);

    if(result){
     resetModal();
     handleClose();
    }
  };
  const resetModal = () => {
    console.log("reset modal", initDataRoles)
    setDataRoles(initDataRoles);
    setSelectdUser();
    setProvince({value:"",label:"Không xác định"});
  }

  const getRoleUser = async (user) => {
    if (user && user["USER_EMAIL"]) {
      const res = await handleGetUserRole(user["USER_EMAIL"]);
      const data = await res.json();
      if (data && data.result ) {
        const userRoles = data.result;
        const copyDataRoles = [...dataRoles];
        for (const role of userRoles) {
          const indexRole = copyDataRoles.findIndex(
            (object) => object.MENU_ID == role.MENU_ID
          );
          if (indexRole != -1) {
            copyDataRoles[indexRole] = {
              MENU_ID: role.MENU_ID,
              EDIT_ROLE: role.EDIT_ROLE,
              SELECT_ROLE: role.SELECT_ROLE,
              TTOAN_ROLE: role.TTOAN_ROLE,
              MENU_NAME: role.MENU_NAME,
            };
          }
        }

        setDataRoles(copyDataRoles);
      }else{
        setDataRoles(initDataRoles);
      }
    }
  };
  const updateDataRole = (index, roleName, value) => {
    const copyDataRoles = [...dataRoles];
    const role = copyDataRoles[index];
    if (roleName == "SELECT_ROLE") {
      role.SELECT_ROLE = value == true ? 1 : 0;
    } else if (roleName == "EDIT_ROLE") {
      role.EDIT_ROLE = value == true ? 1 : 0;
    } else if (roleName == "TTOAN_ROLE") {
      role.TTOAN_ROLE = value == true ? 1 : 0;
    }
    copyDataRoles[index] = role;
    setDataRoles(copyDataRoles);
  };


  if (!mounted) return <></>;

  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        animation={false}
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Bảng phân quyền User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="table-role">
            <div className="mt-2 mb-2">
              <label htmlFor="provice">Tỉnh:</label>
              <MySelectSingle  className="select-province" value={province} options={provinceList} onChange={(e)=>{
                setProvince(e);
              }}/>
            </div>
            <table className="table table-responsive">
              <tbody>
                {dataRoles.map((object, index) => (
                  <tr key={`datarole_${index}`}>
                    <td>
                      {index + 1}. {convertMenuIdToMenuName(object["MENU_ID"])}
                    </td>
                    <td>
                      <input
                        checked={object.SELECT_ROLE == 1 ? true : false}
                        onChange={(e) => {
                          updateDataRole(index, "SELECT_ROLE", e.target.checked);
                        }}
                        type="checkbox"
                        name={`datarole_${index}_select_role`}
                        className="checkbox-pass"
                       
                      />
                      <label
                        className="ms-2"
                        htmlFor={`datarole_${index}_select_role`}
                      >
                        Select
                      </label>
                    </td>
                    <td>
                      <input
                        checked={object.EDIT_ROLE == 1 ? true : false}
                        onChange={(e) => {
                          updateDataRole(index, "EDIT_ROLE", e.target.checked);

                        }}
                        type="checkbox"
                        name={`datarole_${index}_edit_role`}
                        className="checkbox-pass"
                        onClick={() => {}}
                      />
                      <label
                        className="ms-2"
                        htmlFor={`datarole_${index}_edit_role`}
                      >
                        Edit
                      </label>
                    </td>

                    <td>
                      <input
                        checked={object.TTOAN_ROLE == 1 ? true : false}
                        onChange={(e) => {
                          updateDataRole(index, "TTOAN_ROLE", e.target.checked);

                        }}
                        type="checkbox"
                        name={`datarole_${index}_ttoan_role`}
                        className="checkbox-pass"
                      />
                      <label
                        className="ms-2"
                        htmlFor={`datarole_${index}_ttoan_role`}
                      >
                        Thanh toán
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </>
  );
};
const convertMenuIdToMenuName = (menuId) => {
  switch (menuId) {
    case "1":
      return "Báo cáo Dashboard KPI ";
    case "2":
      return "Trang Admin phân quyền";
    default:
      return "";
  }
};
export default UpdateRoleModal;
