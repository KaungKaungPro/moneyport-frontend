import React from "react";
import { Outlet } from "react-router-dom";

function LearningCenterLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default LearningCenterLayout;
