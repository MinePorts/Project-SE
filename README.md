# Go Backend API Documentation

This is the API documentation for the Go backend project. The API handles accounts, events, orders, and tickets management, along with region and topic filtering functionalities.

## Base URL

`http://localhost:5000`

## Endpoints

### Account Management

- **POST** `/register`
  - Create a new user account.
  - **Request Body**: JSON with user details (e.g., username, email, password).
  - **Response**: Created user object.

- **GET** `/account/:id`
  - Get details of a specific account by `id`.
  - **Response**: User account details.

- **GET** `/accounts`
  - Retrieve a list of all user accounts.
  - **Response**: List of user accounts.

- **POST** `/account/login`
  - User login endpoint.
  - **Request Body**: JSON with login credentials (e.g., email, password).
  - **Response**: Authentication token.

- **PUT** `/account/update/:id`
  - Update account information by `id`.
  - **Request Body**: JSON with updated user details.
  - **Response**: Updated user object.

- **DELETE** `/account/delete/:id`
  - Delete a user account by `id`.
  - **Response**: Success or error message.

### CAPTCHA Verification

- **GET** `/captcha`
  - Get a new CAPTCHA challenge.
  - **Response**: CAPTCHA image or details.

- **POST** `/verif`
  - Verify CAPTCHA input.
  - **Request Body**: CAPTCHA solution.
  - **Response**: Verification status.

### Event Management

- **POST** `/event`
  - Create a new event.
  - **Request Body**: JSON with event details (e.g., name, date, location, price).
  - **Response**: Created event object.

- **GET** `/events`
  - Retrieve a list of all events.
  - **Response**: List of events.

- **GET** `/event/:id`
  - Get details of a specific event by `id`.
  - **Response**: Event details.

- **DELETE** `/event/:id`
  - Delete an event by `id`.
  - **Response**: Success or error message.

- **GET** `/search/:query`
  - Search for events by query.
  - **Response**: List of events matching the query.

### Event Filtering

- **GET** `/filterRegion/:region`
  - Get events filtered by region.
  - **Response**: List of events in the specified region.

- **GET** `/GetRegion`
  - Get a list of distinct regions with events.
  - **Response**: List of regions.

- **GET** `/GetTopics`
  - Get a list of distinct topics from events.
  - **Response**: List of topics.

- **GET** `/GetRangePrice/:minPrice/:maxPrice`
  - Get events within a price range.
  - **Response**: List of events within the specified price range.

- **GET** `/GetEventRangeDate/:startDate/:endDate`
  - Get events within a date range.
  - **Response**: List of events happening between the specified start and end dates.

- **GET** `/GetFilterEvent`
  - Get filtered events based on multiple criteria.
  - **Response**: List of filtered events.

### Ticket Management

- **GET** `/GetTicket/:id`
  - Get ticket details by `id`.
  - **Response**: Ticket details.

- **POST** `/order`
  - Create an order for an event ticket.
  - **Request Body**: JSON with order details.
  - **Response**: Created order object.

- **GET** `/orders`
  - Retrieve a list of all orders.
  - **Response**: List of orders.

- **GET** `/orders/:userID`
  - Retrieve orders by user ID.
  - **Response**: List of orders for the specified user.

- **DELETE** `/order/:id`
  - Delete an order by `id`.
  - **Response**: Success or error message.

## Error Handling

Each endpoint responds with an appropriate HTTP status code and error message if something goes wrong (e.g., `404 Not Found`, `400 Bad Request`, `500 Internal Server Error`).

## Setup Instructions

1. Clone the repository.
2. Run `go mod tidy` to install dependencies.
3. Start the server using `go run main.go`.
4. The server will be running at `http://localhost:5000`.

## License

This project is licensed under the MIT License.
"# Project-SE" 
