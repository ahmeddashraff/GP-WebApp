import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { myGlobalVariable } from '../../globalVariables.js';


const Modal = (props) => {

    let history = useHistory();
    const [isDoneloading, setIsDoneLoading] = useState(false);
    const [isInProgressloading, setIsInProgressLoading] = useState(false);
    const [rejectloading, setRejectLoading] = useState(false);
    const [notApplicableLoading, setNotApplicableLoading] = useState(false);
    const [isDone, setIsDone] = useState(props.modalContent.status == 1 ? true : false);
    const [isPending, setIsPending] = useState(props.modalContent.status == 2 ? true : false);
    const [isRejected, setIsRejected] = useState(props.modalContent.status == 3 ? true : false);
    const [isWaiting, setIsWaiting] = useState(props.modalContent.status == 4 ? true : false);

    const [rejectMode, setRejectMode] = useState(false);
    const [notApplicableMode, setNotApplicableMode] = useState(false);

    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                history.push('/SignIn');
            }
            return Promise.reject(error);
        }
    );
    const config = {
        headers: {
            Authorization: props.token,
            'Content-Type': 'application/json',
        },
    };

    const handleRejectClick = () => {
        setRejectMode(true);
    };

    const goToUserProfile = () => {
        const userId = props.modalContent.user_id;
        history.push(`/UserInfo/${userId}`);
    };

    async function updateType(type) {
        setRejectLoading(true);
        try {
            var { data } = await axios.put(`http://${myGlobalVariable}/api/GovUsers/reports/updateReportType/${props.modalContent.id}`, { type: type, }, config);
            if (data.success === true) {
                setRejectLoading(false);
                setRejectMode(false);
            }
        } catch (error) {

        }


    }

    async function updateStatus(status, is_fake) {


        try {
            if (status == '0') {
                setIsInProgressLoading(true);
            }
            else if (status == '3') {
                setRejectLoading(true);
            }
            else if (status == '2') {
                setIsInProgressLoading(true);
            }
            else {
                setIsDoneLoading(true);
            }
            var { data } = await axios.put(`http://${myGlobalVariable}/api/GovUsers/reports/updateStatus/${props.modalContent.id}`, { status: status, is_fake: is_fake }, config);
            if (data.success === true) {
                setIsDoneLoading(false);
                setIsInProgressLoading(false);
                setRejectLoading(false);
                if (status == '1') {
                    setIsDone(true);
                }
                else if (status == '3') {
                    setIsRejected(true);
                }
                else if (status == '2') {
                    setIsPending(true);
                    setIsWaiting(false);
                }
                else {
                    setIsDone(false);
                    setIsWaiting(false);
                    setIsPending(false);
                }
            }
        }
        catch (error) {

        }
    }


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
    const showMarkerr = (longitude, latitude) => {
        if (map) {
            return <Marker position={{ lat: 26.310000, lng: 34.342000 }} />;
        }
    };

    return (
        <div className="popup">

            <div id={props.modalId} onClick={props.onClose} className="modal" style={{ display: 'block' }}>
                <div className="modal-content">
                    <div className="contact-form">
                        <a onClick={props.onClose} className="close">&times;</a>
                        <div className="popup-content">
                            <div className="map w-100 vh-25">
                                {isLoaded && (<GoogleMap
                                    mapContainerClassName="map-container"
                                    center={center}
                                    zoom={5.5}
                                    onLoad={onLoad}
                                    onUnmount={onUnmount}
                                >
                                    {showMarkerr(props.modalContent.longitude, props.modalContent.latitude)}
                                </GoogleMap>
                                )}

                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="info text-start pt-2">
                                    <p className="mb-1"><strong>Report ID:</strong> {props.modalContent.report_id}</p>
                                    <p className="mb-1"><strong>User ID:</strong> {props.modalContent.user_id}</p>
                                    <p className="mb-1"><strong>Date:</strong> {new Date(props.modalContent.created_at).toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    })}</p>
                                    <p className="mb-1"><strong>Status:</strong>{props.modalContent.status == 2 ? 'pending' : (props.modalContent.status == 1 ? 'done' : (props.modalContent.status == 3 ? 'Not Approved' : (props.modalContent.status == 4 ? 'Waiting' : 'in progress')))}</p>
                                    <p className="mb-1"><strong>Severity:</strong> {props.modalContent.severity == 1 ? 'critical' : 'not critical'}</p>
                                    <p className="mb-1"><strong>Incident type:</strong> {props.modalContent.type}</p>
                                    <p className="mb-1"><strong>User Description:</strong></p>
                                    <p>{props.modalContent.description}</p>
                                    {props.isGovUser ? (isDone ?
                                        <button className="btn btn-secondary mt-2" disabled>done</button>
                                        :
                                        (isRejected ? <button className="btn btn-danger mt-2" disabled>rejected</button> :
                                            ((isPending || isWaiting) ?
                                                <>
                                                    {!rejectMode ? (
                                                        <>
                                                            <button onClick={(e) => updateStatus(e.target.value)} value={isWaiting ? 2 : 0} className="btn btn-primary mt-2 me-1">
                                                                {isInProgressloading ? <i className='fas fa-spinner fa-spin'></i> : (isWaiting ? 'accept' : 'start operation')}
                                                            </button>
                                                            <button className="btn btn-secondary mt-2" onClick={handleRejectClick}>reject</button>
                                                        </>
                                                    ) : (
                                                        rejectloading ? <i className='fas fa-spinner fa-spin'></i> : ((!notApplicableMode ?
                                                            <div className='d-flex align-items-center justify-content-start mt-1'>
                                                                <strong>Why is it rejected? </strong>
                                                                <button className="btn btn-secondary ms-1  me-1" id="fake" value={3} onClick={(e) => updateStatus(e.target.value, true)}>Fake</button>
                                                                <button className="btn btn-secondary  me-1" id="na" onClick={() => setNotApplicableMode(true)}>N/A</button>
                                                                <button className="btn btn-secondary " onClick={() => setRejectMode(false)}>Cancel</button>
                                                            </div>
                                                            :
                                                            <div className='d-flex w-100 align-items-center justify-content-start mt-1 flex-column'>
                                                                <strong>What is the correct type of this incident?</strong>
                                                                <div className='d-flex justify-content-center'>
                                                                    <button className="btn btn-secondary  me-1"  value='fire' onClick={(e) => {updateType(e.target.value); setIsRejected(true)}}>Fire</button>
                                                                    <button className="btn btn-secondary  me-1"  value='fallen tree' onClick={(e) => {updateType(e.target.value); setIsRejected(true)}}>Fallen tree</button>
                                                                    <button className="btn btn-secondary  me-1"  value='flooding' onClick={(e) => {updateType(e.target.value); setIsRejected(true)}}>Flooding</button>
                                                                    <button className="btn btn-secondary  me-1"  value='pothole' onClick={(e) => {updateType(e.target.value); setIsRejected(true)}}>Pothole</button>

                                                                </div>

                                                            </div>

                                                        ))
                                                    )}
                                                </>
                                                :
                                                <button className="btn btn-secondary mt-2" value={1} onClick={(e) => updateStatus(e.target.value)}>
                                                    {isDoneloading ? <i className='fas fa-spinner fa-spin'></i> : 'Mark as done'}
                                                </button>)))

                                        :
                                        <button className="btn btn-secondary mt-2" onClick={goToUserProfile}>View User Profile</button>} 
                                </div>
                                <img className="shadow mt-4" src={props.modalContent.image} alt="" width={'50%'} height={270} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Modal;