import React from 'react'
import Footer from '../Component/Footer'
import "../Pages/Landing.css"
import Hotel from "../assets/hotel-illu.png"
import Restaurant from "../assets/resta.png"
import Saloon from "../assets/Saloon.png"
import Home from "../assets/HomeService.png"
import Health from "../assets/Health.png"
import Transport from "../assets/Transport.png"
import Header from '../Component/Header'
import { Link } from 'react-router-dom'

function Landing() {
    return (
        <>
            <Header />
            <div className='w-100' style={{ minHeight: "90vh" }}>
                {/* <div className='text-center py-4'>
                    <h2 className='fw-medium'>All Services. One App.</h2>
                    <p>Book, Manage and discover services around you with ServNex</p>
                </div> */}
                <section class="py-5 bg-light" style={{ minHeight: "90vh" }}>
                    <div class="container">

                        {/* <!-- Heading --> */}
                        <div class="text-center mb-5">
                            <h1 class="fw-medium">All Services. One App.</h1>
                            <p class="text-black fs-5">
                                Book, manage and discover services around you with <span style={{ color: " #0f62c5" }}><strong>ServNex</strong></span>
                            </p>
                        </div>

                        {/* <!-- Cards Grid --> */}
                        <div class="row g-4 mt-5">

                            {/* <!-- Hotel --> */}
                            <div class="col-lg-4 col-md-6">
                                <div class="service-card text-center p-4 h-100 position-relative">
                                    <img src={Hotel} width={"200px"} class="mb-3 service-icon" />
                                    <h4 class="fw-bold">Hotels</h4>
                                    <p class="text-muted">Book stays instantly</p>
                                    <a href="/hotel" className='stretched-link'></a>
                                </div>
                            </div>

                            {/* <!-- Restaurants --> */}
                            <div class="col-lg-4 col-md-6">
                                <div class="service-card text-center p-4 h-100 position-relative">
                                    <img src={Restaurant} width={"200px"} class="mb-3 service-icon" />
                                    <h4 class="fw-bold">Restaurants</h4>
                                    <p class="text-muted">Reserve tables</p>
                                    <a href="/restaurant" className='stretched-link'></a>
                                </div>
                            </div>

                            {/* <!-- Salons --> */}
                            <div class="col-lg-4 col-md-6">
                                <div class="service-card text-center p-4 h-100">
                                    <img src={Saloon} width={"200px"} class="mb-3 service-icon" />
                                    <h4 class="fw-bold">Saloons</h4>
                                    <p class="text-muted">Book grooming</p>
                                </div>
                            </div>

                            {/* <!-- Home Services --> */}
                            <div className="col-lg-4 col-md-6">
                                <div className="coming-card text-center p-4 h-100 position-relative">

                                    {/* Coming Soon Ribbon */}
                                    <div className="coming-ribbon">
                                        <div className="ribbon-track">
                                            <span>COMING SOON • COMING SOON • COMING SOON •</span>
                                            <span>COMING SOON • COMING SOON • COMING SOON •</span>
                                        </div>
                                    </div>

                                    <img src={Home} width="200px" className="mb-3 service-icon" />
                                    <h4 className="fw-bold">Home Services</h4>
                                    <p className="text-muted">Cleaning & repairs</p>

                                </div>
                            </div>


                            {/* <!-- Health --> */}
                            <div className="col-lg-4 col-md-6">
                                <div className="coming-card text-center p-4 h-100 position-relative">

                                    {/* Coming Soon Ribbon */}
                                    <div className="coming-ribbon">
                                        <div className="ribbon-track">
                                            <span>COMING SOON • COMING SOON • COMING SOON •</span>
                                            <span>COMING SOON • COMING SOON • COMING SOON •</span>
                                        </div>
                                    </div>

                                    <img src={Health} width={"200px"} class="mb-3 service-icon" />
                                    <h4 class="fw-bold">Health</h4>
                                    <p class="text-muted">Clinics & labs</p>
                                </div>
                            </div>

                            {/* <!-- Transport --> */}
                            <div className="col-lg-4 col-md-6">
                                <div className="coming-card text-center p-4 h-100 position-relative">

                                    {/* Coming Soon Ribbon */}
                                    <div className="coming-ribbon">
                                        <div className="ribbon-track">
                                            <span>COMING SOON • COMING SOON • COMING SOON •</span>
                                            <span>COMING SOON • COMING SOON • COMING SOON •</span>
                                        </div>
                                    </div>

                                    <img src={Transport} width={"200px"} class="mb-3 service-icon" />
                                    <h4 class="fw-bold">Transport</h4>
                                    <p class="text-muted">Quick travel</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

            </div>
            <Footer />
        </>
    )
}

export default Landing