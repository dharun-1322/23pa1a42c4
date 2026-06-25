import { useEffect } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

import { NotificationCard } from "../components/NotificationCard";
import { usePriorityNotifications } from "../hooks/usePriorityNotifications";
import Log from "../lib/logger";

export function PriorityNotificationsPage() {
  const { notifications, loading, error } = usePriorityNotifications(10);

  useEffect(() => {
    Log("backend", "info", "page", "Priority Notifications page loaded");
  }, []);

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        px: 3,
        py: 4,
      }}
    >
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          bgcolor: "#111827",
          color: "white",
        }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Priority Notifications
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Important updates ranked by priority
            </Typography>
          </Box>

          <Chip
            icon={<StarIcon />}
            label={`${notifications.length} Active`}
            color="warning"
          />
        </Stack>
      </Paper>

      {/* Loading */}
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 8,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* Error */}
      {!loading && error && (
        <Alert severity="error">
          Failed to load priority notifications: {error}
        </Alert>
      )}

      {/* Empty */}
      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">
          No priority notifications available.
        </Alert>
      )}

      {/* Timeline Layout */}
      {!loading && !error && notifications.length > 0 && (
        <Box sx={{ position: "relative" }}>
          {/* Vertical Line */}
          <Box
            sx={{
              position: "absolute",
              left: "18px",
              top: 0,
              bottom: 0,
              width: "3px",
              bgcolor: "#e0e0e0",
            }}
          />

          <Stack spacing={3}>
            {notifications.map((n, idx) => (
              <Box
                key={n.ID}
                sx={{
                  display: "flex",
                  gap: 2,
                  position: "relative",
                }}
              >
                {/* Timeline Dot */}
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "warning.main",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    zIndex: 1,
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 1, display: "block" }}
                  >
                    Priority Rank #{idx + 1}
                  </Typography>

                  <NotificationCard
                    notification={n}
                    viewed={false}
                    onView={() => {}}
                  />
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}s