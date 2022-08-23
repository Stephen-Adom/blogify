import React from "react";
import { Skeleton } from "primereact/skeleton";

export default function PostLoader() {
  return (
    <section>
      <div className="card card-custom post-card">
        <div className="card card-body">
          <div className="d-flex justify-content-between mb-3">
            <div className="d-flex align-items-center">
              <Skeleton
                borderRadius="10px"
                width="5rem"
                height="5rem"
                className="mr-2"
              ></Skeleton>
              <div>
                <Skeleton width="10rem" className="mb-2"></Skeleton>
                <Skeleton width="5rem" className="mb-2"></Skeleton>
              </div>
            </div>
            <Skeleton width="2rem" height="2rem" className="mb-2"></Skeleton>
          </div>
          <Skeleton width="100%" height="250px"></Skeleton>
          <div className="d-flex justify-content-between mt-5">
            <Skeleton width="7rem" height="3rem"></Skeleton>
            <Skeleton width="7rem" height="3rem"></Skeleton>
            <Skeleton width="7rem" height="3rem"></Skeleton>
            <Skeleton width="7rem" height="3rem"></Skeleton>
          </div>
        </div>
      </div>

      <div className="card card-custom post-card">
        <div className="card card-body">
          <div className="d-flex justify-content-between mb-3">
            <div className="d-flex align-items-center">
              <Skeleton
                borderRadius="10px"
                width="5rem"
                height="5rem"
                className="mr-2"
              ></Skeleton>
              <div>
                <Skeleton width="10rem" className="mb-2"></Skeleton>
                <Skeleton width="5rem" className="mb-2"></Skeleton>
              </div>
            </div>
            <Skeleton width="2rem" height="2rem" className="mb-2"></Skeleton>
          </div>
          <Skeleton width="100%" height="250px"></Skeleton>
          <div className="d-flex justify-content-between mt-5">
            <Skeleton width="7rem" height="3rem"></Skeleton>
            <Skeleton width="7rem" height="3rem"></Skeleton>
            <Skeleton width="7rem" height="3rem"></Skeleton>
            <Skeleton width="7rem" height="3rem"></Skeleton>
          </div>
        </div>
      </div>
    </section>
  );
}
