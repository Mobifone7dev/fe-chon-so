import { IonIcon } from "@ionic/react";
import React, { useState, useEffect, FC } from "react";
import { closeCircleOutline } from "ionicons/icons";
type PropsType = {
  textSearch: string;
  callback: (e: any) => void;
  textHolder?: string;
};
const SearchHeader: FC<PropsType> = ({
  textSearch,
  callback,
  textHolder,
}: any) => {
  const [keywords, setKeywords] = useState<string>(textSearch || "");

  useEffect(() => {
    if (keywords) {
    }
  }, [keywords]);

  const submitSearch = (e: any) => {
    if (e.key === "Enter") {
      (document.activeElement as HTMLElement).blur();
      callback(keywords);
    }
  };

  return (
    <div className="search-header">
      <div className="search-text">
        {keywords.length > 0 && (
          <button className="clearF" onClick={() => setKeywords("")}>
            <IonIcon className="ion-icon" icon={closeCircleOutline}></IonIcon>
          </button>
        )}
        <i className="icon-search"></i>
        <input
          type="text"
          name="searchName"
          placeholder={textHolder ? textHolder : "Nhập thông tin ..."}
          value={keywords || ""}
          onChange={(e: any) => setKeywords(e.target.value)}
          onKeyDown={(e: any) => submitSearch(e)}
        />
      </div>
      <button
        className="search-submit"
        onClick={() => {
          callback(keywords);
        }}
      >
        Tìm kiếm
      </button>
    </div>
  );
};
export default SearchHeader;
