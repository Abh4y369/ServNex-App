import React, { useState } from "react";
import { FaUser, FaStore, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import { useForm } from "react-hook-form";
import AxiosInstance from "../Component/AxiosInstance";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
    const [activeTab, setActiveTab] = useState("user");
    const navigate = useNavigate();

    const { handleSubmit, register } = useForm();

    const submission = (data) => {
        console.log("Form data:", data);

        AxiosInstance.post("register/", {
            first_name: data.first_name,
            email: data.email,
            password: data.password,
            phone: data.phone,
            account_type: activeTab, // 👈 user | business
        })
            .then((res) => {
                console.log("Signup success:", res.data);

                // 🔑 Store tokens for auto-login
                if (res.data.access) {
                    localStorage.setItem("access", res.data.access);
                    localStorage.setItem("refresh", res.data.refresh);
                }

                // 🔀 Redirect based on account type
                if (activeTab === "business") {
                    navigate("/login-business");
                } else {
                    navigate("/");
                }
            })
            .catch((err) => {
                console.error("Signup error:", err.response?.data);
                alert(JSON.stringify(err.response?.data));
            });
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center min-vh-100"
            style={{
                background:
                    "linear-gradient(135deg, #3f71bc35, hsla(213, 86%, 42%, 0.54))",
            }}
        >
            <div
                className="card shadow-lg border-0 rounded-4 p-4"
                style={{ width: "420px" }}
            >
                <h4 className="text-center fw-bold mb-4">
                    Sign Up for{" "}
                    <span style={{ color: "#0f62c5" }}>
                        <strong>ServNex</strong>
                    </span>
                </h4>

                {/* Tabs */}
                <div className="btn-group w-100 mb-4">
                    <button
                        type="button"
                        className={`btn ${
                            activeTab === "user"
                                ? "text-white"
                                : "btn-outline-dark"
                        }`}
                        style={
                            activeTab === "user"
                                ? {
                                      background:
                                          "linear-gradient(135deg, #0a3a82, #0f62c5)",
                                  }
                                : {}
                        }
                        onClick={() => setActiveTab("user")}
                    >
                        <FaUser className="me-2" />
                        User Account
                    </button>

                    <button
                        type="button"
                        className={`btn ${
                            activeTab === "business"
                                ? "text-white"
                                : "btn-outline-dark"
                        }`}
                        style={
                            activeTab === "business"
                                ? {
                                      background:
                                          "linear-gradient(135deg, #0a3a82, #0f62c5)",
                                  }
                                : {}
                        }
                        onClick={() => setActiveTab("business")}
                    >
                        <FaStore className="me-2" />
                        Business Account
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(submission)}>
                    {/* Name / Business Name */}
                    <div className="input-group mb-3">
                        <span className="input-group-text">
                            <FaUser />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder={
                                activeTab === "user"
                                    ? "Enter full name"
                                    : "Business name"
                            }
                            {...register("first_name", { required: true })}
                        />
                    </div>

                    {/* Email */}
                    <div className="input-group mb-3">
                        <span className="input-group-text">
                            <FaEnvelope />
                        </span>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter email"
                            {...register("email", { required: true })}
                        />
                    </div>

                    {/* Password */}
                    <div className="input-group mb-3">
                        <span className="input-group-text">
                            <FaLock />
                        </span>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Create password"
                            {...register("password", { required: true })}
                        />
                    </div>

                    {/* Phone */}
                    <div className="input-group mb-4">
                        <span className="input-group-text">
                            <FaPhone />
                        </span>
                        <input
                            type="tel"
                            className="form-control"
                            placeholder="Enter phone number"
                            {...register("phone", { required: true })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn text-white w-100 py-2 rounded-pill fw-bold"
                        style={{
                            background:
                                "linear-gradient(135deg, #0a3a82, #0f62c5)",
                        }}
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-center mt-3 mb-0">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary fw-semibold" style={{textDecoration:"none"}}>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;