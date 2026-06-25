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
# Stage 2: Database Selection and Design

## Database Selection

For the notification platform, **MongoDB** is the preferred database for storing notification data.

MongoDB is a NoSQL document database that provides flexibility, scalability, and high write performance, making it well suited for applications that generate and manage large volumes of notifications.

---

# Why MongoDB?

MongoDB offers several advantages for a notification management system:

### Document-Oriented Storage

Data is stored as BSON documents (JSON-like structures), making it easy to represent notification records and related information.

### High Write Performance

Notification systems frequently generate new records. MongoDB is optimized for fast insert operations, enabling efficient handling of high notification throughput.

### Horizontal Scalability

MongoDB supports sharding, allowing data to be distributed across multiple servers as application usage grows.

### Flexible Schema

New fields can be added to notification documents without requiring schema migrations or structural changes to existing records.

### Node.js Integration

MongoDB integrates seamlessly with Node.js applications through the Mongoose ODM, simplifying data modeling and database interactions.

---

# Database Collections

## students Collection

```json id="t7q2am"
{
  "_id": ObjectId,
  "name": "PEDADA SAI KRISHNA",
  "email": "23pa1a4287@vishnu.edu.in",
  "createdAt": ISODate("2026-04-22T17:51:18Z")
}
```

This collection stores student account information.

---

## notifications Collection

```json id="r4h2cx"
{
  "_id": ObjectId,
  "studentId": ObjectId,
  "type": "Placement",
  "title": "Placement Drive",
  "message": "Microsoft is hiring",
  "isRead": false,
  "createdAt": ISODate("2026-04-22T17:51:18Z")
}
```

This collection stores notification records associated with students.

---

# Data Relationship

The relationship between students and notifications is **one-to-many**.

A single student can receive multiple notifications over time.

```text id="wm5t8x"
Student
   │
   ├── Notification
   ├── Notification
   └── Notification
```

The relationship is maintained using the `studentId` field stored in each notification document.

---

# Indexing Strategy

To optimize query performance and reduce collection scans, the following indexes should be created.

```javascript id="zgc4lj"
db.notifications.createIndex({ studentId: 1 })

db.notifications.createIndex({ studentId: 1, isRead: 1 })

db.notifications.createIndex({ type: 1 })

db.notifications.createIndex({ createdAt: -1 })
```

## Purpose of These Indexes

| Index                | Benefit                                                |
| -------------------- | ------------------------------------------------------ |
| `studentId`          | Fast retrieval of notifications for a specific student |
| `studentId + isRead` | Efficient filtering of unread/read notifications       |
| `type`               | Faster category-based searches                         |
| `createdAt`          | Improved sorting by creation date                      |

These indexes help MongoDB locate matching documents efficiently without scanning the entire collection.

---

# Challenges with Large Datasets

As the notification platform grows, several performance challenges may emerge.

### Slower Queries

Queries become increasingly expensive when appropriate indexes are missing.

### Higher Memory Usage

Loading large numbers of notification documents consumes additional memory and server resources.

### Sorting Overhead

Ordering records by creation time requires extra processing, particularly when indexes are unavailable.

### Increased Latency

As the collection size grows, query execution times may increase if optimization strategies are not implemented.

---

# Performance Optimization Techniques

To maintain efficient performance at scale, the following best practices should be applied.

### Index Frequently Queried Fields

Create indexes on fields commonly used in filtering, sorting, and searching operations.

### Implement Pagination

Use `skip()` and `limit()` to retrieve data in smaller batches rather than loading all notifications at once.

### Use Projections

Return only the required fields instead of entire documents to reduce data transfer and memory usage.

### Archive Historical Data

Move old or inactive notifications to a separate archive collection to keep active collections smaller and faster.

### Enable Sharding

Distribute notification data across multiple shards when the dataset becomes very large.

### Use Redis Caching

Cache frequently requested notification data to reduce database load and improve response times.

---

# MongoDB Operations

## Retrieve Notifications

```javascript id="jwxlqe"
db.notifications
.find({ studentId: ObjectId(studentId) })
.sort({ createdAt: -1 })
.skip(0)
.limit(10)
```

### Description

Retrieves a paginated list of notifications for a specific student, sorted from newest to oldest.

---

## Retrieve a Single Notification

```javascript id="f8zjj2"
db.notifications.findOne({
    _id: ObjectId(notificationId)
})
```

