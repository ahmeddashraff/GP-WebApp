import React, { useEffect, useState } from 'react'
import './UserInfo.css';
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/js/bootstrap.js';
import img from '../../images/istockphoto-174662203-612x612.jpg';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useParams } from 'react-router-dom';
import axios from 'axios';
const UserInfo = (props) => {

    const [displayModal, setDisplayModal] = useState(false);
    const [activeModalId, setActiveModalId] = useState(null);
    const [modalContent, setModalContent] = useState(null);

    const { userId } = useParams();
    let admin = JSON.parse(localStorage.getItem('admin'));
    const [user, setUser] = useState(null);
    const [reports, setReports] = useState(null);

    const config = {
        headers: {
            Authorization: admin.token,
            'Content-Type': 'application/json',
        },
    };

    const handleModalOpen = (modalId) => {
        setActiveModalId(modalId);
        const matchedReport = reports.find(report => ('modal' + report.id) === modalId);
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

    async function getUser() {
        var { data } = await axios.get(`http://127.0.0.1:8000/api/admins/users/show/${userId}`, config);
        setUser(data.data.user)
    }

    async function getUserReports() {
        var { data } = await axios.get(`http://127.0.0.1:8000/api/admins/reports/getUserReports/${userId}`, config);
        setReports(data.data.reports)
    }

    useEffect(() => {
        getUser();
        getUserReports()
    }, []);

    return (
        <section id="profile">
            {user && <>

                <div className="container mt-5">

                    <div className="student-profile py-4">
                        <div className="container">
                            <div className="row">

                                <div className="col-lg-4">
                                    <div className="card shadow-sm">
                                        <div className="card-header bg-transparent text-center">
                                            <h3>{user.full_name && user.full_name.split(' ').slice(0, 2).join(' ')} </h3>
                                        </div>
                                        <div className="card-body text-start container user-info">
                                            <p className="mb-0"><strong className="pr-1">National ID:</strong> {user.national_id}</p>
                                            <p className="mb-0"><strong className="pr-1">User phone:</strong> {user.phone_number}</p>
                                            <p className="mb-0"><strong className="pr-1">User email:</strong> {user.email}</p>
                                            <p className="mb-0"><strong className="pr-1">Number of reports:</strong> 2</p>
                                            <p className="mb-0"><strong className="pr-1">Number of restrictions:</strong> 4</p>
                                            <p className="mb-0"><strong className="pr-1">Points:</strong> {user.points}</p>


                                            <div className='mt-2 d-flex justify-content-end'>
                                                <button className="btn btn-warning text-light w-25 me-1 p-1">
                                                    Restrict
                                                </button>
                                                <button className="btn btn-danger w-25 p-1">
                                                    Ban
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="col-lg-8">
                                    <div className="card shadow-sm">
                                        <div className="card-header bg-transparent border-0">
                                            <h3 className="mb-0"><i className="far fa-clone pr-1"></i>General Information</h3>
                                        </div>
                                        <div className="card-body pt-0">
                                            <table className="table table-bordered">

                                                <tr>
                                                    <th width="30%">Full Name</th>
                                                    <td width="2%">:</td>
                                                    <td>{user.full_name}</td>
                                                </tr>
                                                <tr>
                                                    <th width="30%">Year of birth</th>
                                                    <td width="2%">:</td>
                                                    <td>{user.year_of_birth}</td>
                                                </tr>
                                                <tr>
                                                    <th width="30%">Gender</th>
                                                    <td width="2%">:</td>
                                                    <td>{user.gender}</td>
                                                </tr>

                                                <tr>
                                                    <th width="30%">Address</th>
                                                    <td width="2%">:</td>
                                                    <td>{user.location}</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                    <div style={{ height: 18 }}></div>
                                    <form method="post" className=''>
                                        <div className="d-flex align-items-center">
                                            <input placeholder="Enter points" type="number" className="p-1" name="points" id="points" />
                                            <button type="submit" className="btn btn-dark ml-1 ms-2 p-1 points-btn">Add points</button>
                                        </div>
                                    </form>
                                </div>


                            </div>
                        </div>
                    </div>

                    <div className="user-reports w-100 my-4">
                        <h3 className="mb-4"> User reports</h3>
                        <div className="card-deck mt-2 d-flex justify-content-center align-items-center text-start">
                            {reports && reports.map(report => (
                                <div className="card">
                                    <img className="card-img-top" src={report.image}
                                        alt="Card image cap" />
                                    <div className="card-body">
                                        <h5 className="card-title">Report #{report.id}</h5>
                                        <p className="m-0"><strong>Status: </strong><span className="">{report.status == 0 ? 'In progress' : 'done'}</span></p>
                                        <p className="m-0"><strong>Severity: </strong><span>{report.severity}</span></p>
                                        <p className="m-0"><strong>Incident type:</strong> {report.type}</p>
                                        <p className="m-0"><strong>User Description:</strong></p>
                                        <p> {report.description}</p>
                                        <div className="d-flex justify-content-end">
                                            <button className="btn btn-secondary" onClick={() => handleModalOpen('modal' + report.id)}>View Location</button>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <small className="text-muted">Created at {report.created_at}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {displayModal && <div className="popup">
                    <div id={props.modalId} onClick={handleModalClose} className="modal" style={{ display: 'block' }}>
                        <div className="modal-content">
                            <div className="contact-form">
                                <a onClick={handleModalClose} className="close">&times;</a>
                                <div className="popup-content">
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96694.72154188987!2d-73.920
                                    47708718135!3d40.76840161175666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c
                                    2588f046ee661%3A0xa0b3281fcecc08c!2z2YXYp9mG2YfYp9iq2YbYjCDZhtmK2YjZitm
                                    I2LHZg9iMINin2YTZiNmE2KfZitin2Kog2KfZhNmF2KrYrdiv2Kk!5e0!3m2!1sar!2seg!4v1629519269234!5m2!1sar!2seg" width={'100%'}
                                        style={{ border: 0 }} allowFullScreen="" loading="lazy" className="" height="250">
                                    </iframe>
                                    {/* el mafrood el type dah yt3'yar le location*/}
                                    <h3>type is {modalContent.type}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
                }
            </>}

        </section>



    );
}

export default UserInfo;