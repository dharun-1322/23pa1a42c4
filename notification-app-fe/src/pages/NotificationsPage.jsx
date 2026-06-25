import { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Pagination,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";
import { useNotifications } from "../hooks/useNotifications";
import Log from "../lib/logger";

export function NotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const {
    notifications,
    totalPages,
    loading,
    error,
    unreadCount,
    viewedIds,
    markAsViewed,
  } = useNotifications({ filter, page });

  useEffect(() => {
    Log("backend", "info", "page", "Notifications page loaded");
  }, []);

  function handleFilterChange(newFilter) {
    setFilter(newFilter);
    setPage(1);
  }

  function handlePageChange(_, newPage) {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  }

  return (
    <Box
      sx={{
        maxWidth: 850,
        mx: "auto",
        px: 2,
        py: 4,
      }}
    >
      {/* Header */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 4,
          background:
            "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
          boxShadow: 4,
        }}
      >
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <NotificationsActiveIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Notifications
                </Typography>
                <Typography variant="body2">
                  Stay updated with important announcements
                </Typography>
              </Box>
            </Stack>

            <Chip
              label={`${unreadCount} Unread`}
              color="secondary"
              sx={{
                fontWeight: 600,
                bgcolor: "white",
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Filter Section */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          position: "sticky",
          top: 10,
          zIndex: 10,
        }}
      >
        <NotificationFilter
          value={filter}
          onChange={handleFilterChange}
        />
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
          <CircularProgress size={50} />
        </Box>
      )}

      {/* Error */}
      {!loading && error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          Failed to load notifications: {error}
        </Alert>
      )}

      {/* Empty State */}
      {!loading && !error && notifications.length === 0 && (
        <Paper
          sx={{
            textAlign: "center",
            p: 5,
            borderRadius: 3,
          }}
        >
          <Typography variant="h6">
            No Notifications Found
          </Typography>
          <Typography color="text.secondary">
            Try changing the selected filter.
          </Typography>
        </Paper>
      )}

      {/* Notifications */}
      {!loading && !error && notifications.length > 0 && (
        <Stack spacing={2}>
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.ID}
              notification={notification}
              viewed={viewedIds.has(notification.ID)}
              onView={() => markAsViewed(notification.ID)}
            />
          ))}
        </Stack>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}