### Description

Retrieves a single notification using its unique identifier.

---

## Insert a New Notification

```javascript id="v87go3"
db.notifications.insertOne({
    studentId: ObjectId(studentId),
    type: "Placement",
    title: "Placement Drive",
    message: "Microsoft is hiring",
    isRead: false,
    createdAt: new Date()
})
```

### Description

Creates a new notification document and stores it in the collection with the current timestamp.

---

## Mark One Notification as Read

```javascript
db.notifications.updateOne(
    {
        _id: ObjectId(notificationId)
    },
    {
        $set: {
            isRead: true
        }
    }
)
```

### Description

Updates the read status of a specific notification.

---

## Mark All Notifications as Read

```javascript
db.notifications.updateMany(
    {
        studentId: ObjectId(studentId)
    },
    {
        $set: {
            isRead: true
        }
    }
)
```

### Description

Marks all notifications belonging to a particular student as read.

---

## Delete a Notification

```javascript
db.notifications.deleteOne({
    _id: ObjectId(notificationId)
})
```

### Description

Deletes a notification document based on its unique identifier.

---

# Summary

* MongoDB is selected due to its flexible document model, high write performance, and scalability.
* Student and notification data are stored in separate collections connected through the `studentId` field.
* Proper indexing improves filtering, sorting, and retrieval performance.
* Pagination, projections, caching, archiving, and sharding help maintain efficiency as data volume increases.
* MongoDB provides straightforward operations for creating, retrieving, updating, and deleting notifications.
* The architecture is designed to support future growth while maintaining fast and reliable access to notification data.
# Stage 3: Query Evaluation and Optimization

## Existing Query

```sql
SELECT *
FROM notifications
WHERE student_id = 1042
AND is_read = FALSE
ORDER BY created_at ASC;
```

## Query Assessment

The query is functionally correct and returns all unread notifications belonging to the student with ID **1042**, sorted in chronological order based on the notification creation timestamp.

While the query produces the desired result, its performance may degrade significantly as the size of the `notifications` table grows to millions of records.

---

# Performance Considerations

## 1. Use of `SELECT *`

The query retrieves every column from the table, regardless of whether all fields are required by the application.

In most notification systems, the user interface typically displays only a subset of attributes such as:

* Notification ID
* Title
* Message
* Category/Type
* Creation Timestamp

Fetching unnecessary columns increases:

* Disk I/O operations
* Memory consumption
* Network bandwidth usage

Selecting only the required fields reduces overall resource utilization and improves response time.

---

## 2. Missing Indexes

If the filtering columns are not indexed, the database must perform a full table scan to locate matching records.

For large datasets, this means examining every row before identifying notifications that satisfy:

```sql
student_id = 1042
AND is_read = FALSE
```

As data volume increases, query execution becomes progressively slower.

---

## 3. Sorting Cost

The query sorts results using:

```sql
ORDER BY created_at ASC
```

Without an appropriate index, the database must perform an additional sorting operation after filtering the records.

Sorting large result sets can become expensive in terms of CPU and memory usage.

---

# Optimized Query

A more efficient approach is to retrieve only the columns required by the application.

```sql
SELECT
    id,
    title,
    message,
    type,
    created_at
FROM notifications
WHERE student_id = 1042
AND is_read = FALSE
ORDER BY created_at ASC;
```

### Benefits

* Reduces data retrieval overhead
* Minimizes network traffic
* Improves memory efficiency
* Enhances overall query performance

---

# Recommended Index

