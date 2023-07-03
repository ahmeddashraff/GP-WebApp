import React, { useState } from 'react';
import img from '../../images/istockphoto-174662203-612x612.jpg';
import axios from 'axios';
import { useHistory } from 'react-router-dom';


const Modal = (props) => {

    let history = useHistory();
    const [isDoneloading, setIsDoneLoading] = useState(false);
    const [isInProgressloading, setIsInProgressLoading] = useState(false);
    const [rejectloading, setRejectLoading] = useState(false);

    const [isDone, setIsDone] = useState(props.modalContent.status == 1 ? true : false);
    const [isPending, setIsPending] = useState(props.modalContent.status == 2 ? true : false);

    const config = {
        headers: {
            Authorization: props.token,
            'Content-Type': 'application/json',
        },
    };

    const goToUserProfile = () => {
        const userId = props.modalContent.user_id;
        history.push(`/UserInfo/${userId}`);
    };

    async function updateStatus(status) {

        if(status == '0')
        {
            setIsInProgressLoading(true);
        }
        else{
            setIsDoneLoading(true);
        }
        var { data } = await axios.put(`http://127.0.0.1:8000/api/GovUsers/reports/updateStatus/${props.modalContent.id}`, { status: status }, config);
        if (data.success === true) {
            setIsDoneLoading(false);
            setIsInProgressLoading(false);
            if(status == '1'){
                setIsDone(true);
            }
            else
            {
                setIsDone(false);
                setIsPending(false);
            }
        }
    }

    async function handleRejection(e) {
        setRejectLoading(true);
        var { data } = await axios.delete(`http://127.0.0.1:8000/api/GovUsers/reports/delete/${props.modalContent.id}`, config);
        if (data.success === true) {
            setRejectLoading(false);
            setIsDone(true);
            props.onClose(e);
        }
    }


    return (
        <div className="popup">

            <div id={props.modalId} onClick={props.onClose} className="modal" style={{ display: 'block' }}>
                <div className="modal-content">
                    <div className="contact-form">
                        <a onClick={props.onClose} className="close">&times;</a>
                        <div className="popup-content">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96694.72154188987!2d-73.920
                                                47708718135!3d40.76840161175666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c
                                                2588f046ee661%3A0xa0b3281fcecc08c!2z2YXYp9mG2YfYp9iq2YbYjCDZhtmK2YjZitm
                                                I2LHZg9iMINin2YTZiNmE2KfZitin2Kog2KfZhNmF2KrYrdiv2Kk!5e0!3m2!1sar!2seg!4v1629519269234!5m2!1sar!2seg" width={'100%'}
                                style={{ border: 0 }} allowFullScreen="" loading="lazy" className="" height="250">
                            </iframe>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="info text-start pt-2">
                                    <p className="mb-1"><strong>Report ID:</strong> {props.modalContent.id}</p>
                                    <p className="mb-1"><strong>User ID:</strong> {props.modalContent.user_id}</p>
                                    <p className="mb-1"><strong>Date:</strong> {new Date(props.modalContent.created_at).toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    })}</p>
                                    <p className="mb-1"><strong>Status:</strong>{props.modalContent.status == 2 ? 'pending' : (props.modalContent.status == 1 ? 'done' : 'in progress')}</p>
                                    <p className="mb-1"><strong>Severity:</strong> {props.modalContent.severity == 1 ? 'critical' : 'not critical'}</p>
                                    <p className="mb-1"><strong>Incident type:</strong> {props.modalContent.type}</p>
                                    <p className="mb-1"><strong>User Description:</strong></p>
                                    <p>{props.modalContent.description}</p>
                                    {props.isGovUser ? (isDone ?
                                        <button className="btn btn-secondary mt-2" disabled>done</button>
                                        :
                                        (isPending ? <><button onClick={(e) => updateStatus(e.target.value)} value={0} className="btn btn-primary mt-2 me-1">{isInProgressloading ? <i className='fas fa-spinner fa-spin'></i> : 'accept'}</button>
                                            <button className="btn btn-secondary mt-2" id="reject" onClick={handleRejection}>{rejectloading ? <i className='fas fa-spinner fa-spin'></i> : 'reject'}</button></> : <button className="btn btn-secondary mt-2" value={1} onClick={(e) => updateStatus(e.target.value)}>
                                            {isDoneloading ? <i className='fas fa-spinner fa-spin'></i> : 'Mark as done'}
                                        </button>))

                                        :
                                        <button className="btn btn-secondary mt-2" onClick={goToUserProfile}>View User Profile</button>}

                                </div>
                                <img className="shadow mt-4" src={props.modalContent.image} alt="" width={'50%'} height={270} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Modal;