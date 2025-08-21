# ⚙️ Places App (Backend)

Welcome to the **Places App Backend repository!**  
This backend is the backbone of the Places App, responsible for handling all **server-side logic, database operations, authentication, and third-party integrations**.  

It is built using **Node.js** and **Express**, with **MongoDB** as the database, and integrates **Cloudinary** for image hosting and the **Google Maps API** for location data.  

The backend ensures **secure user management**, **scalable data storage**, and **efficient communication** between the client-side application and external services.

---

## 🏗️ Architecture

The backend follows a **modular and layered architecture**:

- **Controllers** → Contain the logic for handling requests and responses (e.g., creating a user, fetching places).  
- **Routes** → Define REST API endpoints for users and places.  
- **Models** → Mongoose schemas for interacting with MongoDB.  
- **Middleware** → Custom middleware for authentication, error handling, and file uploads.  
- **Utils** → Helper functions such as location lookups using Google Maps API.  

This **separation of concerns** makes the codebase **clean, reusable, and easy to maintain**.

---

## 🛠️ Technologies Used and Relevant Skills

### Backend Framework
- **Node.js + Express** → Built RESTful APIs to handle HTTP requests and implement business logic.  

### Database
- **MongoDB + Mongoose**  
  - Used MongoDB as a NoSQL database for flexible document-based storage.  
  - Designed schemas with Mongoose for users and places.  
  - Implemented relations (e.g., linking places to their creators).  

### API Integration
- **Google Maps Geocoding API**  
  - Converts a given address into latitude/longitude coordinates.  
  - Ensures accurate location data storage for places.  

### Image Uploads & Media Handling
- **Cloudinary**  
  - Integrated Cloudinary to store, optimize, and deliver images.  
  - Replaced local storage with cloud hosting for scalability.  
  - Supports transformations and efficient CDN delivery.  

### Authentication & Security
- **JWT (JSON Web Tokens)** → Secured API routes and maintained authentication state.  
- **Bcrypt.js** → Encrypted user passwords for safe storage.  
- **Custom Middleware** → Checked authentication, handled errors, and validated requests.  

---

## 🔑 Core Responsibilities of Backend
- Provide secure endpoints for **signup, login, and managing places**.  
- Validate user input and handle request errors gracefully.  
- Store user and place data in MongoDB with references between collections.  
- Handle **image uploads via Cloudinary** and link uploaded images to places.  
- Convert **addresses → coordinates** with the Google Maps API.  
- Ensure that only authenticated users can **modify or delete their own data**.  

---

## 📂 Key Components
- **Controllers** → Handle logic for users (`users-controllers.js`) and places (`places-controllers.js`).  
- **Routes** → Define endpoints in `user-route.js` and `place-route.js`.  
- **Models** → Mongoose schemas for User and Place.  
- **Middleware** → Includes authentication checks (`check-auth.js`) and file uploads (`file-upload.js`).  
- **Utils** → Location utility for geocoding addresses.  

---

## ⚡ Data Flow Overview
1. A user sends a request from the frontend (e.g., login, add place).  
2. The request hits the Express server and is routed to the appropriate controller.  
3. If required, middleware validates authentication or processes file uploads.  
4. Controllers interact with MongoDB through Mongoose models.  
5. For places:  
   - Addresses are sent to the **Google Maps API** to fetch coordinates.  
   - Images are uploaded to **Cloudinary** and a URL is returned.  
6. The response is sent back to the frontend, ready to be displayed.  

---

## 📦 Example Backend Stack in Action
- **User Signup/Login** → Stored securely in MongoDB, JWT issued for authentication.  
- **Add Place** → Place stored in MongoDB with user reference, address converted to coordinates, image stored in Cloudinary.  
- **Fetch Places** → Returns all places linked to users with image URLs hosted on Cloudinary.  

---

## 🙏 Thank You!

Thank you for exploring this **Places App Backend project.**  
It demonstrates a **modern backend setup** with Node.js, Express, MongoDB, Cloudinary, and Google Maps API, forming a powerful service layer for full-stack applications.  

This backend ensures **security, scalability, and integration with cloud services**, making it **production-ready real-world projects**.
