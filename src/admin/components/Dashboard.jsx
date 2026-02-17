import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [errors, setErrors] = useState({});

  /* ✅ Gallery state for multiple photos */
  const [galleryImages, setGalleryImages] = useState([]);

  const theme = {
    primary: "#1e3a8a",
    secondary: "#3b82f6",
    light: "#f8fbff",
  };

  const hotel = {
    name: "Grand Palace Hotel",
    city: "Chennai",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  };

  const [rooms, setRooms] = useState([]);

  const [form, setForm] = useState({
    type: "",
    price: "",
    adults: "",
    children: "",
    totalRooms: "",
    bedType: "",
    roomSize: "",
    amenities: "",
    description: "",
    image: "",
  });

  /* ---------- DROPDOWN OPTIONS ---------- */

  const roomTypes = ["Deluxe", "Suite", "Executive", "Standard"];
  const bedTypes = ["Single", "Double", "Queen", "King"];

  /* ---------- VALIDATION (WEB-STANDARD) ---------- */

  const validateForm = () => {
    let newErrors = {};

    if (!form.type) newErrors.type = "Room type required";
    if (!form.price || Number(form.price) <= 0)
      newErrors.price = "Enter a valid price";
    if (!form.adults) newErrors.adults = "Adults required";
    if (!form.totalRooms || Number(form.totalRooms) <= 0)
      newErrors.totalRooms = "Enter valid room count";

    const amenities = form.amenities.trim();
    if (!amenities) {
      newErrors.amenities = "Amenities required";
    } else if (amenities.length < 3 || amenities.length > 200) {
      newErrors.amenities = "Amenities must be 3–200 characters";
    } else if (!/^[\w\s,.-]+$/u.test(amenities)) {
      newErrors.amenities = "Invalid characters in amenities";
    }

    const description = form.description.trim();
    if (description && (description.length < 10 || description.length > 500)) {
      newErrors.description = "Description must be 10–500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------- IMAGE UPLOAD ---------- */

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image")) {
      setForm({ ...form, image: URL.createObjectURL(file) });
    }
  };

  /* ✅ MULTIPLE GALLERY IMAGE UPLOAD */
  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const imageUrls = files
      .filter((f) => f.type.startsWith("image"))
      .map((f) => URL.createObjectURL(f));

    setGalleryImages((prev) => [...prev, ...imageUrls]);
  };

  /* ---------- ADD / UPDATE ROOM ---------- */

  const handleSubmitRoom = () => {
    if (!validateForm()) return;

    const newRoom = {
      ...form,
      id: editingRoomId || Date.now(),
      available: Number(form.totalRooms),
      amenities: form.amenities
        ? form.amenities
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean)
        : [],
    };

    if (editingRoomId) {
      setRooms(
        rooms.map((room) => (room.id === editingRoomId ? newRoom : room))
      );
      setEditingRoomId(null);
      alert("Room updated successfully!");
    } else {
      setRooms([...rooms, newRoom]);
      alert("Room added successfully!");
    }

    resetForm();
  };

  const handleEditRoom = (room) => {
    setForm({
      ...room,
      amenities: room.amenities.join(", "),
    });
    setEditingRoomId(room.id);
    setActiveTab("rooms");
  };

  const handleDeleteRoom = (id) => {
    setRooms(rooms.filter((r) => r.id !== id));
  };

  const resetForm = () => {
    setForm({
      type: "",
      price: "",
      adults: "",
      children: "",
      totalRooms: "",
      bedType: "",
      roomSize: "",
      amenities: "",
      description: "",
      image: "",
    });
    setErrors({});
  };

  /* ---------- BOOKINGS ---------- */

  const bookings = [
    {
      id: "BX101",
      user: "Rahul Sharma",
      room: "Deluxe",
      date: "20 Feb",
      status: "Pending",
    },
    {
      id: "BX102",
      user: "Priya Singh",
      room: "Suite",
      date: "22 Feb",
      status: "Confirmed",
    },
  ];

  /* ---------- UI ---------- */

  const InputError = ({ msg }) =>
    msg ? <small className="text-danger">{msg}</small> : null;

  return (
    <div className="container-fluid" style={{ background: theme.light }}>
      <div className="row min-vh-100">
        {/* SIDEBAR */}
        <div
          className={`col-md-3 col-lg-2 text-white p-3 ${
            sidebarOpen ? "d-block" : "d-none d-md-block"
          }`}
          style={{ background: theme.primary }}
        >
          <h4 className="fw-bold mb-4">ServNex Business</h4>

          {["dashboard", "rooms", "bookings", "gallery"].map((tab) => (
            <button
              key={tab}
              className="btn w-100 text-start mb-2"
              style={{
                background: activeTab === tab ? "white" : "transparent",
                color: activeTab === tab ? theme.primary : "white",
                borderRadius: "10px",
              }}
              onClick={() => {
                setActiveTab(tab);
                setSidebarOpen(false);
              }}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* MAIN */}
        <div className="col-md-9 col-lg-10 p-0">
          {/* TOPBAR */}
          <div className="bg-white shadow-sm p-3 d-flex justify-content-between">
            <button
              className="btn d-md-none"
              style={{ background: theme.secondary, color: "white" }}
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <h5
              className="fw-semibold text-capitalize"
              style={{ color: theme.primary }}
            >
              {activeTab}
            </h5>
          </div>

          <div className="p-4">
            {/* DASHBOARD */}
            {activeTab === "dashboard" && (
              <>
                <div className="card border-0 shadow mb-4 rounded-4 overflow-hidden">
                  <img
                    src={hotel.image}
                    style={{ height: 260, objectFit: "cover" }}
                    alt="hotel"
                  />
                  <div
                    className="card-img-overlay text-white d-flex flex-column justify-content-end"
                    style={{ background: "rgba(0,0,0,0.45)" }}
                  >
                    <h3 className="fw-bold">{hotel.name}</h3>
                    <p>
                      {hotel.city} • ⭐ {hotel.rating}
                    </p>
                  </div>
                </div>

                <div className="row g-4">
                  {rooms.map((room) => (
                    <div key={room.id} className="col-sm-6 col-lg-4 col-xl-3">
                      <div className="card border-0 shadow h-100 rounded-4">
                        <img
                          src={room.image}
                          style={{ height: 180, objectFit: "cover" }}
                          alt="room"
                        />
                        <div className="card-body d-flex flex-column">
                          <h5>{room.type}</h5>
                          <p className="fw-bold text-primary">
                            ₹{room.price}/night
                          </p>

                          <small>
                            Adults: {room.adults} | Children:{" "}
                            {room.children || 0}
                            <br />
                            BedType: {room.bedType || "-"} | 📏{" "}
                            {room.roomSize || "-"}
                          </small>

                          {room.amenities.length > 0 && (
                            <div className="mt-2 d-flex flex-wrap gap-1">
                              {room.amenities.map((a, i) => (
                                <span
                                  key={i}
                                  className="badge rounded-pill text-bg-light border"
                                  style={{ fontSize: "0.72rem" }}
                                >
                                  ✨ {a}
                                </span>
                              ))}
                            </div>
                          )}

                          <span className="badge bg-success mt-2">
                            {room.available} Rooms Available
                          </span>

                          <div className="mt-auto pt-3">
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => handleEditRoom(room)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteRoom(room.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* ADD ROOM EMPTY CARD */}
                  <div className="col-sm-6 col-lg-4 col-xl-3">
                    <div
                      className="card border-2 border-dashed h-100 rounded-4 d-flex align-items-center justify-content-center text-center p-4"
                      style={{
                        minHeight: 320,
                        cursor: "pointer",
                        borderStyle: "dashed",
                      }}
                      onClick={() => setActiveTab("rooms")}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "2rem",
                            color: theme.secondary,
                            fontWeight: "bold",
                          }}
                        >
                          +
                        </div>
                        <h6 className="mt-2 mb-1">Add Room</h6>
                        <small className="text-muted">
                          Click to create a new room
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ROOMS TAB */}
            {activeTab === "rooms" && (
              <div className="card border-0 shadow p-4 rounded-4">
                <h5 className="fw-semibold mb-3">
                  {editingRoomId ? "Edit Room" : "Add Room"}
                </h5>

                <div className="row g-3">
                  <div className="col-md-4">
                    <select
                      className="form-select"
                      value={form.type}
                      onChange={(e) =>
                        setForm({ ...form, type: e.target.value })
                      }
                    >
                      <option value="">Select Room Type</option>
                      {roomTypes.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                    <InputError msg={errors.type} />
                  </div>

                  <div className="col-md-4">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Price"
                      min="1"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                    />
                    <InputError msg={errors.price} />
                  </div>

                  <div className="col-md-4">
                    <select
                      className="form-select"
                      value={form.adults}
                      onChange={(e) =>
                        setForm({ ...form, adults: e.target.value })
                      }
                    >
                      <option value="">Adults</option>
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n}>{n}</option>
                      ))}
                    </select>
                    <InputError msg={errors.adults} />
                  </div>

                  <div className="col-md-4">
                    <select
                      className="form-select"
                      value={form.children}
                      onChange={(e) =>
                        setForm({ ...form, children: e.target.value })
                      }
                    >
                      <option value="">Children</option>
                      {[0, 1, 2, 3].map((n) => (
                        <option key={n}>{n}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Total Rooms"
                      min="1"
                      value={form.totalRooms}
                      onChange={(e) =>
                        setForm({ ...form, totalRooms: e.target.value })
                      }
                    />
                    <InputError msg={errors.totalRooms} />
                  </div>

                  <div className="col-md-4">
                    <select
                      className="form-select"
                      value={form.bedType}
                      onChange={(e) =>
                        setForm({ ...form, bedType: e.target.value })
                      }
                    >
                      <option value="">Bed Type</option>
                      {bedTypes.map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Amenities (comma separated) e.g. WiFi, AC, TV"
                      value={form.amenities}
                      maxLength={200}
                      onChange={(e) =>
                        setForm({ ...form, amenities: e.target.value })
                      }
                    />
                    <InputError msg={errors.amenities} />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>

                  {form.image && (
                    <div className="col-12">
                      <img
                        src={form.image}
                        className="img-fluid rounded"
                        style={{ maxHeight: 200 }}
                        alt="preview"
                      />
                    </div>
                  )}

                  <div className="col-12">
                    <textarea
                      className="form-control"
                      placeholder="Description"
                      rows="2"
                      maxLength={500}
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                    />
                    <InputError msg={errors.description} />
                  </div>
                </div>

                <div className="d-flex gap-2 mt-3">
                  <button className="btn btn-primary" onClick={handleSubmitRoom}>
                    {editingRoomId ? "Update Room" : "Add Room"}
                  </button>

                  <button
                    className="btn btn-outline-secondary"
                    onClick={resetForm}
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {/* BOOKINGS */}
            {activeTab === "bookings" && (
              <div className="card shadow border-0 p-4 rounded-4">
                <h5>Recent Bookings</h5>

                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="border rounded p-3 mb-3 d-flex justify-content-between"
                  >
                    <div>
                      <strong>{b.user}</strong>
                      <div className="text-muted small">
                        {b.room} • {b.date}
                      </div>
                    </div>

                    <span
                      className={`badge ${
                        b.status === "Confirmed"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* GALLERY */}
            {activeTab === "gallery" && (
              <div className="card shadow border-0 p-5 text-center rounded-4">
                <h5>Upload Gallery</h5>

                <div className="alert alert-info mt-3 mb-4 text-start">
                  📸 <strong>Reminder:</strong> Add high-quality photos of rooms,
                  lobby, and amenities to attract more customers.
                </div>

                {/* ✅ MULTIPLE IMAGE UPLOAD */}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="form-control mb-4"
                  onChange={handleGalleryUpload}
                />

                {/* PREVIEW GRID */}
                {galleryImages.length > 0 ? (
                  <div className="row g-3">
                    {galleryImages.map((img, i) => (
                      <div key={i} className="col-6 col-md-4 col-lg-3">
                        <img
                          src={img}
                          alt={`gallery-${i}`}
                          className="img-fluid rounded shadow-sm"
                          style={{ height: 150, objectFit: "cover", width: "100%" }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-2 p-5 text-muted rounded">
                    Drag & Drop Hotel Photos Here
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}