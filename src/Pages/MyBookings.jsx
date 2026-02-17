import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Chip, Box, Card, CardContent, Button, Tabs, Tab } from "@mui/material";
import { Bell, Calendar, MapPin, Utensils, Hotel } from "lucide-react";

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (!token) {
            window.location.href = "/login";
            return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Fetch both bookings and reservations
        Promise.all([
            axios.get("http://127.0.0.1:8000/api/bookings/", { headers }),
            axios.get("http://127.0.0.1:8000/api/my-reservations/", { headers })
        ])
            .then(([bookingsRes, reservationsRes]) => {
                setBookings(bookingsRes.data);
                setReservations(reservationsRes.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching bookings:", err);
                setLoading(false);
            });
    }, []);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    if (loading) return <div className="text-center mt-5">Loading your trips...</div>;

    return (
        <div className="min-vh-100 bg-light">
            {/* HEADER */}
            <AppBar position="sticky" sx={{ background: "linear-gradient(135deg, #0a3a82, #0f62c5)" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>ServNex</Link>
                    </Typography>
                    <Bell size={22} color="white" />
                </Toolbar>
            </AppBar>

            <div className="container py-5">
                <h2 className="mb-4 fw-bold">My Bookings ✈️</h2>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
                    <Tabs value={activeTab} onChange={handleTabChange} aria-label="booking tabs">
                        <Tab
                            icon={<Hotel size={18} className="me-2" />}
                            iconPosition="start"
                            label="Hotels"
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                        />
                        <Tab
                            icon={<Utensils size={18} className="me-2" />}
                            iconPosition="start"
                            label="Restaurants"
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                        />
                    </Tabs>
                </Box>

                {activeTab === 0 ? (
                    /* HOTEL BOOKINGS */
                    bookings.length === 0 ? (
                        <div className="text-center py-5">
                            <h4 className="text-muted">No hotel bookings yet!</h4>
                            <Link to="/" className="btn btn-primary mt-3">Explore Hotels</Link>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {bookings.map(booking => {
                                const hotel = booking.hotel_details || {};
                                return (
                                    <div key={booking.id} className="col-md-6 col-lg-4">
                                        <Card className="h-100 shadow-sm rounded-4 border-0">
                                            <div className="position-relative">
                                                <img
                                                    src={hotel.image || "https://via.placeholder.com/300?text=Hotel"}
                                                    alt={hotel.name || "Hotel"}
                                                    className="w-100"
                                                    style={{ height: 160, objectFit: 'cover' }}
                                                />
                                                <div className="position-absolute top-0 end-0 m-2">
                                                    <Chip
                                                        label={booking.status}
                                                        color={booking.status === 'confirmed' ? 'success' : 'default'}
                                                        size="small"
                                                        sx={{ textTransform: 'capitalize' }}
                                                    />
                                                </div>
                                            </div>
                                            <CardContent>
                                                <Typography variant="h6" fontWeight="bold">
                                                    {hotel.name || `Hotel #${booking.hotel}`}
                                                </Typography>
                                                <div className="text-muted small mb-3">
                                                    <MapPin size={16} className="me-1" />
                                                    {hotel.area ? `${hotel.area}, ${hotel.city}` : "Location info unavailable"}
                                                </div>
                                                <Box display="flex" flexDirection="column" gap={1} bgcolor="#f8f9fa" p={2} borderRadius={2}>
                                                    <div className="d-flex align-items-center gap-2 text-dark fw-medium">
                                                        <Calendar size={18} className="text-primary" />
                                                        Check-in: {booking.check_in}
                                                    </div>
                                                    <div className="d-flex align-items-center gap-2 text-dark fw-medium">
                                                        <Calendar size={18} className="text-primary" />
                                                        Check-out: {booking.check_out}
                                                    </div>
                                                </Box>
                                                <Link to={`/hotel/${booking.hotel}`} className="text-decoration-none">
                                                    <Button variant="outlined" fullWidth sx={{ mt: 3, borderRadius: 3, textTransform: 'none' }}>
                                                        View Property Again
                                                    </Button>
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    )
                ) : (
                    /* RESTAURANT RESERVATIONS */
                    reservations.length === 0 ? (
                        <div className="text-center py-5">
                            <h4 className="text-muted">No restaurant reservations yet!</h4>
                            <Link to="/restaurant" className="btn btn-primary mt-3">Explore Restaurants</Link>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {reservations.map(reservation => (
                                <div key={reservation.id} className="col-md-6 col-lg-4">
                                    <Card className="h-100 shadow-sm rounded-4 border-0">
                                        <div className="position-relative">
                                            <img
                                                src={reservation.restaurant_image || "https://via.placeholder.com/300?text=Restaurant"}
                                                alt={reservation.restaurant_name}
                                                className="w-100"
                                                style={{ height: 160, objectFit: 'cover' }}
                                            />
                                            <div className="position-absolute top-0 end-0 m-2">
                                                <Chip
                                                    label={reservation.status}
                                                    color={reservation.status === 'confirmed' ? 'success' : 'default'}
                                                    size="small"
                                                    sx={{ textTransform: 'capitalize' }}
                                                />
                                            </div>
                                        </div>
                                        <CardContent>
                                            <Typography variant="h6" fontWeight="bold">
                                                {reservation.restaurant_name}
                                            </Typography>
                                            <div className="text-muted small mb-3">
                                                <Utensils size={16} className="me-1" />
                                                {reservation.number_of_guests} {reservation.number_of_guests === 1 ? 'Guest' : 'Guests'}
                                            </div>
                                            <Box display="flex" flexDirection="column" gap={1} bgcolor="#f8f9fa" p={2} borderRadius={2}>
                                                <div className="d-flex align-items-center gap-2 text-dark fw-medium">
                                                    <Calendar size={18} className="text-primary" />
                                                    Date: {reservation.reservation_date}
                                                </div>
                                                <div className="d-flex align-items-center gap-2 text-dark fw-medium">
                                                    <Calendar size={18} className="text-primary" />
                                                    Time: {reservation.reservation_time}
                                                </div>
                                            </Box>
                                            <Link to={`/restaurant/${reservation.restaurant}`} className="text-decoration-none">
                                                <Button variant="outlined" fullWidth sx={{ mt: 3, borderRadius: 3, textTransform: 'none' }}>
                                                    View Restaurant
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}