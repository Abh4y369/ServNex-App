import React from 'react'
import { Box, Typography, Link, Grid, Divider } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #0a3a82, #0f62c5)",
        color: "white",
        px: { xs: 3, md: 10 },
        py: { xs: 4, md: 6 },
      }}
    >
      <Grid container spacing={4} alignItems="flex-start">
        {/* Left: Brand */}
        <Grid item xs={12} md={3}>
          <Typography variant="h5" fontWeight={700}>
            ServNex
          </Typography>
          <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)", mt: 1, width: "60%" }} />
        </Grid>

        {/* Center: Links */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            {[
              "About Us",
              "Services",
              "Help & Support",
              "Privacy Policy",
              "Terms & Conditions",
              "Contact",
            ].map((text) => (
              <Link
                key={text}
                href="#"
                underline="none"
                sx={{
                  color: "white",
                  fontSize: "14px",
                  "&:hover": { color: "#aad4ff" },
                }}
              >
                {text}
              </Link>
            ))}
          </Box>
        </Grid>

        {/* Right: Contact */}
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            textAlign: { xs: "left", md: "right" },
          }}
        >
          <Typography variant="body2">
            Email: <strong>support@servnex.com</strong>
          </Typography>
          <Typography variant="body2" mt={1}>
            Phone: <strong>+91 90000 00000</strong>
          </Typography>
        </Grid>
      </Grid>

      {/* Bottom */}
      <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)", my: 4 }} />

      <Typography align="center" sx={{ fontSize: "13px", opacity: 0.85 }}>
        © 2026 ServNex. All rights reserved.
      </Typography>
    </Box>
  )
}

export default Footer