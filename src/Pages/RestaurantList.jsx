import React, { useState, useEffect, useMemo } from "react";
import { Bell, MapPin, ArrowRight, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import axios from "axios";

export default function RestaurantList() {
    const [restaurantsData, setRestaurantsData] = useState([]);
    const [city, setCity] = useState("All");
    const [search, setSearch] = useState("");
    const [badgeFilter, setBadgeFilter] = useState("All");
    const [cuisineFilter, setCuisineFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    // Fetch restaurants from Django
    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/restaurants/")
            .then((res) => setRestaurantsData(res.data))
            .catch((err) => console.error("Error fetching restaurants:", err))
            .finally(() => setLoading(false));
    }, []);

    // Filtering logic (optimized)
    const filteredRestaurants = useMemo(() => {
        return restaurantsData.filter((restaurant) => {
            const matchCity =
                city === "All" ||
                restaurant.city?.toLowerCase() === city.toLowerCase();

            const matchSearch =
                !search ||
                restaurant.name?.toLowerCase().includes(search.toLowerCase());

            const matchBadge =
                badgeFilter === "All" || restaurant.badge === badgeFilter;

            const matchCuisine =
                cuisineFilter === "All" || restaurant.cuisine_type === cuisineFilter;

            return matchCity && matchSearch && matchBadge && matchCuisine;
        });
    }, [restaurantsData, city, search, badgeFilter, cuisineFilter]);

    // Dynamic city dropdown
    const uniqueCities = [
        ...new Set(restaurantsData.map((r) => r.city).filter(Boolean)),
    ];

    // Dynamic cuisine types
    const uniqueCuisines = [
        ...new Set(restaurantsData.map((r) => r.cuisine_type).filter(Boolean)),
    ];

    // Badge styles
    const getBadgeClass = (badge) => {
        switch (badge) {
            case "Fine Dining":
                return "bg-success-subtle text-success";
            case "Casual Dining":
                return "bg-info-subtle text-info";
            case "Fast Food":
                return "bg-warning-subtle text-warning";
            case "Cafe":
                return "bg-secondary-subtle text-dark";
            default:
                return "bg-secondary-subtle text-dark";
        }
    };

    // Price range display
    const getPriceDisplay = (priceRange) => {
        return priceRange || "$$";
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
            <div className="bg-white p-3 shadow-sm" style={{ top: '64px', zIndex: 100 }}>
                <div className="row g-2">
                    <div className="col-md-3 col-12">
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

                    <div className="col-md-3 col-12">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search restaurant..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="col-md-3 col-12">
                        <select
                            className="form-select"
                            value={badgeFilter}
                            onChange={(e) => setBadgeFilter(e.target.value)}
                        >
                            <option value="All">All Types</option>
                            <option value="Fine Dining">Fine Dining</option>
                            <option value="Casual Dining">Casual Dining</option>
                            <option value="Fast Food">Fast Food</option>
                            <option value="Cafe">Cafe</option>
                        </select>
                    </div>

                    <div className="col-md-3 col-12">
                        <select
                            className="form-select"
                            value={cuisineFilter}
                            onChange={(e) => setCuisineFilter(e.target.value)}
                        >
                            <option value="All">All Cuisines</option>
                            {uniqueCuisines.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <main className="container py-4">
                <h6 className="fw-semibold mb-4">Featured Restaurants ({filteredRestaurants.length})</h6>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : restaurantsData.length === 0 ? (
                    <div className="text-center py-5 text-muted">No restaurants available right now.</div>
                ) : filteredRestaurants.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        No restaurants match your filters
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-4">
                        {filteredRestaurants.map((restaurant) => (
                            <div
                                key={restaurant.id}
                                className="card shadow-sm rounded-4 overflow-hidden border-0"
                            >
                                <div className="row g-0">
                                    {/* IMAGE */}
                                    <div className="col-md-4 col-12 position-relative">
                                        <img
                                            src={
                                                restaurant.image ||
                                                "https://via.placeholder.com/400x300?text=Restaurant"
                                            }
                                            alt={restaurant.name}
                                            className="w-100 h-100 object-fit-cover"
                                            style={{
                                                minHeight: "220px",
                                            }}
                                        />
                                        <div className="position-absolute top-0 start-0 m-2">
                                            <span className={`badge rounded-pill ${getBadgeClass(restaurant.badge)}`}>
                                                {restaurant.badge}
                                            </span>
                                        </div>
                                        <div className="position-absolute top-0 end-0 m-2">
                                            <span className="badge bg-dark rounded-pill">
                                                {getPriceDisplay(restaurant.price_range)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="col-md-8 col-12">
                                        <div className="card-body d-flex flex-column h-100">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h5 className="card-title fw-bold mb-0 text-dark">
                                                    {restaurant.name}
                                                </h5>
                                                {restaurant.rating && (
                                                    <span className="badge bg-warning text-dark">
                                                        ★ {restaurant.rating}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-muted small mb-2 d-flex align-items-center gap-1">
                                                <MapPin size={14} />
                                                {restaurant.area}, {restaurant.city}
                                            </div>

                                            <div className="mb-2">
                                                <span className="badge bg-light text-dark border">
                                                    <UtensilsCrossed size={12} className="me-1" />
                                                    {restaurant.cuisine_type}
                                                </span>
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
                                                {restaurant.description}
                                            </p>

                                            {/* PRICE + BUTTON */}
                                            <div className="d-flex justify-content-between align-items-end mt-3 border-top pt-3">
                                                <div>
                                                    <div className="text-muted small">Average cost for two</div>
                                                    <div className="fw-bold fs-5 text-primary">
                                                        ₹{Number(restaurant.average_cost_for_two).toLocaleString()}
                                                    </div>
                                                </div>

                                                <Link
                                                    to={`/restaurant/${restaurant.id}`}
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
