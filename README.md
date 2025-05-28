# Lab6_software

# Github Repository
https://github.com/FrancOlano/Lab6_software

# Library Reservations App

This is a full-stack application for managing library book reservations. Users can register with their email, view and reserve books, and cancel reservations. Administrators can add new books to the catalog.

## Used Prompt

**Prompt 1:**

This document outlines the required code architecture for the Library Reservations application, structured into three distinct layers. The programming AI should implement the following:

### I. Presentation Layer (Frontend)

**Purpose:** User interface and interaction  
**Features:**
- User Registration (email input, sign-up)
- Book Catalog (available books, search, "Reserve")
- User Reservations (list, "Cancel")
- Admin Book Management (add new books)
- Reusable UI components (layout, notifications, undo)

### II. Application Layer (Backend - Business Logic)

**Purpose:** Core logic and orchestration  
**Features:**
- `AuthService`: Registration and authentication
- `BookService`: Reservation logic, book availability
- `ReservationService`: Manage user reservations
- RESTful API design for frontend-backend communication

### III. Data Layer (Backend - Persistence)

**Purpose:** Data storage and retrieval  
**Features:**
- Data access for Users, Books, Reservations
- Relational database (or local data emulation for simplicity)
- ORM-style patterns to manage object-to-data mapping

The app includes undo actions, confirmation messages, and follows the user stories in the project brief.

### Prompt 2

Add CSS and run the app.

This prompt focused on styling the application to improve its visual presentation and user experience. Basic styling using CSS (or Tailwind CSS, if preferred) was added to all main components: the registration form, book catalog, and reservation list. After styling, the application was launched locally to verify layout, interaction flow, and UI responsiveness.

### Prompt 3

Create a local database using SQLite to store all specified data needed.

This prompt introduced persistence using a local SQLite database. Models and services were updated to use SQLite instead of in-memory arrays. Tables were created for Users, Books, and Reservations. CRUD operations were rewritten to interact with SQLite using a lightweight Node.js library (such as `sqlite3`). The goal was to store data persistently between sessions and support proper querying and filtering logic from the backend.


### Prompt 4

I have been working in separate user stories of the context.txt.
Check the code and fix any issues that may have appeared. 
Make sure that the acceptance criteria is passed.

## Screenshots

 


## Lessons Learned Using Copilot

Using GitHub Copilot was a huge help, especially for getting started quickly. It saved a lot of time by generating boilerplate code and suggesting functions that matched what we were trying to build. For example, when we needed to create components like the user registration form or the book catalog, Copilot often predicted exactly what we needed before we finished typing.

That said, it wasn’t perfect. We noticed that Copilot sometimes made assumptions that didn’t match our app’s logic, so we had to review and tweak the code quite a bit. Also, for more complex features (like undo actions or managing state across components), it needed clearer prompts and guidance.

In short, Copilot is great for speeding up the development process and reducing repetitive work, but it’s still important to understand your code and stay in control of the structure and logic.