A composite index matching the filtering and sorting pattern of the query provides the greatest performance benefit.

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(student_id, is_read, created_at);
```

## Advantages of This Index

The database can:

1. Quickly locate records for a specific student.
2. Filter unread notifications efficiently.
3. Return records in chronological order directly from the index.

As a result, both lookup and sorting costs are significantly reduced.

---

# Complexity Analysis

## Without Indexing

The database performs a full table scan followed by a sorting operation.

| Operation | Complexity |
| --------- | ---------- |
| Search    | O(n)       |
| Sort      | O(n log n) |

Performance deteriorates as the number of notifications increases.

---

## With the Composite Index

The database can directly navigate to the relevant portion of the index.

| Operation     | Complexity |
| ------------- | ---------- |
| Index Lookup  | O(log n)   |
| Fetch Results | O(k)       |

Where **k** represents the number of matching notifications.

Because the index already maintains the desired ordering, an additional sorting step is often unnecessary.

---

# Should Every Column Be Indexed?

No.

Although indexes improve read performance, indexing every column is generally considered poor database design.

## Drawbacks of Excessive Indexing

* Increased storage requirements
* Slower INSERT operations
* Slower UPDATE operations
* Slower DELETE operations
* Higher maintenance overhead
* More expensive backup and recovery processes

Additionally, many indexes may never be used by the query optimizer.

## Recommended Practice

Create indexes only on columns that are frequently used for:

* Filtering (`WHERE`)
* Joining (`JOIN`)
* Sorting (`ORDER BY`)
* Searching

This provides the best balance between read and write performance.

---

# Additional SQL Query

## Requirement

Retrieve the IDs of students who received **Placement** notifications during the previous seven days.

```sql
SELECT DISTINCT student_id
FROM notifications
WHERE type = 'Placement'
AND created_at >= NOW() - INTERVAL 7 DAY;
```

---

# Recommended Index

```sql
CREATE INDEX idx_notifications_type_created
ON notifications(type, created_at);
```

## Benefits

This index allows the database to:

1. Quickly locate notifications of type **Placement**.
2. Restrict the search to recently created records.
3. Minimize unnecessary table scanning.

The result is faster execution and improved scalability.

---

# Summary

* The original query is functionally correct but may become inefficient on large datasets.
* Avoid using `SELECT *` when only specific columns are required.
* Composite indexes greatly improve filtering and sorting performance.
* The index `(student_id, is_read, created_at)` is well suited for unread notification retrieval.
* Proper indexing reduces query complexity from a full table scan to efficient index-based lookups.
* Indexing every column is not recommended due to storage and write-performance overhead.
* For recent placement notification searches, an index on `(type, created_at)` provides optimal performance.
# Stage 4: Performance Enhancement Strategy

## Overview

As the notification platform grows to support a larger student base and an increasing volume of notifications, depending entirely on the database for every request can lead to higher response times and increased backend load.

To improve scalability and performance, I would introduce:

* **Redis** as a high-speed caching layer
* **Socket.IO** for real-time notification delivery

Together, these technologies help reduce database pressure while ensuring instant updates for users.

---

# Why Caching Is Important

Caching is an essential optimization technique for high-traffic applications.

Instead of querying the database repeatedly for the same information, frequently accessed data can be stored temporarily in memory and served directly to users.

### Benefits of Caching

* Faster response times
* Reduced database workload
* Lower server resource consumption
* Improved application scalability

For this system, **Redis** is an ideal choice because it is an in-memory key-value store designed for extremely fast read and write operations with very low latency.

---

# Notification Retrieval Flow

The notification retrieval process would follow a cache-first approach.

### Step 1: User Requests Notifications

A student requests their notification list through the application.

### Step 2: Check Redis Cache

The backend first checks whether the requested notification data exists in Redis.

### Step 3: Cache Hit

If the data is available in Redis:

* Notifications are retrieved directly from memory.
* No database query is required.
* The response is returned immediately.

### Step 4: Cache Miss

If the data is not found in Redis:

* The backend queries the MySQL database.
* The retrieved notifications are returned to the user.
* The same data is stored in Redis for future requests.

### Result

Subsequent requests can be served from Redis, significantly reducing database access and improving overall performance.

---

# Cache Consistency Management

Caching is beneficial only when the cached data remains consistent with the database.

Whenever notification data changes, the cache must be updated accordingly.

### Events Requiring Cache Updates

* Notification creation
* Notification updates
* Marking notifications as read
* Notification deletion

### Cache Invalidation Strategy

A simple and reliable approach is:

1. Apply the change in MySQL.
2. Remove the affected user's cached notifications from Redis.
3. Allow the next request to fetch fresh data from MySQL.
4. Store the updated result back into Redis.

This strategy ensures that users always receive the latest notification information while still benefiting from caching.

---

# Real-Time Notification Delivery

To provide instant updates without requiring users to refresh the application, I would integrate **Socket.IO**, which operates on top of WebSocket communication.

### Real-Time Workflow

1. A user signs in to the application.
2. The client establishes a persistent Socket.IO connection with the server.
3. A new notification is generated by an administrator or system process.
4. The notification is stored in MySQL.
5. Any Redis cache related to the affected user is invalidated.
6. The server emits a `new-notification` event through Socket.IO.
7. Connected clients receive the notification immediately.
8. The user interface updates in real time without a page refresh.

---

# Combining Redis and Socket.IO

Although Redis and Socket.IO are frequently used together, they address different performance challenges.

## Redis Responsibilities

* Caches frequently requested notification data
* Reduces database queries
* Accelerates read operations
* Improves scalability

## Socket.IO Responsibilities

* Maintains persistent client-server connections
* Enables server-to-client communication
* Delivers notifications instantly
* Eliminates the need for polling or manual refreshes

Together, they create a highly responsive and scalable notification platform.

---

# Architectural Benefits

Implementing Redis and Socket.IO provides several advantages:

### Performance Benefits

* Lower response latency
* Faster notification retrieval
* Reduced database load

### Scalability Benefits

* Better handling of large numbers of users
* Improved performance during peak traffic
* Efficient resource utilization

### User Experience Benefits

* Instant notification delivery
* No page refresh required
* Smooth and responsive interactions

---

# Summary

To enhance the performance and scalability of the notification platform:

* **Redis** should be used as a caching layer to reduce database access and accelerate notification retrieval.
* A **cache-first strategy** should be implemented, serving data from Redis whenever possible.
* Cache consistency should be maintained through proper invalidation whenever notification data changes.
* **Socket.IO** should be integrated to provide real-time notification delivery through persistent WebSocket connections.
* The combination of Redis and Socket.IO results in faster responses, reduced backend workload, improved scalability, and a better user experience.
# Stage 5: Asynchronous Notification Processing

## Overview

As the notification platform scales to support a growing number of users and increasing notification traffic, delivering notifications synchronously through the API can introduce latency and reduce system responsiveness.

To improve scalability, reliability, and fault tolerance, I would introduce a message broker such as **RabbitMQ** between the Notification API and the notification delivery service.

Instead of sending notifications directly during the API request cycle, the application stores the notification in the database and publishes a message to RabbitMQ. Dedicated background workers then consume messages from the queue and handle delivery independently.

This architecture decouples notification creation from notification delivery, allowing the system to process requests more efficiently.

---

# Notification Processing Workflow

The notification lifecycle would follow the sequence below:

### Step 1: Persist Notification

The Notification API receives a request and stores the notification in the MySQL database.

### Step 2: Publish Message

After successful persistence, the API publishes a notification message to RabbitMQ.

### Step 3: Queue Storage

RabbitMQ places the message into the appropriate queue and makes it available for processing.

### Step 4: Message Consumption

A background worker continuously listens for incoming messages and retrieves them from the queue.

### Step 5: Notification Delivery

The worker processes the message and delivers the notification to the intended user through Socket.IO.

### Step 6: Retry Handling

If delivery fails due to a temporary issue such as a network interruption or service outage, the worker automatically retries the operation a predefined number of times.

### Step 7: Dead Letter Queue (DLQ)

If the notification still cannot be delivered after all retry attempts, RabbitMQ moves the message to a **Dead Letter Queue (DLQ)** for further investigation, monitoring, or manual processing.

---

# Why Asynchronous Processing?

In a synchronous design, the API must wait for the notification delivery process to complete before responding to the client.

With asynchronous processing:

* The notification is queued immediately.
* The API responds without waiting for delivery.
* Background workers handle delivery separately.

This significantly improves application responsiveness and user experience.

---

# Architectural Benefits

Using RabbitMQ as a message broker provides several advantages.

## Faster API Responses

Notification delivery occurs in the background, allowing API requests to complete quickly.

## Independent Scalability

Worker processes can be scaled independently based on notification volume without affecting the API layer.

## Improved Reliability

Built-in retry mechanisms help recover from temporary failures and increase delivery success rates.

## Fault Tolerance

Failed messages are preserved in a Dead Letter Queue rather than being lost, enabling troubleshooting and recovery.

## Traffic Spike Management

RabbitMQ acts as a buffer between producers and consumers, smoothing sudden surges in notification traffic and preventing backend overload.

## Better System Decoupling

The API and notification delivery services operate independently, making the architecture easier to maintain and extend.

---

# High-Level System Architecture

```text
Client
   │
   ▼
