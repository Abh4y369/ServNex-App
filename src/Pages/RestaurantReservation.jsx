import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { FaPlus, FaMinus } from "react-icons/fa";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { Bell } from "lucide-react";
import axios from "axios";

export default function RestaurantReservation() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Retrieve state passed from previous page
    const { reservationDate, reservationTime, numberOfGuests, restaurant: passedRestaurant } = location.state || {};

    const [restaurant, setRestaurant] = useState(passedRestaurant || null);
    const [loading, setLoading] = useState(!passedRestaurant);

    // Local state for reservation info
    const [date, setDate] = useState(reservationDate || "");
    const [time, setTime] = useState(reservationTime || "");
    const [guests, setGuests] = useState(numberOfGuests || 2);
    const [specialRequests, setSpecialRequests] = useState("");
    const [error, setError] = useState(null);
    const [isReserving, setIsReserving] = useState(false);

    // Auto-calculate tables (4 guests per table)
    const tablesNeeded = Math.ceil(guests / 4);

    // Fetch restaurant if not passed
    useEffect(() => {
        if (!restaurant) {
            axios
                .get(`http://127.0.0.1:8000/api/restaurants/${id}/`)
                .then((res) => {
                    setRestaurant(res.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching restaurant:", err);
                    setLoading(false);
                });
        }
    }, [id, restaurant]);

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (!restaurant) return <div className="p-5">Restaurant not found</div>;

    // Handle Reservation Submission
    const handleReservation = async () => {
        if (!date || !time) {
            setError("Please select reservation date and time.");
            return;
        }

        setIsReserving(true);
        setError(null);

        // Retrieve auth token
        const token = localStorage.getItem("access");
        if (!token) {
            alert("You must be logged in to make a reservation.");
            navigate("/login");
            return;
        }

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/reservations/",
                {
                    restaurant: restaurant.id,
                    reservation_date: date,
                    reservation_time: time,
                    number_of_guests: guests,
                    special_requests: specialRequests
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Reservation Confirmed!");
            navigate("/my-bookings");
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                const msg = typeof err.response.data === 'string'
                    ? err.response.data
                    : JSON.stringify(err.response.data);
                setError(msg);
            } else {
                setError("Reservation failed. Please try again.");
            }
        } finally {
            setIsReserving(false);
        }
    };

    return (
        <>
            {/* HEADER */}
            <AppBar position="sticky" sx={{ background: "linear-gradient(135deg, #0a3a82, #0f62c5)" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>ServNex</Link>
                    </Typography>
                    <Bell size={22} color="white" />
                </Toolbar>
            </AppBar>

            <div className="container my-5">
                <div className="card shadow-lg rounded-4 overflow-hidden mt-4">

                    {/* IMAGE */}
                    <div className="row g-0">
                        <div className="col-12" style={{ height: '300px', overflow: 'hidden' }}>
                            <img src={restaurant.image} className="w-100 h-100" style={{ objectFit: 'cover' }} alt={restaurant.name} />
                        </div>
                    </div>

                    {/* DETAILS */}
                    <div className="card-body p-4">
                        <h3 className="fw-bold">{restaurant.name}</h3>
                        <p className="text-muted">{restaurant.area}, {restaurant.city}</p>
                        <p className="text-muted"><strong>Cuisine:</strong> {restaurant.cuisine_type}</p>

                        <hr />

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Reservation Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Reservation Time</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    value={time}
                                    onChange={e => setTime(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* GUESTS */}
                        <div className="row mb-4 text-center bg-light p-3 rounded-4 g-3">
                            <div className="col-md-6 border-end">
                                <h6 className="fw-bold">Number of Guests</h6>
                                <div className="d-flex justify-content-center align-items-center gap-3">
                                    <button className="btn btn-outline-danger btn-sm rounded-circle"
                                        onClick={() => setGuests(Math.max(1, guests - 1))}
                                        style={{ width: '32px', height: '32px', padding: 0 }}
                                    ><FaMinus size={12} /></button>
                                    <span className="fw-bold fs-5" style={{ minWidth: '80px' }}>{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
                                    <button className="btn btn-outline-success btn-sm rounded-circle"
                                        onClick={() => setGuests(guests + 1)}
                                        style={{ width: '32px', height: '32px', padding: 0 }}
                                    ><FaPlus size={12} /></button>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <h6 className="fw-bold">Tables Required</h6>
                                <div className="d-flex justify-content-center align-items-center gap-3">
                                    <span className="fw-bold fs-5 text-primary">{tablesNeeded} {tablesNeeded === 1 ? 'Table' : 'Tables'}</span>
                                </div>
                                <small className="text-muted">Auto-calculated (4 guests per table)</small>
                            </div>
                        </div>

                        {/* SPECIAL REQUESTS */}
                        <div className="mb-4">
                            <label className="form-label fw-bold">Special Requests (Optional)</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Any dietary restrictions, special occasions, seating preferences, etc."
                                value={specialRequests}
                                onChange={e => setSpecialRequests(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        {/* TOTAL COST */}
                        <div className="card border-0 shadow-sm rounded-4 p-3 bg-light mb-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="fw-bold mb-1">Estimated Cost</h5>
                                    <small className="text-muted">
                                        Average for {guests} {guests === 1 ? 'guest' : 'guests'}
                                    </small>
                                </div>
                                <h3 className="fw-bold text-primary mb-0">
                                    ₹{(Number(restaurant.average_cost_for_two) * (guests / 2)).toLocaleString()}
                                </h3>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="mt-5 d-grid">
                            <button
                                className="btn btn-primary btn-lg rounded-3"
                                onClick={handleReservation}
                                disabled={isReserving}
                            >
                                {isReserving ? "Confirming..." : "Confirm Reservation"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
