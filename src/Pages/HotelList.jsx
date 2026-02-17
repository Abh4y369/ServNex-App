import React, { useState, useEffect, useMemo } from "react";
import { Bell, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import axios from "axios";

export default function HotelList() {
    const [hotelsData, setHotelsData] = useState([]);
    const [city, setCity] = useState("All");
    const [search, setSearch] = useState("");
    const [badgeFilter, setBadgeFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    // Fetch hotels from Django
    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/hotels/")
            .then((res) => setHotelsData(res.data))
            .catch((err) => console.error("Error fetching hotels:", err))
            .finally(() => setLoading(false));
    }, []);

    // Filtering logic (optimized)
    const filteredHotels = useMemo(() => {
        return hotelsData.filter((hotel) => {
            const matchCity =
                city === "All" ||
                hotel.city?.toLowerCase() === city.toLowerCase();

            const matchSearch =
                !search ||
                hotel.name?.toLowerCase().includes(search.toLowerCase());

            const matchBadge =
                badgeFilter === "All" || hotel.badge === badgeFilter;

            return matchCity && matchSearch && matchBadge;
        });
    }, [hotelsData, city, search, badgeFilter]);

    // Dynamic city dropdown
    const uniqueCities = [
        ...new Set(hotelsData.map((h) => h.city).filter(Boolean)),
    ];

    // Badge styles
    const getBadgeClass = (badge) => {
        switch (badge) {
            case "Luxury Stays":
                return "bg-success-subtle text-success";
            case "Cheap & Best":
                return "bg-info-subtle text-info";
            case "Dormitory":
                return "bg-warning-subtle text-warning";
            default:
                return "bg-secondary-subtle text-dark";
        }
    };

    return (
        <div className="min-vh-100 bg-light">
            {/* HEADER */}
            <Box sx={{ flexGrow: 1 }}>
                <AppBar
                    position="sticky"
                    sx={{
                        background: "linear-gradient(135deg, #0a3a82, #0f62c5)",
                    }}
                >
                    <Toolbar>
                        <Typography
                            variant="h6"
                            sx={{ flexGrow: 1, fontWeight: 600 }}
                        >
                            <Link
                                to="/"
                                style={{
                                    textDecoration: "none",
                                    color: "white",
                                }}
                            >
                                ServNex
                            </Link>
                        </Typography>
                        <Bell size={22} color="white" />
                    </Toolbar>
                </AppBar>
            </Box>

            {/* FILTERS */}
            <div className="bg-white p-3 shadow-sm " style={{top: '64px', zIndex: 100}}>
                <div className="row g-2">
                    <div className="col-md-4 col-12">
                        <select
                            className="form-select"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        >
                            <option value="All">All Cities</option>
                            {uniqueCities.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-4 col-12">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search hotel..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="col-md-4 col-12">
                        <select
                            className="form-select"
                            value={badgeFilter}
                            onChange={(e) => setBadgeFilter(e.target.value)}
                        >
                            <option value="All">All Types</option>
                            <option value="Luxury Stays">Luxury Stays</option>
                            <option value="Cheap & Best">Cheap & Best</option>
                            <option value="Dormitory">Dormitory</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <main className="container py-4">
                <h6 className="fw-semibold mb-4">Featured Hotels ({filteredHotels.length})</h6>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : hotelsData.length === 0 ? (
                    <div className="text-center py-5 text-muted">No hotels available right now.</div>
                ) : filteredHotels.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        No hotels match your filters
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-4">
                        {filteredHotels.map((hotel) => (
                            <div
                                key={hotel.id}
                                className="card shadow-sm rounded-4 overflow-hidden border-0"
                            >
                                <div className="row g-0">
                                    {/* IMAGE */}
                                    <div className="col-md-4 col-12 position-relative">
                                        <img
                                            src={
                                                hotel.image ||
                                                "https://via.placeholder.com/400x300?text=Hotel"
                                            }
                                            alt={hotel.name}
                                            className="w-100 h-100 object-fit-cover"
                                            style={{
                                                minHeight: "220px",
                                            }}
                                        />
                                        <div className="position-absolute top-0 start-0 m-2">
                                             <span className={`badge rounded-pill ${getBadgeClass(hotel.badge)}`}>
                                                {hotel.badge}
                                            </span>
                                        </div>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="col-md-8 col-12">
                                        <div className="card-body d-flex flex-column h-100">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h5 className="card-title fw-bold mb-0 text-dark">
                                                    {hotel.name}
                                                </h5>
                                                {hotel.rating && ( 
                                                    <span className="badge bg-warning text-dark">
                                                        ★ {hotel.rating}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-muted small mb-2 d-flex align-items-center gap-1">
                                                <MapPin size={14} />
                                                {hotel.area}, {hotel.city}
                                            </div>

                                            {/* DESCRIPTION */}
                                            <p
                                                className="card-text text-muted small flex-grow-1"
                                                style={{
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                {hotel.description}
                                            </p>

                                            {/* PRICE + BUTTON */}
                                            <div className="d-flex justify-content-between align-items-end mt-3 border-top pt-3">
                                                <div>
                                                    <div className="text-muted small">Price per night</div>
                                                    <div className="fw-bold fs-5 text-primary">
                                                        ₹{Number(hotel.price).toLocaleString()}
                                                    </div>
                                                    {hotel.old_price && (
                                                        <div className="text-muted text-decoration-line-through small">
                                                            ₹{Number(hotel.old_price).toLocaleString()}
                                                        </div>
                                                    )}
                                                </div>

                                                <Link
                                                    to={`/hotel/${hotel.id}`}
                                                    className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2"
                                                >
                                                    See Details
                                                    <ArrowRight size={16} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}