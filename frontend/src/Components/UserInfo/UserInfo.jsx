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
    const [displayRestrictModal, setDisplayRestrictModal] = useState(false);

    const [restricted, setRestricted] = useState(false);
    const [banned, setBanned] = useState(false);

    const [restrictLoading, setRestrictLoading] = useState(false);
    const [banLoading, setBanLoading] = useState(false);

    const [pageLoading, setPageLoading] = useState(false);

    const [userNotFound, setUserNotFound] = useState(false);

    const { userId } = useParams();
    let admin = JSON.parse(sessionStorage.getItem('admin'));
    const [user, setUser] = useState(null);
    const [reports, setReports] = useState(null);

    const config = {
        headers: {
            Authorization: admin.token,
            'Content-Type': 'application/json',
        },
    };

    const handleModalOpen = (modalId, e) => {
        console.log(e.target.id)
        if (e.target.id === 'location-modal') {
            setActiveModalId(modalId);
            const matchedReport = reports.find(report => ('modal' + report.id) === modalId);
            if (matchedReport) {
                setModalContent(matchedReport);
            }
            setDisplayModal(true);
        }
        else {
            setActiveModalId(modalId);
            setDisplayRestrictModal(true);
        }
    };

    const handleModalClose = (event) => {
        if (event.target.className === "modal" || event.target.className === "close" || event.target.className === "restrict-modal modal" || event.target.className === "restrict-close") {
            setDisplayModal(false);
            setDisplayRestrictModal(false);
            setActiveModalId(null);
        }

    };

    async function getUser() {
        try {
            setPageLoading(true);
            var { data } = await axios.get(`http://127.0.0.1:8000/api/admins/users/show/${userId}`, config);
            if (data.data.user.status == 0) {
                setBanned(true);
            }
            else if (data.data.user.status == 2) {
                setRestricted(true);
            }
            setPageLoading(false);
            setUser(data.data.user)
        }
        catch (error) {
            setUserNotFound(true);
            setPageLoading(false);
            console.log('axios', error)
        }

    }

    async function getUserReports() {
        var { data } = await axios.get(`http://127.0.0.1:8000/api/admins/reports/getUserReports/${userId}`, config);
        setReports(data.data.reports)
    }

    async function handleRestriction(event) {
        event.preventDefault();
        setRestrictLoading(true);
        const selectedValue = event.target.elements.restriction_period.value;
        let restrictionPeriod = { restriction_period: selectedValue }
        var { data } = await axios.post(`http://127.0.0.1:8000/api/admins/users/restrict/${userId}`, restrictionPeriod, config);
        setRestrictLoading(false);
        const updatedUser = { ...user };
        updatedUser.status = 2;
        setUser(updatedUser);
        setRestricted(true);
        setBanned(false);
    }
    async function handleUnrestriction() {
        setRestrictLoading(true);
        var { data } = await axios.post(`http://127.0.0.1:8000/api/admins/users/unrestrict/${userId}`, {}, config);
        const updatedUser = { ...user };
        setRestrictLoading(false);
        updatedUser.status = 1;
        setUser(updatedUser);
        setRestricted(false);
        setBanned(false);
    }

    async function handleBanning() {
        setBanLoading(true);
        var { data } = await axios.post(`http://127.0.0.1:8000/api/admins/users/ban/${userId}`, {}, config);
        setBanLoading(false);
        const updatedUser = { ...user };
        updatedUser.status = 0;
        setUser(updatedUser);
        setBanned(true);
        setRestricted(false);
    }
    async function handleUnbanning() {
        setBanLoading(true);
        var { data } = await axios.post(`http://127.0.0.1:8000/api/admins/users/unban/${userId}`, {}, config);
        setBanLoading(false);
        const updatedUser = { ...user };
        updatedUser.status = 1;
        setUser(updatedUser);
        setBanned(false);
        setRestricted(false)
    }

    useEffect(() => {
        getUser();
        getUserReports();
    }, []);

    useEffect(() => {
        getUser();
    }, [restricted])

    return (
        <section id="profile">
            {pageLoading ? <i className='page-loading fas fa-spinner fa-spin fa-3x'></i> :  (
                !user ? <h1 className='not-found'>User Not Found</h1> : <>

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
                                            <p className="mb-0"><strong className="pr-1">Number of reports:</strong> {reports && reports.length}</p>
                                            <p className="mb-0">
                                                <strong className="pr-1">Status:</strong>
                                                {restricted ? (
                                                    <span className='text-warning'> restricted</span>
                                                ) : banned ? (
                                                    <span className='text-danger'> banned</span>
                                                ) : (
                                                    <span className='text-success'> active</span>
                                                )}
                                            </p>
                                            {restricted && <><p className="mb-0"><strong className="pr-1">Restricted until:</strong><span> {user && user.restricted_until}</span></p>
                                            </>}
                                            <p className="mb-0"><strong className="pr-1">Points:</strong> {user.points}</p>


                                            <div className='mt-2 d-flex justify-content-end'>
                                                {banned ? (<button className="btn btn-danger w-25 p-1" onClick={handleUnbanning}>
                                                    {banLoading ? <i className='fas fa-spinner fa-spin'></i> : 'Unban'}
                                                </button>)
                                                    : restricted ? (<>
                                                        <button onClick={handleUnrestriction} className="btn btn-warning text-light w-25 me-1 p-1 restrict-modal">
                                                            {restrictLoading ? <i className='fas fa-spinner fa-spin'></i> : 'Unrestrict'}
                                                        </button>
                                                        <button onClick={handleBanning} className="btn btn-danger w-25 p-1">
                                                            {banLoading ? <i className='fas fa-spinner fa-spin'></i> : 'Ban'}
                                                        </button>
                                                    </>
                                                    ) : (<>
                                                        <button onClick={(e) => handleModalOpen(user.id, e)} className="btn btn-warning text-light w-25 me-1 p-1 restrict-modal">
                                                            {restrictLoading ? <i className='fas fa-spinner fa-spin'></i> : 'Restrict'}
                                                        </button>
                                                        <button onClick={handleBanning} className="btn btn-danger w-25 p-1">
                                                            {banLoading ? <i className='fas fa-spinner fa-spin'></i> : 'Ban'}
                                                        </button></>)
                                                }
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
                                <div className="card shadow">
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
                                            <button className="btn btn-secondary " id='location-modal' onClick={(e) => handleModalOpen('modal' + report.id, e)}>View Location</button>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <small className="text-muted">Created at {new Date(report.created_at).toLocaleString("en-US", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        })}</small>
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

                {displayRestrictModal && <div className="restrictPopup">
                    <div onClick={handleModalClose} className="restrict-modal modal" style={{ display: 'block' }}>
                        <div className="modal-content">
                            <div className="contact-form">
                                <a onClick={handleModalClose} className="restrict-close">&times;</a>
                                <div className="popup-content">
                                    <p>restrict for:</p>
                                    <form onSubmit={handleRestriction} className='d-flex justify-content-center align-items-center'>
                                        <select name="restriction_period" className='form-select w-25 me-2'>
                                            <option value="12 h">12 hours</option>
                                            <option value="1 d">1 day</option>
                                            <option value="7 d">1 week</option>
                                            <option value="1 m">4 weeks</option>
                                        </select>
                                        <button className="btn btn-warning btn-md text-light">
                                            {restrictLoading ? <i className='fas fa-spinner fa-spin'></i> : 'Restrict'}
                                        </button>
                                    </form>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>}

            </>)
            }

        </section>



    );
}

export default UserInfo;