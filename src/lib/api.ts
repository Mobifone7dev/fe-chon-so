import axios from "axios";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXTAUTH_APP_API_URL_SSL;

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`;
// export const LOGIN_URL = `${API_URL}/sys-user/login`
export const LOGIN_URL = `${API_URL}/login`;
export const REGISTER_URL = `${API_URL}/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`;
export const CHECK_PACKAGE_URL = `${API_URL}/website/package`;
export const CHECK_TYPE_PACKAGE_URL = `${API_URL}/website/type`;

axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

// Server should return AuthModel
export async function login(email: string, password: string) {
  console.log('LOGIN_URL', LOGIN_URL, email, password)

  const result = await fetch(LOGIN_URL, {
    method: "POST",// *GET, POST, PUT, DELETE, etc
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      username: email,
      password,
    }), // body data type must match "Content-Type" header
  });
  return result.json();
}

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    first_name: firstname,
    last_name: lastname,
    password,
    password_confirmation,
  });
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
    email,
  });
}

export function getUserByToken(token: string) {
  // const user: UserModel = {
  //   username: "demo",
  //   password: "123456",
  //   api_token: "sdfsdfsd34sg456trtgfxdg",
  //   created_at: "2022-03-30T12:17:50.000000Z",
  //   email: "admin@admin.com",
  //   email_verified_at: "2022-03-30T12:17:50.000000Z",
  //   first_name: "Maeve",
  //   id: 2,
  //   last_name: "Casper",
  //   updated_at: "2022-03-30T12:17:50.000000Z",
  // } as UserModel;

  return { data: "unknow" };
  //  axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
  //   api_token: token,
  // })
}

export async function checkPackage(searchVal?: string) {
  console.log("CHECK_PACKAGE_URL", CHECK_PACKAGE_URL + `?isdn=${searchVal}`);
  const result = await fetch(CHECK_PACKAGE_URL + `?isdn=${searchVal}`);
  return result;
}

export async function checkTypePackage(searchVal?: string) {
  console.log(
    "CHECK_TYPE_PACKAGE_URL",
    CHECK_TYPE_PACKAGE_URL + `?isdn=${searchVal}`
  );
  const result = await fetch(CHECK_TYPE_PACKAGE_URL + `?isdn=${searchVal}`);
  return result;
}

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
export async function createManualApiList(postData: any) {
  const URL = process.env.NEXTAUTH_APP_API_URL_SSL;
  console.log("postData", postData);
  let res;
  const token = localStorage.getItem("accessToken");

  try {
    res = await fetch(
      URL + `/dashboard/dashboard-create-manual-list-kpi`,
      {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify(postData)

      })
    if (res.status == 403) {
      signOut({ redirect: false });
      redirect("/login");
    }
    const data = await res.json()
    if (res) {
      return Response.json({
        success: true, result: data.result
      });
    } else {
      console.log('res', res)
      return Response.json({ success: false });
    }

  } catch (e) {
    console.log(e)
    return Response.json(
      { message: "An error occurred while get code.", e },
      { status: 500 }
    );
  }

}
export async function handleGetPlanKpi(month: string, province? : string) {

  const URL = process.env.NEXTAUTH_APP_API_URL_SSL;
  console.log("URL", URL + `/dashboard/dashboard-plan-kpi?month=${month}`)
  let res;
  const token = localStorage.getItem("accessToken");
  const urlApi  = province&&province.length > 0 ?  URL + `/dashboard/dashboard-plan-kpi?month=${month}&&province=${province}` :  URL + `/dashboard/dashboard-plan-kpi?month=${month}`;
  try {
    res = await fetch(
      urlApi,
      { headers: { "Authorization": `Bearer ${token}` } })
    if (res.status == 403) {
      signOut({ redirect: false });
      redirect("/login");
    }
    const data = await res.json()
    if (res) {
      return Response.json({
        success: true, result: data.result
      });
    } else {
      console.log('res', res)
      return Response.json({ success: false });
    }

  } catch (e) {
    console.log(e)
    return Response.json(
      { message: "An error occurred while get code.", e },
      { status: 500 }
    );
  }

}

export async function handleGetExecKpi(month: string, province?  :string) {
  const URL = process.env.NEXTAUTH_APP_API_URL_SSL;
  let res;
  const token = localStorage.getItem("accessToken");

  try {
    const urlApi = province && province.length > 0 ? URL + `/dashboard/dashboard-exec-kpi?month=${month}&&province=${province}` : URL + `/dashboard/dashboard-exec-kpi?month=${month}`;
    res = await fetch(
      urlApi,
      { headers: { "Authorization": `Bearer ${token}` } })
    if (res.status == 403) {
      signOut({ redirect: false });
      redirect("/login");
    }
    const data = await res.json()
    if (res) {
      return Response.json({
        success: true, result: data.result
      });
    } else {
      console.log('res', res)
      return Response.json({ success: false });
    }

  } catch (e) {
    console.log(e)
    return Response.json(
      { message: "An error occurred while get code.", e },
      { status: 500 }
    );
  }
}

export async function handleGetWebUser(userEmail: string) {

  const URL = process.env.NEXTAUTH_APP_API_URL_SSL;
  let res;
  const token = localStorage.getItem("accessToken");

  try {
    res = await fetch(
      URL + `/user-role/web-user?userEmail=${userEmail}`,
      { headers: { "Authorization": `Bearer ${token}` } })
    if (res.status == 403) {
      signOut({ redirect: false });
      redirect("/login");
    }
    const data = await res.json()
    if (res) {
      return Response.json({
        success: true, result: data.result
      });
    } else {
      console.log('res', res)
      return Response.json({ success: false });
    }

  } catch (e) {
    console.log(e)
    return Response.json(
      { message: "An error occurred while get code.", e },
      { status: 500 }
    );
  }
}

export async function handleGetUserRole(userEmail: string) {

  const URL = process.env.NEXTAUTH_APP_API_URL_SSL;
  let res;
  const token = localStorage.getItem("accessToken");

  try {
    res = await fetch(
      URL + `/user-role/get-user-role?userEmail=${userEmail}`,
      { headers: { "Authorization": `Bearer ${token}` } })
    if (res.status == 403) {
      signOut({ redirect: false });
      redirect("/login");
    }
    const data = await res.json()
    if (res) {
      return Response.json({
        success: true, result: data.roles
      });
    } else {
      console.log('res', res)
      return Response.json({ success: false });
    }

  } catch (e) {
    console.log(e)
    return Response.json(
      { message: "An error occurred while get code.", e },
      { status: 500 }
    );
  }
}

export async function handleUpdateUseRole(postData: any) {
  const URL = process.env.NEXTAUTH_APP_API_URL_SSL;
  console.log("postData", postData);
  let res;
  const token = localStorage.getItem("accessToken");

  try {
    res = await fetch(
      URL + `/user-role/update-user-role`,
      {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify(postData)

      })
    if (res.status == 403) {
      signOut({ redirect: false });
      redirect("/login");
    }
    const data = await res.json()
    if (res) {
      return Response.json({
        success: true, result: data.result
      });
    } else {
      console.log('res', res)
      return Response.json({ success: false });
    }

  } catch (e) {
    console.log(e)
    return Response.json(
      { message: "An error occurred while get code.", e },
      { status: 500 }
    );
  }

}


export async function handleGetExecKpiExcel(month: string, kpiType: string, provincePt: string = "") {
  const URL = process.env.NEXTAUTH_APP_API_URL_SSL;
  
  // Chuyển từ "MM/YYYY" → "01/MM/YYYY"
  const formattedMonth = `01/${month.replace("-", "/")}`; // Chuyển "03-2025" → "01/03/2025"
  const provinceQuery = provincePt ? `&provincePt=${provincePt}` : "";
  const apiUrl = `${URL}/dashboard/dashboard-export-excel-exec-kpi?month=${formattedMonth}&kpiType=${kpiType}${provinceQuery}`;

  console.log("📌 Gửi request đến API:", apiUrl);

  const token = localStorage.getItem("accessToken");

  try {
    console.log("📌 Token:", token);

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 403) {
      signOut({ redirect: false });
      redirect("/login");
      return;
    }

    const data = await res.json();
    console.log("📌 Phản hồi đầy đủ từ API:", data);

    if (res.ok && Array.isArray(data.result) && data.result.length > 0) {
      return Response.json({
        success: true,
        result: data.result,
      });
    } else {
      console.log("📌 Lỗi từ server: Không có dữ liệu");
      return Response.json({ success: false, message: "Không có dữ liệu Excel" });
    }
  } catch (e) {
    console.error("❌ Lỗi khi tải dữ liệu Excel:", e);
    return Response.json(
      { message: "Lỗi khi tải dữ liệu Excel", error: e },
      { status: 500 }
    );
  }
}
