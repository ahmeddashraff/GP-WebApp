import React, { useEffect, useState } from 'react'
import './Home.css';
import CountUp from 'react-countup';
import axios from 'axios';
import { NavLink, useHistory } from 'react-router-dom/cjs/react-router-dom';

const Home = () => {
    let history = useHistory();
    const [statistics, setStatistics] = useState(null);
    let admin = JSON.parse(sessionStorage.getItem('admin'));
    let [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchUserLoading, setSearchUserLoading] = useState(false);

    const config = {
        headers: {
            Authorization: admin.token,
            'Content-Type': 'application/json',
        }
    };
    const performSearch = () => {
        setSearchUserLoading(true);
        setTimeout(() => {
            setSearchUserLoading(false);
            history.push(`/UserInfo/${searchQuery}`);
        }, 1000);
    };

    async function getStatistics() {
        setLoading(true);
        var { data } = await axios.get(`http://127.0.0.1:8000/api/admins/getStats`, config);
        if (data.success === true) {
            console.log(data.data.statistics);
            setStatistics(data.data.statistics);
            console.log(statistics);
            setLoading(false);
        }
    }
    useEffect(() => {
        getStatistics();
    }, []);

    const left_keyframes = `
    @keyframes left_progress {
        0% {
            stroke-dasharray: 0 100;
        }
        100% {
            stroke-dasharray: ${statistics && statistics.flooding_percentage} 100;
        }
    }
  `;
    const middle_keyframes = `
  @keyframes middle_progress {
      0% {
          stroke-dasharray: 0 100;
      }
      100% {
          stroke-dasharray: ${statistics && statistics.fire_percentage} 100;
      }
  }
`;
    const right_keyframes = `
@keyframes right_progress {
    0% {
        stroke-dasharray: 0 100;
    }
    100% {
        stroke-dasharray: ${statistics && statistics.potholes_percentage} 100;
    }
}
`;
    return (

        <section id="home" className="mt-5">
            <style>{left_keyframes}</style>
            <style>{middle_keyframes}</style>
            <style>{right_keyframes}</style>

            <div className="container">
                <div className="d-flex justify-content-center row align-items-center">
                    <div className="row  d-flex justify-content-center align-items-center">
                        <div className="col-md-6">
                            <div className="stat-box stat-box-upper text-light d-flex justify-content-between align-items-center p-5">
                                <div className='text-start'>
                                    {loading ? <h4><i className='fas fa-spinner fa-spin'></i></h4>
                                        :
                                        statistics && <h2 className='m-0 p-0'><CountUp start={0} end={statistics.total_reports} duration={1.5} /></h2>
                                    }
                                    <span className=''>Reports submitted</span>
                                </div>
                                <i class="fa-regular fa-file-lines fa-3x"></i>
                            </div>
                            <div className="stat-box stat-box-middle text-light d-flex justify-content-between align-items-center p-5">
                                <div className='text-start'>
                                    {loading ? <h4><i className='fas fa-spinner fa-spin'></i></h4>
                                        :
                                        statistics && <h2 className='m-0 p-0'><CountUp start={0} end={statistics.registered_users} duration={1.5} /></h2>}
                                    <span className=''>Users registered</span>
                                </div>
                                <i class="fa-solid fa-user fa-3x"></i>
                            </div>
                            <div className="stat-box stat-box-lower text-light d-flex justify-content-between align-items-center p-5">
                                <div className='text-start'>
                                    {loading ? <h4><i className='fas fa-spinner fa-spin'></i></h4>
                                        :
                                        statistics && <h2 className='m-0 p-0'><CountUp start={0} end={statistics.in_progress_reports} duration={1.5} /></h2>}
                                    <span className=''>Reports in progress</span>
                                </div>
                                <i class="fa-solid fa-list-check fa-3x"></i>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <h5 className="card-title">Add admin</h5>
                                            <p className="card-text">
                                                Go to Admin Control to add an admin
                                            </p>
                                            <NavLink to="/AdminControl" clNavLinkssName="card-link">Admin Control</NavLink>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <h5 className="card-title">Add gov user</h5>
                                            <p className="card-text">
                                                Go to Gov User Control to add a government user

                                            </p>
                                            <NavLink to="/GovUserControl" clNavLinkssName="card-link">Gov User Control</NavLink>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">

                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title mb-3">search for a user</h5>

                                            <div>
                                                <div className="input-group ">
                                                    <input onChange={(e) => setSearchQuery(e.target.value)} type="search" className="form-control form-control mb-3 me-2" placeholder="user id" />
                                                    <div className="input-group-append ">
                                                        <button onClick={performSearch} type="submit" className="btn btn-primary mb-3">

                                                            {searchUserLoading ? <i className='fas fa-spinner fa-spin'></i> : <i className="fa fa-search"></i>}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="row d-flex justify-content-center">
                    {loading ? <i className='fas fa-spinner fa-spin fa-2x mt-5'></i>
                        :
                        statistics && <>
                            <div className="col-md-4">
                                <div className="single-chart text-center d-flex align-items-center flex-column">
                                    <h6>% of flooding reports</h6>

                                    <svg viewBox="0 0 36 36" className="circular-chart" >
                                        <path className="circle-bg" d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <path className="circle run-animation-left" strokeDasharray="30, 100" d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <text x="51%" y="51%" className="percentage">{Number(statistics.flooding_percentage.toFixed(1))}%</text>
                                        <text className="small-text" x="51%" y="60%">reports</text> </svg>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="single-chart text-center d-flex align-items-center flex-column">
                                    <h6>% of fire and explosions reports</h6>

                                    <svg viewBox="0 0 36 36" className="circular-chart" style={{
                                        animation: 'progress2 1s ease-in-out infinite',
                                    }}>
                                        <path className="circle-bg" d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <path className="circle run-animation-middle" strokeDasharray="30, 100" d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <text x="51%" y="51%" className="percentage">{Number(statistics.fire_percentage.toFixed(1))}%</text>
                                        <text className="small-text" x="51%" y="60%">reports</text>
                                    </svg>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="single-chart text-center d-flex align-items-center flex-column">
                                    <h6>% of pothole reports</h6>
                                    <svg viewBox="0 0 36 36" className="circular-chart">
                                        <path className="circle-bg" d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <path className="circle run-animation-right" strokeDasharray="30, 100" d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <text x="51%" y="51%" className="percentage">{Number(statistics.potholes_percentage.toFixed(1))}%</text>
                                        <text className="small-text" x="51%" y="60%">reports</text> </svg>
                                </div>
                            </div>
                        </>
                    }
                </div>

            </div>
        </section >
    );
}

export default Home;