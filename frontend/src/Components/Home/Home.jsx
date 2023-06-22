import React from 'react'
import './Home.css';





const Home = () => {

    return (

        <section id="home" className="mt-5">
            <div className="container">
                <div className="d-flex justify-content-center row align-items-center">
                    <div className="col-md-6">
                        <div className="stat-box bg-info">

                        </div>
                        <div className="stat-box bg-warning">

                        </div>
                        <div className="stat-box bg-info">

                        </div>
                        <div className="stat-box bg-warning">

                        </div>
                    </div>
                    <div className="col-md-6">
                        <div id="my_dataviz"></div>
                    </div>
                </div>

                <div className="row d-flex justify-content-center">
                    <div className="col-md-4">
                        <div className="single-chart text-center">
                            <h6>% of completed reports</h6>

                            <svg viewBox="0 0 36 36" className="circular-chart">

                                <path className="circle-bg" d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="circle run-animation" strokeDasharray="30, 100" d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <text x="51%" y="51%" className="percentage">30%</text>
                                <text className="small-text" x="51%" y="60%">reports</text> </svg>

                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="single-chart text-center">
                            <h6>% of completed reports</h6>

                            <svg viewBox="0 0 36 36" className="circular-chart">

                                <path className="circle-bg" d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="circle run-animation" strokeDasharray="30, 100" d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <text x="51%" y="51%" className="percentage">30%</text>
                                <text className="small-text" x="51%" y="60%">reports</text>
                            </svg>

                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="single-chart text-center">
                            <h6>% of completed reports</h6>
                            <svg viewBox="0 0 36 36" className="circular-chart">

                                <path className="circle-bg" d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="circle run-animation" strokeDasharray="30, 100" d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <text x="51%" y="51%" className="percentage">30%</text>
                                <text className="small-text" x="51%" y="60%">reports</text> </svg>
                            <div className="additional-info d-flex justify-content-between">
                                <p>incr. by <span><i className="fas fa-arrow-up"></i></span></p>
                                <p>decr. by</p>

                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </section>
    );
}

export default Home;