Notification API
   │
   ▼
MySQL Database
   │
   ▼
RabbitMQ Exchange / Queue
   │
   ▼
Background Worker
   │
   ▼
Socket.IO Server
   │
   ▼
Connected Users
```

---

# Component Responsibilities

| Component               | Responsibility                                                   |
| ----------------------- | ---------------------------------------------------------------- |
| Client                  | Sends notification requests and receives updates                 |
| Notification API        | Validates requests, stores notifications, and publishes messages |
| MySQL Database          | Persists notification records                                    |
| RabbitMQ                | Queues notification delivery tasks                               |
| Background Worker       | Consumes and processes queued messages                           |
| Socket.IO Server        | Delivers notifications in real time                              |
| Dead Letter Queue (DLQ) | Stores messages that repeatedly fail processing                  |

---

# Summary

To build a scalable and fault-tolerant notification platform:

* Notifications should be stored in MySQL and published to RabbitMQ.
* Dedicated background workers should process queued messages and handle delivery.
* Notification delivery should occur asynchronously to keep API responses fast.
* Retry mechanisms should be implemented to handle transient failures.
* Messages that continue to fail should be moved to a Dead Letter Queue (DLQ) for further analysis.
* RabbitMQ helps absorb traffic spikes, improve reliability, and enable independent scaling of system components.

This architecture provides a robust foundation for handling large-scale notification workloads while maintaining responsiveness and reliability.
# Stage 6: Priority-Based Notification Display

## Overview

As the number of notifications grows, displaying them solely based on creation time may cause important updates to become less visible.

To improve usability and ensure students can quickly access critical information, notifications should be displayed according to their priority level rather than relying only on chronological order.

This approach ensures that the most important notifications appear at the top of the dashboard while still preserving recency within each category.

---

# Notification Priority Levels

The system assigns the following priority order to notification categories:

| Priority | Notification Type |
| -------- | ----------------- |
| 1        | Placement         |
| 2        | Result            |
| 3        | Event             |

Notifications with a higher priority are displayed before those with a lower priority.

For example:

* Placement notifications appear first.
* Result notifications appear after placement updates.
* Event notifications are displayed last.

---

# SQL Query

The following query retrieves notifications for a student and orders them according to the defined priority hierarchy.

```sql
SELECT *
FROM notifications
WHERE student_id = ?
ORDER BY
    CASE
        WHEN type = 'Placement' THEN 1
        WHEN type = 'Result' THEN 2
        WHEN type = 'Event' THEN 3
    END,
    created_at DESC;
