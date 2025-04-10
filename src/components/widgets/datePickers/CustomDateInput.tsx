/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/display-name */

import { forwardRef, useState } from "react";

const CustomDateInput = forwardRef(({ value, onClick }: any, ref: any) => (
  <>
    <label className="form-control form-control-md" onClick={onClick} ref={ref}>
      <div className="d-flex justify-content-between align-items-center">
        <span>{value}</span>
        <i className="bi bi-calendar3 text-gray-500 fs-1"></i>
        {/* <KTSVG path='/media/icons/duotune/font-awesome/calendar.svg' className='svg-icon-1' /> */}
      </div>
    </label>
  </>
));
export default CustomDateInput;
