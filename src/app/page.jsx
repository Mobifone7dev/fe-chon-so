"use client";
import NumberTable from "@components/chonSo";
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