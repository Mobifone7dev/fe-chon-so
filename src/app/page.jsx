"use client";
import NumberTable from "@components/chonSo";

if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    const message = e?.message || '';
    if (message.includes('Loading chunk')) {
      // Reload lại trang để tải version mới
      window.location.reload();
    }
  });
}
const Page = (props) => {
  return (
      <div className="scene">
        <div className="flex flex-1">
          <div className="w-full h-full">
            <NumberTable />
          </div>
        </div>
      </div>

  );
};

export default Page;