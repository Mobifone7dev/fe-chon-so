const API_URL = process.env.NEXTAUTH_APP_API_URL_SSL;
const CHECK_PACKAGE_URL = `${API_URL}/website/package`;
const CHECK_TYPE_URL = `${API_URL}/website/type`;



export const getSearchTypeSubscriber = async (e) => {

  const response = await fetch(`${CHECK_TYPE_URL}?isdn=${e}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 10 },
  });
  const responseBody = await response.json();
  return responseBody;
};
export function getQSParamFromURL(key, url) {
  if (!url) return "";
  const search = new URL(url).search;
  const urlParams = new URLSearchParams(search);
  return urlParams.get(key);
}
export const convertToFloat2Fixed = (number) => {
  if (!Number(number)) return "0";

  const num = parseFloat(number);
  const formatted = num.toLocaleString("en-US", {
    minimumFractionDigits: num % 1 === 0 ? 0 : 2, // Nếu là số nguyên, không hiển thị thập phân
    maximumFractionDigits: 2,
  });

  return formatted;
};
export const convertToFloat2FixedNumber = (number) => {
  if (!Number(number)) return 0;

  const num = parseFloat(number);
  return num % 1 === 0 ? num : Number(num.toFixed(2));
};
export const formatIntegerWithCommas = (number) => {
  if (!Number(number)) return "0";
  return parseInt(number).toLocaleString("en-US");
};
export function daysInMonth(dateInput) {
  return new Date(dateInput.getFullYear(), dateInput.getMonth() + 1, 0).getDate();
}
 export function changeFormatDateFirstDateInMonth (date) {
const yyyy = date.getFullYear();
let mm = date.getMonth() + 1; // Months start at 0!
let dd = date.getDate();

if (dd < 10) dd = '01';
if (mm < 10) mm = '0' + mm;

const formattedDate = dd + '-' + mm + '-' + yyyy;

return formattedDate;
}

export function getFormattedDate(date) {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');

  return day + '/' + month + '/' + year;
}


