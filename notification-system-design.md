# Campus Notification Service API Specification

## Overview

This document defines the REST API specification for a Campus Notification Service. The platform enables students to receive important updates related to placements, campus events, examination results, and other academic announcements.

The API follows RESTful design principles, uses JSON for data exchange, and leverages standard HTTP methods and status codes. Real-time notification delivery is supported through Socket.IO-based WebSocket communication.

---

# Notification Resource

```json
{
  "id": "uuid",
  "type": "Placement",
  "title": "Placement Drive",
  "message": "TCS Corporation is hiring.",
  "isRead": false,
  "createdAt": "2026-04-22T17:51:18Z"
}
```

---

# Standard HTTP Headers

## Request Headers

```http
Content-Type: application/json
Accept: application/json
```

## Response Headers

```http
Content-Type: application/json
```

---

# 1. Retrieve Notifications

## Endpoint

```http
GET /api/notifications
```

## Description

Retrieves the list of notifications associated with the authenticated student.

## Query Parameters

| Parameter | Type    | Required | Description                                                 |
| --------- | ------- | -------- | ----------------------------------------------------------- |
| page      | Integer | No       | Page number for pagination                                  |
| limit     | Integer | No       | Maximum number of records per page                          |
| type      | String  | No       | Filter notifications by category (Placement, Event, Result) |

## Sample Request

```http
GET /api/notifications?page=1&limit=10&type=Placement
```

## Success Response (200 OK)

```json
{
  "success": true,
  "page": 1,
  "limit": 10,
  "total": 250,
  "notifications": [
    {
      "id": "1",
      "type": "Placement",
      "title": "Placement Drive",
      "message": "Amazon hiring",
      "isRead": false,
      "createdAt": "2026-04-22T17:51:18Z"
    }
  ]
}
```

---

# 2. Retrieve a Notification

## Endpoint

```http
GET /api/notifications/{id}
```

## Sample Request

```http
GET /api/notifications/123
```

## Success Response (200 OK)

```json
{
  "success": true,
  "notification": {
    "id": "123",
    "type": "Result",
    "title": "Semester Result",
    "message": "Results published",
    "isRead": false,
    "createdAt": "2026-04-22T17:51:18Z"
  }
}
```

---

# 3. Create a Notification

## Endpoint

```http
POST /api/notifications
```

## Request Body

```json
{
  "type": "Placement",
  "title": "Placement Drive",
  "message": "Microsoft is hiring."
}
```

## Success Response (201 Created)

```json
{
  "success": true,
  "message": "Notification created successfully.",
  "notificationId": "12345"
}
```

---

# 4. Mark a Notification as Read

## Endpoint

```http
PATCH /api/notifications/{id}/read
```

## Description

Marks a specific notification as read.

## Success Response (200 OK)

```json
{
  "success": true,
  "message": "Notification status updated successfully."
}
```

---

# 5. Mark All Notifications as Read

## Endpoint

```http
PATCH /api/notifications/read-all
```

## Success Response (200 OK)

```json
{
  "success": true,
  "message": "All notifications have been marked as read."
}
```

---

# 6. Delete a Notification

## Endpoint

```http
DELETE /api/notifications/{id}
```

## Success Response (200 OK)

```json
{
  "success": true,
  "message": "Notification removed successfully."
}
```

---

# HTTP Status Codes

| Status Code | Description                           |
| ----------- | ------------------------------------- |
| 200         | Request processed successfully        |
| 201         | Resource created successfully         |
| 400         | Invalid request parameters            |
| 404         | Requested notification does not exist |
| 500         | Internal server error                 |

---

# Error Response Format

```json
{
  "success": false,
  "message": "Notification not found."
}
```

---

# Real-Time Notification Delivery

## Communication Protocol

**Socket.IO (WebSocket)**

## Notification Workflow

1. The student signs in to the application.
2. A WebSocket connection is established with the server.
3. The server maintains an active socket session for the student.
4. An administrator creates a new notification.
5. The notification is stored in the database.
6. The server instantly broadcasts the notification to the intended recipient(s).
7. Connected students receive the notification in real time without refreshing the application.

## Event Name

```text
new-notification
```

## Event Payload

```json
{
  "id": "123",
  "type": "Placement",
  "title": "Placement Drive",
  "message": "Amazon hiring",
  "createdAt": "2026-04-22T17:51:18Z"
}
```

---

# API Reference Summary

| Method | Endpoint                     | Description                      |
| ------ | ---------------------------- | -------------------------------- |
| GET    | /api/notifications           | Retrieve all notifications       |
| GET    | /api/notifications/{id}      | Retrieve a specific notification |
| POST   | /api/notifications           | Create a new notification        |
| PATCH  | /api/notifications/{id}/read | Mark a notification as read      |
| PATCH  | /api/notifications/read-all  | Mark all notifications as read   |
| DELETE | /api/notifications/{id}      | Delete a notification            |

---

# API Design Standards

* Resource paths use plural nouns for consistency.
* HTTP methods follow RESTful conventions.
* All request and response payloads are exchanged in JSON format.
* Each notification is uniquely identified using a UUID.
* Date and time values follow the ISO 8601 standard.
* API responses maintain a consistent structure to simplify client-side integration.
* Pagination support is provided for efficient retrieval of large datasets.
* Real-time updates are delivered using Socket.IO over WebSocket connections.

---
