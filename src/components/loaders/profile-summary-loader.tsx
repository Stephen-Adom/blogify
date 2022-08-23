import React from "react";
import { Skeleton } from "primereact/skeleton";

export default function ProfileSummaryLoader() {
  return (
    <div className="card card-custom profile-summary-card">
      <div className="card-body">
        <Skeleton
          borderRadius="10px"
          width="5rem"
          height="5rem"
          className="mr-2"
        ></Skeleton>
        <div>
          <Skeleton width="15rem" className="mb-2"></Skeleton>
          <Skeleton width="7rem" className="mb-2"></Skeleton>
        </div>
      </div>
    </div>
  );
}
