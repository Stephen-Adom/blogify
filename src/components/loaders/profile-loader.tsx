import React from "react";
import { Skeleton } from "primereact/skeleton";
import { Divider } from "primereact/divider";

export default function ProfileLoader() {
  return (
    <div className="card card-custom user-info-card">
      <div className="card-body">
        <Skeleton height="15rem"></Skeleton>
        <div className="profile-card-loader">
          <Skeleton width="10rem" height="8rem"></Skeleton>
        </div>
        <div className="row" style={{ marginTop: "20px" }}>
          <div className="col-2"></div>
          <div className="col-10">
            <div className="d-flex align-items-start justify-content-between">
              <section className="text-left">
                <Skeleton
                  width="15rem"
                  height="15px"
                  className="mb-2"
                ></Skeleton>
                <Skeleton
                  width="8rem"
                  height="10px"
                  className="mb-2"
                ></Skeleton>
              </section>

              <section className="d-flex align-items-center">
                <div className="mr-5">
                  <Skeleton
                    width="7rem"
                    height="15px"
                    className="mb-2"
                  ></Skeleton>
                  <Skeleton
                    width="2rem"
                    height="10px"
                    className="mb-2"
                  ></Skeleton>
                </div>

                <div className="mr-5">
                  <Skeleton
                    width="7rem"
                    height="15px"
                    className="mb-2"
                  ></Skeleton>
                  <Skeleton
                    width="2rem"
                    height="10px"
                    className="mb-2"
                  ></Skeleton>
                </div>

                <div>
                  <Skeleton
                    width="7rem"
                    height="15px"
                    className="mb-2"
                  ></Skeleton>
                  <Skeleton
                    width="2rem"
                    height="10px"
                    className="mb-2"
                  ></Skeleton>
                </div>
              </section>
              <section>
                <Skeleton
                  width="5rem"
                  height="20px"
                  className="mb-2"
                ></Skeleton>
              </section>
            </div>
          </div>
        </div>

        <section style={{ marginTop: "40px" }}>
          <Divider></Divider>
        </section>

        <section style={{ marginTop: "40px" }}>
          <Skeleton width="5rem" height="15px" className="mb-2"></Skeleton>
          <Skeleton height="3rem" className="mb-2"></Skeleton>
        </section>

        <section style={{ marginTop: "40px" }}>
          <Divider></Divider>
        </section>

        <section className="d-flex align-items-start justify-content-between">
          <Skeleton width="15rem" height="15px" className="mb-2"></Skeleton>

          <Skeleton width="15rem" height="15px" className="mb-2"></Skeleton>

          <Skeleton width="15rem" height="15px" className="mb-2"></Skeleton>

          <Skeleton width="15rem" height="15px" className="mb-2"></Skeleton>
        </section>

        <section style={{ marginTop: "40px" }}>
          <Skeleton height="5rem" className="mb-2"></Skeleton>
        </section>
      </div>
    </div>
  );
}
