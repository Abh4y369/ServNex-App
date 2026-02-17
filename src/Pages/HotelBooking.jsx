import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom"; // [NEW] useLocation, useNavigate
import {
    FaStar,
    FaMapMarkerAlt,
    FaWifi,
    FaSwimmingPool,
    FaSnowflake,
    FaBed,
    FaPlus,
    FaMinus
} from "react-icons/fa";
import { AppBar, Toolbar, Typography, Chip, IconButton, Modal, Box, Button as MuiButton } from "@mui/material"; // [NEW] Modal, Box, MuiButton
import { Bell, XCircle, AlertCircle } from "lucide-react";
import axios from "axios";

export default function HotelBooking() {
    const { id } = useParams();
    const location = useLocation(); // [NEW] To get dates passed from Details page
    const navigate = useNavigate();

    // Retrieve state passed from previous page
    const { checkIn, checkOut, hotel: passedHotel } = location.state || {};

    const [hotel, setHotel] = useState(passedHotel || null);
    const [loading, setLoading] = useState(!passedHotel);

    // [NEW] Local state for user dates and booking info
    const [startDate, setStartDate] = useState(checkIn || "");
    const [endDate, setEndDate] = useState(checkOut || "");
    const [guests, setGuests] = useState(2);
    const [rooms, setRooms] = useState(1);
    const [error, setError] = useState(null);
    const [showErrorModal, setShowErrorModal] = useState(false); // [NEW] Modal control
    const [isBooking, setIsBooking] = useState(false); // Loading state for button

    // Reactive logic: Auto-calculate rooms when guests change
    const updateGuests = (val) => {
        const newVal = Math.max(1, val);
        setGuests(newVal);
        setRooms(Math.ceil(newVal / 2));
    };

    const updateRooms = (val) => {
        const newVal = Math.max(1, val);
        // Only allow decrease if it still fits guests
        if (newVal < Math.ceil(guests / 2)) return;
        setRooms(newVal);
    };

    // Fetch hotel if not passed
    useEffect(() => {
        if (!hotel) {
            axios
                .get(`http://127.0.0.1:8000/api/hotels/${id}/`)
                .then((res) => {
                    setHotel(res.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching hotel:", err);
                    setLoading(false);
                });
        }
    }, [id, hotel]);

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (!hotel) return <div className="p-5">Hotel not found</div>;

    // [NEW] Calculate Nights
    const calculateNights = () => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDiff = end - start;
        const days = Math.round(timeDiff / (1000 * 3600 * 24));
        return days > 0 ? days : 0;
    };

    const nights = calculateNights();
    const pricePerNight = Number(hotel.price);
    const totalCost = pricePerNight * (nights === 0 ? 1 : nights) * rooms;

    // [NEW] Handle Booking Submission
    const handleBooking = async () => {
        if (!startDate || !endDate) {
            setError("Please select Check-in and Check-out dates.");
            return;
        }

        setIsBooking(true);
        setError(null);

        // Retrieve auth token
        const token = localStorage.getItem("access");
        if (!token) {
            alert("You must be logged in to book.");
            navigate("/login");
            return;
        }

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/bookings/",
                {
                    hotel: hotel.id,
                    check_in: startDate,
                    check_out: endDate,
                    number_of_guests: guests,
                    rooms_booked: rooms
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Booking Confirmed!");
            navigate("/my-bookings");
        } catch (err) {
            console.error(err);
            let msg = "Booking failed. Please try again.";

            if (err.response && err.response.data) {
                const data = err.response.data;

                // Parse DRF common error formats
                if (typeof data === 'string') {
                    msg = data;
                } else if (data.non_field_errors) {
                    msg = data.non_field_errors[0];
                } else if (data.detail) {
                    msg = data.detail;
                } else if (typeof data === 'object') {
                    // Grab first available error message
                    const firstKey = Object.keys(data)[0];
                    const firstVal = data[firstKey];
                    msg = Array.isArray(firstVal) ? firstVal[0] : JSON.stringify(firstVal);
                }
            }

            setError(msg);
            setShowErrorModal(true);
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <>
            {/* ================= HEADER ================= */}
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

                    {/* ================= IMAGES ================= */}
                    <div className="row g-0">
                        <div className="col-12" style={{ height: '300px', overflow: 'hidden' }}>
                            <img src={hotel.image} className="w-100 h-100" style={{ objectFit: 'cover' }} alt={hotel.name} />
                        </div>
                    </div>

                    {/* ===== DETAILS ===== */}
                    <div className="card-body p-4">
                        <h3 className="fw-bold">{hotel.name}</h3>
                        <p className="text-muted"><FaMapMarkerAlt color="green" /> {hotel.area}, {hotel.city}</p>

                        <hr />

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Check-in</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Check-out</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* ================= GUESTS & ROOMS ================= */}
                        <div className="row mb-4 text-center bg-light p-3 rounded-4 g-3">
                            <div className="col-md-6 border-end">
                                <h6 className="fw-bold">Guests</h6>
                                <div className="d-flex justify-content-center align-items-center gap-3">
                                    <button className="btn btn-outline-danger btn-sm rounded-circle"
                                        onClick={() => updateGuests(guests - 1)}
                                        style={{ width: '32px', height: '32px', padding: 0 }}
                                    ><FaMinus size={12} /></button>
                                    <span className="fw-bold fs-5" style={{ minWidth: '80px' }}>{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
                                    <button className="btn btn-outline-success btn-sm rounded-circle"
                                        onClick={() => updateGuests(guests + 1)}
                                        style={{ width: '32px', height: '32px', padding: 0 }}
                                    ><FaPlus size={12} /></button>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <h6 className="fw-bold">Rooms</h6>
                                <div className="d-flex justify-content-center align-items-center gap-3">
                                    <button className="btn btn-outline-danger btn-sm rounded-circle"
                                        onClick={() => updateRooms(rooms - 1)}
                                        style={{ width: '32px', height: '32px', padding: 0 }}
                                    ><FaMinus size={12} /></button>
                                    <span className="fw-bold fs-5" style={{ minWidth: '80px' }}>{rooms} {rooms === 1 ? 'Room' : 'Rooms'}</span>
                                    <button className="btn btn-outline-success btn-sm rounded-circle"
                                        onClick={() => updateRooms(rooms + 1)}
                                        style={{ width: '32px', height: '32px', padding: 0 }}
                                    ><FaPlus size={12} /></button>
                                </div>
                            </div>
                        </div>


                        {/* ================= TOTAL COST ================= */}
                        <div className="card border-0 shadow-sm rounded-4 p-3 bg-light mb-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="fw-bold mb-1">Total Cost</h5>
                                    <small className="text-muted">
                                        {nights} {nights === 1 ? 'night' : 'nights'} × {rooms} {rooms === 1 ? 'room' : 'rooms'}
                                    </small>
                                </div>
                                <h3 className="fw-bold text-primary mb-0">₹{totalCost.toLocaleString()}</h3>
                            </div>
                        </div>

                        {/* ================= FOOTER ================= */}
                        <div className="mt-5 d-grid">
                            <button
                                className="btn btn-primary btn-lg rounded-3"
                                onClick={handleBooking}
                                disabled={isBooking}
                            >
                                {isBooking ? "Confirming..." : "Confirm Booking"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Popup Modal */}
            <Modal
                open={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                aria-labelledby="error-modal-title"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: 400 },
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 4,
                    textAlign: 'center',
                    outline: 'none'
                }}>
                    <XCircle size={60} color="#d32f2f" style={{ marginBottom: '1rem' }} />
                    <Typography id="error-modal-title" variant="h5" component="h2" fontWeight="bold" gutterBottom>
                        Booking Failed
                    </Typography>
                    <Typography sx={{ mt: 2, color: 'text.secondary', fontSize: '1.1rem' }}>
                        {error}
                    </Typography>
                    <MuiButton
                        variant="contained"
                        color="error"
                        onClick={() => setShowErrorModal(false)}
                        sx={{ mt: 4, borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 'bold' }}
                    >
                        Close
                    </MuiButton>
                </Box>
            </Modal>
        </>
    );
}