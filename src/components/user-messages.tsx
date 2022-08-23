import React from "react";

function UserMessages() {
    return (
        <section>
            <section className="d-flex align-items-center justify-content-between" style={{ marginTop: '23px' }}>
                <h6 className="font-weight-bold text-muted">MESSAGES</h6>
                <button className="btn btn-link" type="button">See All</button>
            </section>

            <div className="card card-custom messages-card">
                <div className="card-body" style={{ padding: '30px 18px 15px 18px !important' }}>
                    <div className="form-group mb-0">
                        <div className="input-icon">
                            <input type="text" className="form-control form-control-solid" placeholder="Search..." />
                            <span><i className="fas fa-search icon-md"></i></span>
                        </div>
                    </div>

                    <section className="messages-list">
                        <div className="card card-custom user-message">
                            <div className="card-body">
                                <div className="symbol symbol-40 mr-3">
                                    <img alt="Pic" src={require("../assets/users/300_22.jpg")} />
                                </div>
                                <div>
                                    <h5 className="mb-0 font-weight-bold">Arman Rokni</h5>
                                    <span className="text-muted">Active 4m Ago</span>
                                </div>
                            </div>
                        </div>

                        <div className="card card-custom user-message">
                            <div className="card-body">
                                <div className="symbol symbol-40 mr-3">
                                    <img alt="Pic" src={require("../assets/users/300_21.jpg")} />
                                </div>
                                <div>
                                    <h5 className="mb-0 font-weight-bold">Afshin T2Y</h5>
                                    <span className="text-muted">Active 4m Ago</span>
                                </div>
                            </div>
                        </div>

                        <div className="card card-custom user-message">
                            <div className="card-body">
                                <div className="symbol symbol-40 mr-3">
                                    <img alt="Pic" src={require("../assets/users/300_20.jpg")} />
                                </div>
                                <div>
                                    <h5 className="mb-0 font-weight-bold">Sepide Moqadasi</h5>
                                    <span className="text-muted">Active 4m Ago</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </section>
    )
}

export default UserMessages;