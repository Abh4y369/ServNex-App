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
import WifiIcon from "@mui/icons-material/Wifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import PoolIcon from "@mui/icons-material/Pool";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import NotificationsIcon from "@mui/icons-material/Notifications"; // Replaced Lucide Bell

export default function HotelDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width:768px)");

    // State
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Popup Logic State
    const [open, setOpen] = useState(false);
    const [checkStatus, setCheckStatus] = useState("input"); // input, checking, available, full
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");

    // 1. Fetch Hotel Data
    useEffect(() => {
        console.log("HotelDetails mounted. ID:", id);
        setLoading(true);
        axios.get(`http://127.0.0.1:8000/api/hotels/${id}/`)
            .then(res => {
                console.log("Hotel fetched:", res.data);
                setHotel(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setError(err.message || "Failed to load hotel");
                setLoading(false);
            });
    }, [id]);

    // 2. Image Carousel Logic
    const images = hotel ? [
        hotel.image,
        hotel.room_image1,
        hotel.room_image2
    ].filter(Boolean) : [];

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (!isMobile || images.length === 0) return;
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isMobile, images.length]);

    // 3. Modal Handlers
    const handleOpenModal = () => {
        setOpen(true);
        setCheckStatus("input");
    };

    const handleClose = () => {
        setOpen(false);
        setCheckStatus("input");
    };

    const performCheck = async () => {
        if (!checkIn || !checkOut) {
            alert("Please select dates");
            return;
        }

        setCheckStatus("checking");

        try {
            const url = `http://127.0.0.1:8000/api/bookings/check_availability/?hotel_id=${id}&check_in=${checkIn}&check_out=${checkOut}`;

            const res = await axios.get(url);

            if (res.data.available) {
                setCheckStatus("available");
                // Redirect after success
                setTimeout(() => {
                    navigate(`/booking/${id}`, { state: { hotel, checkIn, checkOut } });
                }, 1500);
            } else {
                setCheckStatus("full");
            }
        } catch (err) {
            console.error("Availability check failed:", err);
            setCheckStatus("full");
        }
    };

    // 4. Render Loading / Error
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <CircularProgress />
                <Typography ml={2}>Loading Hotel...</Typography>
            </div>
        );
    }

    if (error || !hotel) {
        return (
            <div className="container mt-5 text-center">
                <Typography variant="h5" color="error" gutterBottom>
                    Error Loading Hotel
                </Typography>
                <Typography color="textSecondary" paragraph>
                    {error || "Hotel not found"}
                </Typography>
                <Button variant="contained" onClick={() => navigate("/")}>
                    Go Back Home
                </Button>
            </div>
        );
    }

    // 5. Main Render
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
                                alt="hotel"
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
                                    <img src={img} className="img-fluid rounded" style={{ height: "300px", width: "100%", objectFit: "cover" }} alt="room" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Content */}
                    <CardContent className="p-4">
                        <div className="d-flex justify-content-between align-items-start">
                            <Typography variant="h4" fontWeight="bold">{hotel.name}</Typography>
                            <Chip label={hotel.badge || "Standard"} color="primary" size="small" />
                        </div>

                        <Box className="d-flex align-items-center gap-1 mt-2 text-muted">
                            <LocationOnIcon fontSize="small" />
                            {hotel.area}, {hotel.city}
                        </Box>

                        <div className="d-flex align-items-center gap-1 mt-2 mb-3">
                            <StarIcon sx={{ color: "#f4c430" }} />
                            <span className="fw-bold">4.8</span>
                            <span className="text-muted">(876 reviews)</span>
                        </div>

                        <Divider />

                        <Typography variant="body1" color="text.secondary" my={3} sx={{ lineHeight: 1.8 }}>
                            {hotel.description}
                        </Typography>

                        <Typography variant="h5" color="primary" fontWeight="bold">
                            ₹{Number(hotel.price).toLocaleString()} <span className="fs-6 text-muted fw-normal">/ night</span>
                        </Typography>
                    </CardContent>

                    <CardContent className="bg-light p-4">
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Amenities
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                            {hotel.amenities && hotel.amenities.length > 0 ? (
                                hotel.amenities.map((amenity, index) => {
                                    // Map amenity names to icons
                                    const getIcon = (name) => {
                                        const lowerName = name.toLowerCase();
                                        if (lowerName.includes('wifi') || lowerName.includes('wi-fi')) return <WifiIcon />;
                                        if (lowerName.includes('restaurant') || lowerName.includes('food')) return <RestaurantIcon />;
                                        if (lowerName.includes('parking')) return <LocalParkingIcon />;
                                        if (lowerName.includes('pool') || lowerName.includes('swimming')) return <PoolIcon />;
                                        if (lowerName.includes('gym') || lowerName.includes('fitness')) return <FitnessCenterIcon />;
                                        if (lowerName.includes('ac') || lowerName.includes('air conditioning')) return <AcUnitIcon />;
                                        return null; // No icon for unknown amenities
                                    };

                                    return (
                                        <Chip
                                            key={index}
                                            icon={getIcon(amenity)}
                                            label={amenity}
                                            variant="outlined"
                                        />
                                    );
                                })
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No amenities listed
                                </Typography>
                            )}
                        </Box>
                    </CardContent>

                    <CardContent className="p-4">
                        {hotel.total_rooms < 5 && hotel.total_rooms > 0 && (
                            <div className="mb-2">
                                <Chip label="Almost Full!" color="warning" size="small" />
                            </div>
                        )}

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ borderRadius: "12px", py: 1.5, fontSize: '1.2rem', textTransform: 'none' }}
                            onClick={handleOpenModal}
                        >
                            Check Availability
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Modal */}
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
                    {checkStatus === "input" && (
                        <>
                            <Typography variant="h5" fontWeight="bold" mb={3}>
                                Select Dates
                            </Typography>

                            <Box display="flex" flexDirection="column" gap={3} textAlign="left">
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" mb={1}>Check-in Date</Typography>
                                    <input
                                        type="date"
                                        className="form-control form-control-lg"
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" mb={1}>Check-out Date</Typography>
                                    <input
                                        type="date"
                                        className="form-control form-control-lg"
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                    />
                                </Box>
                            </Box>

                            <Box mt={4}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    onClick={performCheck}
                                    sx={{ borderRadius: 3, py: 1.5, fontWeight: "bold" }}
                                >
                                    Check Availability
                                </Button>
                            </Box>
                        </>
                    )}

                    {checkStatus === "checking" && (
                        <Box py={4}>
                            <CircularProgress size={50} thickness={4} />
                            <Typography variant="h6" mt={3}>Checking Availability...</Typography>
                        </Box>
                    )}

                    {checkStatus === "available" && (
                        <Box py={4}>
                            <Typography variant="h2" mb={2}>✅</Typography>
                            <Typography variant="h5" color="success.main" fontWeight="bold">
                                Available!
                            </Typography>
                            <Typography color="text.secondary" mt={1}>
                                Redirecting to booking...
                            </Typography>
                        </Box>
                    )}

                    {checkStatus === "full" && (
                        <Box py={4}>
                            <Typography variant="h2" mb={2}>❌</Typography>
                            <Typography variant="h5" color="error" fontWeight="bold">
                                Sold Out
                            </Typography>
                            <Typography color="text.secondary" mt={1} mb={3}>
                                No rooms available for these dates.
                            </Typography>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => setCheckStatus("input")}
                            >
                                Change Dates
                            </Button>
                        </Box>
                    )}
                </Box>
            </Modal >
        </div >
    );
}