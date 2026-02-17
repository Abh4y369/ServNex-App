import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
    AppBar,
    Toolbar,
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Chip,
    Modal,
    useMediaQuery,
    Divider,
    CircularProgress,
    IconButton
} from "@mui/material";

// Icons
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import UtensilsCrossed from "@mui/icons-material/Restaurant";

export default function RestaurantDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width:768px)");

    // State
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Reservation Modal State
    const [open, setOpen] = useState(false);
    const [reservationDate, setReservationDate] = useState("");
    const [reservationTime, setReservationTime] = useState("");
    const [numberOfGuests, setNumberOfGuests] = useState(2);

    // Fetch Restaurant Data
    useEffect(() => {
        console.log("RestaurantDetail mounted. ID:", id);
        setLoading(true);
        axios.get(`http://127.0.0.1:8000/api/restaurants/${id}/`)
            .then(res => {
                console.log("Restaurant fetched:", res.data);
                setRestaurant(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setError(err.message || "Failed to load restaurant");
                setLoading(false);
            });
    }, [id]);

    // Image Carousel Logic
    const images = restaurant ? [
        restaurant.image,
        restaurant.menu_image,
        restaurant.interior_image
    ].filter(Boolean) : [];

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (!isMobile || images.length === 0) return;
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isMobile, images.length]);

    // Modal Handlers
    const handleOpenModal = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleReservation = () => {
        if (!reservationDate || !reservationTime) {
            alert("Please select date and time");
            return;
        }

        // Navigate to reservation page with data
        navigate(`/reservation/${id}`, {
            state: {
                restaurant,
                reservationDate,
                reservationTime,
                numberOfGuests
            }
        });
    };

    // Render Loading / Error
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <CircularProgress />
                <Typography ml={2}>Loading Restaurant...</Typography>
            </div>
        );
    }

    if (error || !restaurant) {
        return (
            <div className="container mt-5 text-center">
                <Typography variant="h5" color="error" gutterBottom>
                    Error Loading Restaurant
                </Typography>
                <Typography color="textSecondary" paragraph>
                    {error || "Restaurant not found"}
                </Typography>
                <Button variant="contained" onClick={() => navigate("/")}>
                    Go Back Home
                </Button>
            </div>
        );
    }

    // Main Render
    return (
        <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            {/* Header */}
            <AppBar position="sticky" sx={{ background: "linear-gradient(135deg, #0a3a82, #0f62c5)" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                            ServNex
                        </Link>
                    </Typography>
                    <IconButton color="inherit">
                        <NotificationsIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <div className="container my-4">
                <Card className="shadow-lg rounded-4 overflow-hidden border-0">

                    {/* Images */}
                    {isMobile ? (
                        <Box sx={{ position: "relative", height: 260, overflow: "hidden" }}>
                            <img
                                src={images[activeIndex] || "https://via.placeholder.com/400"}
                                alt="restaurant"
                                className="w-100 h-100"
                                style={{ objectFit: "cover", transition: "0.5s" }}
                            />
                            <Box sx={{ position: "absolute", bottom: 10, width: "100%", display: "flex", justifyContent: "center", gap: 1 }}>
                                {images.map((_, i) => (
                                    <Box key={i} sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: i === activeIndex ? "white" : "rgba(255,255,255,0.5)" }} />
                                ))}
                            </Box>
                        </Box>
                    ) : (
                        <div className="row g-1">
                            {images.map((img, i) => (
                                <div key={i} className="col-md-4">
                                    <img src={img} className="img-fluid rounded" style={{ height: "300px", width: "100%", objectFit: "cover" }} alt="restaurant" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Content */}
                    <CardContent className="p-4">
                        <div className="d-flex justify-content-between align-items-start">
                            <Typography variant="h4" fontWeight="bold">{restaurant.name}</Typography>
                            <Chip label={restaurant.badge || "Restaurant"} color="primary" size="small" />
                        </div>

                        <Box className="d-flex align-items-center gap-1 mt-2 text-muted">
                            <LocationOnIcon fontSize="small" />
                            {restaurant.area}, {restaurant.city}
                        </Box>

                        <div className="d-flex align-items-center gap-2 mt-2 mb-3">
                            {restaurant.rating && (
                                <div className="d-flex align-items-center gap-1">
                                    <StarIcon sx={{ color: "#f4c430" }} />
                                    <span className="fw-bold">{restaurant.rating}</span>
                                </div>
                            )}
                            <Chip
                                icon={<UtensilsCrossed />}
                                label={restaurant.cuisine_type}
                                size="small"
                                variant="outlined"
                            />
                            <Chip
                                label={restaurant.price_range || "$$"}
                                size="small"
                                variant="outlined"
                            />
                        </div>

                        <Divider />

                        <Typography variant="body1" color="text.secondary" my={3} sx={{ lineHeight: 1.8 }}>
                            {restaurant.description}
                        </Typography>

                        <Typography variant="h5" color="primary" fontWeight="bold">
                            ₹{Number(restaurant.average_cost_for_two).toLocaleString()} <span className="fs-6 text-muted fw-normal">for two</span>
                        </Typography>
                    </CardContent>

                    <CardContent className="bg-light p-4">
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Restaurant Information
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Cuisine:</strong> {restaurant.cuisine_type}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Type:</strong> {restaurant.badge}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Price Range:</strong> {restaurant.price_range}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Total Tables:</strong> {restaurant.total_tables}
                            </Typography>
                        </Box>
                    </CardContent>

                    <CardContent className="p-4">
                        {restaurant.total_tables < 5 && restaurant.total_tables > 0 && (
                            <div className="mb-2">
                                <Chip label="Limited Tables Available!" color="warning" size="small" />
                            </div>
                        )}

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ borderRadius: "12px", py: 1.5, fontSize: '1.2rem', textTransform: 'none' }}
                            onClick={handleOpenModal}
                        >
                            Reserve a Table
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Reservation Modal */}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%,-50%)",
                        bgcolor: "white",
                        p: 4,
                        borderRadius: "20px",
                        textAlign: "center",
                        width: 360,
                        boxShadow: 24,
                        outline: 'none'
                    }}
                >
                    <Typography variant="h5" fontWeight="bold" mb={3}>
                        Reserve a Table
                    </Typography>

                    <Box display="flex" flexDirection="column" gap={3} textAlign="left">
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" mb={1}>Reservation Date</Typography>
                            <input
                                type="date"
                                className="form-control form-control-lg"
                                value={reservationDate}
                                onChange={(e) => setReservationDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" mb={1}>Reservation Time</Typography>
                            <input
                                type="time"
                                className="form-control form-control-lg"
                                value={reservationTime}
                                onChange={(e) => setReservationTime(e.target.value)}
                            />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" mb={1}>Number of Guests</Typography>
                            <select
                                className="form-select form-select-lg"
                                value={numberOfGuests}
                                onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                                ))}
                            </select>
                        </Box>
                    </Box>

                    <Box mt={4}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={handleReservation}
                            sx={{ borderRadius: 3, py: 1.5, fontWeight: "bold" }}
                        >
                            Continue to Reservation
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
