import React from "react";
import ClickTextCapt from "@/app/(components)/ClickTextCapt";
import { useGithub } from "@/app/(components)/Hooks/useGithub";

const CaptchaPage = () => {
  return (
    <div>
      <div
        style={{
          marginTop: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ClickTextCapt />
      </div>
    </div>
  );
};

export default CaptchaPage;
