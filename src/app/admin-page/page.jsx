"use client";
<time datetime="2016-10-25" suppressHydrationWarning />;
import { redirect } from "next/navigation";
import SearchHeader from "../../components/widgets/search/SearchHeader";
import { handleGetWebUser } from "../../lib/api";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import UpdateRoleModal from "@components/modals/UpdateRoleModal";

const Page = () => {
  const [textSearch, setTextSearch] = useState();
  const [searchUsers, setSearchUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [adminPageRole, setAdminPageRole] = useState({});
  const [loadingRole, setLoadingRole] = useState(true);
  const [loading, setLoading] = useState(false);
  const [newStringEmail, setNewStringEmail] = useState("");

  useEffect(() => {
    try {
      const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
      console.log("user", user);
      if (user && user.roles) {
        if (user.roles.find((object) => (object.menu_id = "2"))) {
          setAdminPageRole(user.roles.find((object) => (object.menu_id = "2")));
        }
        console.log("adminPageRole", adminPageRole);
      }
    } catch (error) {
      console.log(error);
      redirect("/login");
    }
  }, []);
  useEffect(() => {
    if (adminPageRole) {
      setLoadingRole(false);
    }
  }, [adminPageRole]);
  useEffect(() => {
    if (selectedUser) {
      setShow(!show);
    }
  }, [selectedUser]);
  function checkIfEmailInString(text) {
    var re =
      /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    return re.test(text);
  }
  async function getWebUser(newStringEmail) {
    setLoading(true);
    handleGetWebUser(newStringEmail).then(async (res) => {
      setLoading(false);  
      const data = await res.json();
      console.log("data", data);
      if (data && data.result) {
        setSearchUsers(data.result);
      }
    });
  }

  if (adminPageRole && adminPageRole.SELECT_ROLE && adminPageRole.EDIT_ROLE) {
    return (
      <div className="admin-page">
        <h4>Tìm kiếm user</h4>
        <SearchHeader
          textSearch={textSearch}
          textHolder="Nhập email ..."
          callback={(e) => {
            
            setSelectedUser();
            if(e.length > 0){
              if (!checkIfEmailInString(e)) {
                setNewStringEmail(e + "@mobifone.vn");
                getWebUser(e + "@mobifone.vn");
              } else {
                setNewStringEmail(e)
                getWebUser(e);
              }
            }
            
          }}
        />
        <div className="table-user mt-2">
          <table className="table table-striped table-hover table-responsive  align-middle gs-0 gy-3">
            <thead>
              <tr className={`table-head`}>
                <th>Province</th>
                <th>Username</th>
                <th>Email</th>
                <th>Trạng thái</th>
                <th>Thêm quyền menu</th>
              </tr>
            </thead>
            <tbody>
              {searchUsers && searchUsers.length > 0
                ? searchUsers.map((object, index) => (
                    <tr key={index}>
                      <td>{object && object["PROVINCE"]}</td>
                      <td>{object && object["USER_NAME"]}</td>
                      <td>{object && object["USER_EMAIL"]}</td>
                      <td>
                        {object && object["STATUS"]
                          ? "Hoạt động"
                          : "Không hoạt động"}
                      </td>
                      <td>
                        <Button
                          onClick={() => {
                            setSelectedUser(object);
                          }}
                        >
                          Thêm quyền menu
                        </Button>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
        <UpdateRoleModal
          selectedUser={selectedUser}
          show={show}
          handleClose={() => {
            setShow(false);
            getWebUser(newStringEmail);
            setSelectedUser();
          }}
        />
      </div>
    );
  } else {
    return (
      <>
        <h1 style={{ color: "red", textAlign: "center" }}>
          {loadingRole ? "" : "Bạn không có quyền thực hiện chức năng này"}
        </h1>
      </>
    );
  }
};
export default Page;
