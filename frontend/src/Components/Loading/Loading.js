import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
export default function Loading() {
  return (
    <div className="loading-component">
      <CircularProgress
        variant="indeterminate"
        disableShrink
        style={{
          color: "#6798e5",
          animationDuration: "550ms"
        }}
        size={24}
        thickness={4}
      />
    </div>
  );
}
