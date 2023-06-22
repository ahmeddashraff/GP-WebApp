import axios from "axios";
import React, { useEffect, useState } from "react";
import "./AdminControl.css";
const AdminControl = () => {

    const [displayModal, setDisplayModal] = useState(false);
    const [activeModalId, setActiveModalId] = useState(null);
    const [modalContent, setModalContent] = useState(null);


    let admin = JSON.parse(localStorage.getItem('admin'));
    const [admins, setAdmins] = useState(null);


    const handleModalOpen = (modalId) => {
        setActiveModalId(modalId);
        const matchedAdmin = admins.find(admin => ('modal' + admin.id) === modalId);
        if (matchedAdmin) {
            setModalContent(matchedAdmin);
            console.log('matched');
        }
        console.log(modalContent);
        setDisplayModal(true);
        console.log('Modal opened', modalId);
    };

    const handleModalClose = (event) => {
        if (event.target.className === "modal" || event.target.className === "close") {
            setDisplayModal(false);
            setActiveModalId(null);
        }

    };


    async function getAdmins() {
        const config = {
            headers: {
                Authorization: admin.token,
                'Content-Type': 'application/json',
            },
        };
        // console.log(admin.token);
        var { data } = await axios.get(`http://127.0.0.1:8000/api/admins/getAllAdminsInDepartment/${admin.department_loc}`, config);
        setAdmins(data.data.admins)
    }

    useEffect(() => {
        getAdmins();
    }, []);

    return (
        <section id="AdminControl">
            <div className="w-100">

                <div className="row g-0">
                    <div className="col-lg-10 mx-auto">
                        <div className="d-flex justify-content-between align-items-center search">
                            <input type="text" className="form-control w-25" placeholder="search for a report" />
                            <div>
                                <label className="me-1"><strong>Sort By:</strong> </label>
                                <select name="sort">
                                    <option>newest to oldest</option>
                                    <option>oldest to newest</option>
                                </select>

                                <label className="me-1"><strong>Filter By</strong> </label>
                                <select name="sort">
                                    <option>newest to oldest</option>
                                    <option>oldest to newest</option>
                                </select>
                            </div>
                        </div>
                        <div className="rounded shadow bg-white">

                            <div className="table-responsive">
                                <table className="table table-fixed table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="col-1 table-header">ID</th>
                                            <th scope="col" className="col-3 table-header">Name</th>
                                            <th scope="col" className="col-2 table-header">Phone Number</th>
                                            <th scope="col" className="col-2 table-header">Email</th>
                                            <th scope="col" className="col-2 table-header">National ID</th>
                                            <th scope="col" className="col-2 table-header">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {admins && admins.map(admin => (
                                            <tr key={admin.id}>
                                                <th scope="row" className="col-1">{admin.id}</th>
                                                <td className="col-3">{admin.full_name}</td>
                                                <td className="col-2">{admin.phone_number}</td>
                                                <td className="col-2">{admin.email}</td>
                                                <td className="col-2">{admin.national_id}</td>

                                                <td className="col-2"><i onClick={() => handleModalOpen('modal' + admin.id)} data-modal={"modal" + admin.id} className="fa-solid fa-circle-info" style={{ color: '#9aaac6', fontSize: 20 }}></i></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
                {displayModal && <div className="popup">
                    <div id={activeModalId} onClick={handleModalClose} className="modal" style={{ display: 'block' }}>
                        <div className="modal-content">
                            <div className="contact-form">
                                <a onClick={handleModalClose} className="close">&times;</a>
                                <div className="popup-content">
                                    <h3>type is {modalContent.full_name}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
                }
            </div>
        </section>);
}

export default AdminControl;