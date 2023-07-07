import React, { useMemo, useEffect, useState } from 'react'
import './UserInfo.css';
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/js/bootstrap.js';
import img from '../../images/istockphoto-174662203-612x612.jpg';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useParams } from 'react-router-dom';
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import axios from 'axios';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { myGlobalVariable } from '../../globalVariables.js';

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


    let history = useHistory();


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

    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                history.push('/SignIn');
            }
            return Promise.reject(error);
        }
    );

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
            var { data } = await axios.get(`http://${myGlobalVariable}/api/admins/users/show/${userId}`, config);
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
        try {
            var { data } = await axios.get(`http://${myGlobalVariable}/api/admins/reports/getUserReports/${userId}`, config);
            setReports(data.data.reports)
        }
        catch (error) {

        }
    }

    async function handleRestriction(event) {
        event.preventDefault();
        setRestrictLoading(true);
        const selectedValue = event.target.elements.restriction_period.value;
        let restrictionPeriod = { restriction_period: selectedValue }
        try {
            var { data } = await axios.post(`http://${myGlobalVariable}/api/admins/users/restrict/${userId}`, restrictionPeriod, config);
            setRestrictLoading(false);
            const updatedUser = { ...user };
            updatedUser.status = 2;
            setUser(updatedUser);
            setRestricted(true);
            setBanned(false);
        }
        catch (error) {

        }
    }
    async function handleUnrestriction() {
        setRestrictLoading(true);
        try {
            var { data } = await axios.post(`http://${myGlobalVariable}/api/admins/users/unrestrict/${userId}`, {}, config);
            const updatedUser = { ...user };
            setRestrictLoading(false);
            updatedUser.status = 1;
            setUser(updatedUser);
            setRestricted(false);
            setBanned(false);
        }
        catch (error) {

        }
    }

    async function handleBanning() {
        setBanLoading(true);
        try {
            var { data } = await axios.post(`http://${myGlobalVariable}/api/admins/users/ban/${userId}`, {}, config);
            setBanLoading(false);
            const updatedUser = { ...user };
            updatedUser.status = 0;
            setUser(updatedUser);
            setBanned(true);
            setRestricted(false);
        }
        catch (error) {

        }
    }
    async function handleUnbanning() {
        setBanLoading(true);
        try {
            var { data } = await axios.post(`http://${myGlobalVariable}/api/admins/users/unban/${userId}`, {}, config);
            setBanLoading(false);
            const updatedUser = { ...user };
            updatedUser.status = 1;
            setUser(updatedUser);
            setBanned(false);
            setRestricted(false)
        }

        catch (error) {

        }
    }

    let [pointInput, setPointsInput] = useState('');
    function handlePointsChange(e) {
        setPointsInput(e.target.value);
        console.log('this is points input ', pointInput);
    }

    async function handlePoints() {
        try {
            let points = parseInt(pointInput);
            console.log(points);
            var { data } = await axios.put(`http://${myGlobalVariable}/api/admins/users/addPoints/${userId}`, { points: points }, config);
            const updatedUser = { ...user };
            updatedUser.points = points + user.points;
            setUser(updatedUser);
        }

        catch (error) {

        }
    }

    useEffect(() => {
        getUser();
        getUserReports();
    }, []);

    useEffect(() => {
        getUser();
    }, [restricted])

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    });
    const center = useMemo(() => ({ lat: 26.8206, lng: 32.8663 }), []);
    const [map, setMap] = useState(null);

    const onLoad = (map) => {
        setMap(map);
    };

    const onUnmount = () => {
        setMap(null);
    };

    // Only show the marker when the map is loaded
    const showMarker = (longitude, latitude) => {
        if (map) {
            return <Marker position={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }} />;
        }
    };
    return (
        <section id="profile">
            {pageLoading ? <i className='page-loading fas fa-spinner fa-spin fa-3x'></i> : (
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
                                                <p className="mb-0"><strong className="pr-1">Number of fake reports:</strong> {user.number_of_fake_reports}</p>

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
                                        <div className="d-flex align-items-center">
                                            <input onChange={handlePointsChange} placeholder="Enter points" type="number" className="p-1" name="points" id="points" />
                                            <button type="submit" className="btn btn-dark ml-1 ms-2 p-1 points-btn" onClick={handlePoints}>Add points</button>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>

                        <div className="user-reports w-100 my-4">
                            <h3 className="mb-4"> User reports</h3>
                            <div className="mt-2 d-flex justify-content-center align-items-center text-start w-100">
                                <div className="row w-100 g-0">

                                    {reports && reports.map(report => (
                                        <div className="card shadow col-4">
                                            <img className="card-img-top" src={report.image}
                                                alt="Card image cap" />
                                            <div className="card-body">
                                                <h5 className="card-title">Report #{report.report_id}</h5>
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
                    </div>

                    {displayModal && <div className="popup">
                        <div id={props.modalId} onClick={handleModalClose} className="modal" style={{ display: 'block' }}>
                            <div className="modal-content">
                                <div className="contact-form">
                                    <a onClick={handleModalClose} className="close">&times;</a>
                                    <div className="popup-content">

                                        <div className="map w-100">
                                            <GoogleMap
                                                mapContainerClassName="map-container"
                                                center={center}
                                                zoom={5.5}
                                                onLoad={onLoad}
                                                onUnmount={onUnmount}
                                            >
                                                {showMarker(modalContent.longitude, modalContent.latitude)}
                                            </GoogleMap>
                                        </div>
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