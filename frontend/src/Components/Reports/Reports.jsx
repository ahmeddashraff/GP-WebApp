import React, { useEffect, useState } from "react";
import '@fortawesome/fontawesome-free/css/all.css';
import img from '../../images/istockphoto-174662203-612x612.jpg';

// Import Font Awesome CSS

import './Reports.css';
import Modal from "./Modal";
import axios from 'axios';

// window.$ = window.jQuery = jQuery;


const Reports = (props) => {

    const [displayModal, setDisplayModal] = useState(false);
    const [activeModalId, setActiveModalId] = useState(null);
    const [reports, setReports] = useState(null);
    const [modalContent, setModalContent] = useState(null);

    let admin = JSON.parse(localStorage.getItem('admin'));

    const handleModalOpen = (modalId) => {
        setActiveModalId(modalId);
        const matchedReport = reports.find(report => ('modal'+report.id) === modalId);
        if (matchedReport) {
            setModalContent(matchedReport);
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

    async function getReports() {
        const config = {
            headers: {
                Authorization: admin.token,
                'Content-Type': 'application/json',
            },
        };
        console.log(admin.token);
        var { data } = await axios.get(`http://127.0.0.1:8000/api/admins/reports/`, config);
        setReports(data.data.reports)
    }

    useEffect(() => {
        getReports();
    }, []);

    useEffect(() => {
        console.log(modalContent);
    }, [modalContent]);

    return (
        // <div><h1>Reports</h1></div> 
        <section id="reports">
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
                                            <th scope="col" className="col-3 table-header">User ID</th>
                                            <th scope="col" className="col-3 table-header">Incident Type</th>
                                            <th scope="col" className="col-3 table-header">Date</th>
                                            <th scope="col" className="col-3 table-header">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reports && reports.map(report => (
                                            <tr key={report.id}>
                                                <th scope="row" className="col-3">{report.user_id}</th>
                                                <td className="col-3">{report.type}</td>
                                                <td className="col-3">{report.created_at}</td>
                                                <td className="col-3"><i onClick={() => handleModalOpen('modal' + report.id)} data-modal={"modal" + report.id} className="fa-solid fa-circle-info" style={{ color: '#9aaac6', fontSize: 20 }}></i></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>

                </div>
                {displayModal && (
                    <Modal modalId={activeModalId} {...props} modalContent={modalContent} onClose={handleModalClose} />
                )}
            </div>





        </section>
    );
}

export default Reports;