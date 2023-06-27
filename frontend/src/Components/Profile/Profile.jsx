import React from "react";
import "./Profile.css";
const Profile = () => {

    let admin = JSON.parse(localStorage.getItem('admin'));
    return (
        <div id="Profile">
            <div className="d-flex justify-content-center align-items-center">
                <div className="" style={{ width: "50%" }}>
                    <div className="d-flex align-items-center flex-column">
                        <img
                            src="https://bootdey.com/img/Content/avatar/avatar6.png"
                            className="img-circle profile-avatar mb-3"
                            alt="User avatar"
                        />
                        <h2 className="text-center">Mohammed Khaled Sabrah</h2>
                    </div>
                </div>
                <div style={{ width: "50%" }} className="">
                    <div className="d-flex align-items-start flex-column text-start">
                        <div className="mb-3 fa-3x">Admin information</div>
                        <div className="d-flex justify-content-start fs-5 align-items-center">
                            <i className="fas fa-envelope"></i>
                            <strong className="bold">
                                Email:
                            </strong>
                            <p className="mb-0">{admin.email}</p>
                        </div>
                        <div className="d-flex justify-content-start fs-5  align-items-center">
                            <i className="fas fa-mobile-alt"></i>
                            <strong className="bold">
                                Phone:
                            </strong>
                            <p className="mb-0">{admin.phone_number}</p>
                        </div>
                        <div className="d-flex justify-content-start fs-5  align-items-center">
                            <i className="far fa-gem"></i>
                            {admin.isGovUser ?
                                <><strong className="bold">
                                    Field:
                                </strong>
                                    <p className="mb-0">{admin.field}</p></>
                                :
                                <><strong className="bold">
                                    Role:
                                </strong>
                                    <p className="mb-0">{admin.role}</p></>}

                        </div>
                        <div className="d-flex justify-content-start fs-5  align-items-center">
                            <i className="far fa-user"></i>
                            <strong className="bold">
                                Status:
                            </strong>
                            {(admin.status == 0 ? <p className="mb-0 text-danger fw-2">inactive</p> : <p className="status mb-0 font-weight-bold text-success">active</p>)}

                        </div>
                        <div className="d-flex justify-content-start fs-5  align-items-center">
                            <i className="far fa-file"></i>
                            <strong className="bold">
                                Department:
                            </strong>
                            <p className="mb-0">{admin.department_loc}</p>
                        </div>
                        <div className="d-flex justify-content-start fs-5 align-items-center">
                            <i className="far fa-id-card"></i>
                            <strong className="bold">
                                National id:
                            </strong>
                            <p className="mb-0">{admin.national_id}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Profile;