```

### Query Logic

1. The `CASE` expression assigns a numeric priority to each notification category.
2. Notifications are first sorted based on their assigned priority.
3. Within the same category, notifications are sorted by `created_at DESC`.
4. The newest notifications appear first within each priority group.

---

# Benefits of Priority-Based Sorting

Implementing category-based prioritization provides several advantages.

## Improved Visibility of Critical Updates

Placement opportunities are always displayed at the top, ensuring students do not miss important career-related announcements.

## Better Academic Awareness

Result notifications receive higher priority than general announcements, helping students quickly access examination-related updates.

## Enhanced Organization

Notifications belonging to the same category are arranged from newest to oldest, making recent information easier to locate.

## Improved User Experience

Students can identify high-priority information immediately without scrolling through a long list of less important notifications.

---

# Example Display Order

Assume the following notifications exist:

| Type      | Title                      | Created At |
| --------- | -------------------------- | ---------- |
| Event     | Tech Fest Registration     | 10:00 AM   |
| Placement | Microsoft Hiring Drive     | 09:00 AM   |
| Result    | Semester Results Published | 11:00 AM   |
| Placement | Amazon Placement Drive     | 08:00 AM   |

The displayed order would be:

1. Microsoft Hiring Drive (Placement)
2. Amazon Placement Drive (Placement)
3. Semester Results Published (Result)
4. Tech Fest Registration (Event)

Even though some notifications are newer, the priority ranking ensures that more important categories appear first.

---

# Summary

Priority-based notification ordering significantly improves the effectiveness of the notification dashboard.

By combining:

* **Category-based prioritization** (Placement → Result → Event)
* **Chronological ordering** within each category

the system presents the most important updates first while maintaining a clear and organized notification list.

This approach enhances usability, improves visibility of critical information, and helps students stay informed about opportunities and academic updates in a timely manner.

