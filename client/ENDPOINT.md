# 📌 API Documentation

## 🚀 Overview

This document provides a comprehensive guide to the API endpoints available in the Flask-based backend. Each endpoint is detailed with its request method, required parameters, and expected responses.

---

## 🛠 Base URL

`http://localhost:8000`

---

## 📍 Endpoints

### 1️⃣ **Generate Roadmap**

**Endpoint:** `/generate-roadmap`

**Method:** `POST`

**Description:** Generates a roadmap with relevant YouTube videos and PDF resources, then saves it to the database.

**Request Body:**

```json
{
  "input_value": "python developer roadmap",
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "roadmap_id": 1,
  "roadmap_name": "Python Developer Roadmap",
  "roadmap_components": [...],
  "pdf_links": [...],
  "total_components": 5
}
```

---

### 2️⃣ **Get User Roadmaps**

**Endpoint:** `/user-roadmaps`

**Method:** `POST`

**Description:** Retrieves all roadmaps associated with a specific user.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "Python Developer Roadmap",
    "roadmap_json": {...}
  }
]
```

---

### 3️⃣ **Mark Roadmap as Completed**

**Endpoint:** `/roadmaps/{roadmap_id}/complete`

**Method:** `PATCH`

**Description:** Updates the completion status of a roadmap.

**Request Body:**

```json
{
  "is_completed": 1
}
```

**Response:**

```json
{
  "message": "Roadmap completion status updated successfully"
}
```

---

### 4️⃣ **Get Roadmap by ID**

**Endpoint:** `/roadmaps/{roadmap_id}`

**Method:** `GET`

**Description:** Fetches a specific roadmap by its ID.

**Response:**

```json
{
  "id": 1,
  "name": "Python Developer Roadmap",
  "roadmap_json": {...}
}
```

---

### 5️⃣ **Get Specific Roadmap Component**

**Endpoint:** `/roadmaps/{roadmap_id}/component`

**Method:** `POST`

**Description:** Retrieves a specific component from a roadmap based on its ID and component index.

**Request Body:**

```json
{
  "component_number": 2
}
```

**Response:**

```json
{
  "id": 1,
  "name": "Python Developer Roadmap",
  "component": {...}
}
```
---
# WORK REMAINING
# 🎓 Certificate API Documentation

## 📌 **Endpoints**

### 1️⃣ **Get All Certificates**
**Endpoint:** `/certificate/`  
**Method:** `GET`  
**Description:** Retrieves all certificates.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Python Mastery",
    "started_at": "2024-01-01T00:00:00Z",
    "ended_at": "2024-02-01T00:00:00Z",
    "additionol_testseries_attempted": 5,
    "competition_battled": 3,
    "competition_won": 1,
    "user": 2
  }
]
```

---

### 2️⃣ **Create a Certificate**
**Endpoint:** `/certificate/`  
**Method:** `POST`  
**Description:** Creates a new certificate and emails it to the user. Dekh ye .. tera wo logic hai learning page me jab last component display hokar quiz dene ke baad ka hai ye logic okay?? .. ye data tu pure de sakta hai .. started at ,, ye sab baadme karte hai chahiye to .. abhi k liye baki data static rak de bas (user, name)ye matter karega cauze .. tera main data api/user se aata hai .. jaha pura context hai user ka .. udhar iske pure certificates bhi list hojaeynge  

**Request Body:**
```json
{
  "name": "Python Mastery",
  "started_at": "2024-01-01T00:00:00Z",
  "ended_at": "2024-02-01T00:00:00Z",
  "additionol_testseries_attempted": 5,
  "competition_battled": 3,
  "competition_won": 1,
  "user": 2
}
```
.. api/user me dekh ye update hojayega  kuch aise 
```json 
{
  "id": 9,
  "name": "Fareed Sayed",
  "email": "fareedsayed95@gmail.com",
  "is_staff": false,
  "is_company": false,
  "testimonial": [
    {
      "id": 1,
      "name": "Fareed Sayed",
      "testimonial": "Had a very good response from the the template team..",
      "image": null,
      "created_at": "2024-12-16T14:53:26.537000Z",
      "user": 9
    }
  ],
  "certificate": [
    {
      "id": 10,
      "name": "Python Mastery Certificate",
      "started_at": "2023-05-01T10:00:00Z",
      "ended_at": "2023-11-01T18:00:00Z",
      "additionol_testseries_attempted": 5,
      "competition_battled": 3,
      "competition_won": 2,
      "user": 9
    },
    {
      "id": 11,
      "name": "Djanfo Mastery Certificate",
      "started_at": "2023-05-01T10:00:00Z",
      "ended_at": "2023-11-01T18:00:00Z",
      "additionol_testseries_attempted": 5,
      "competition_battled": 3,
      "competition_won": 2,
      "user": 9
    }
  ]
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Python Mastery",
  "started_at": "2024-01-01T00:00:00Z",
  "ended_at": "2024-02-01T00:00:00Z",
  "additionol_testseries_attempted": 5,
  "competition_battled": 3,
  "competition_won": 1,
  "user": 2
}
```

---

### 3️⃣ **Generate a Certificate PDF**
**Endpoint:** `/certificate-generate/{id}/`  
**Method:** `GET`  
**Description:** Generates and downloads the certificate as a PDF.

**Response:**
- Returns a PDF file with the certificate.

---
# Portfolio

This API allows users to manage their details, tools, education, certificates, projects, and links.

## Endpoints

### User Details

- **Get User Details by Email**
  - `GET /userdetails/<email>/`
  - Response: User details for the given email.
  - Bas idhar se tera pura portfolia ka data aaega samjha ?

- **Create User Details**
  - `POST /userdetails/`
  - Iski need nahi hai..login me hi user ka ban jayega baki patch request se data update karlena 
  - Request Body:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "phone_number": "1234567890",
      "about": "Software Engineer"
    }
    ```
  - Response: Created user details.

- **Update User Details**
  - `PATCH /userdetails/<email>/`
  - Request Body: Partial update fields.
  - Response: Updated user details.

- **Delete User**
  - `DELETE /userdetails/<email>/`
  - Response: Success message.
  - Iski bhi need nahi hai 

### Tools

- **Get All Tool Names**
  - `GET /toolnames/`
  - Response: List of tool names.

- **Create a Tool Name**
  - `POST /toolnames/`
  - Request Body:
    ```json
    {
      "name": "Tools",
      "user": 1
    }
    ```

    Tere frontend me same use hua hai samajh aise 
    ```json
    {
      "name": "Tech stack",
      "user": 1
    }
    ```
  - Response: Created tool name.

- **Get All Tools**
  - `GET /tools/`
  - Response: List of tools.

- **Create a Tool**
  - `POST /tools/`
  - Request Body:
    ```json
    {
      "name": "Excel",
      "tool_name": 1
    }
    ```

    Same chiz tere frontend me
     ```json
    {
      "name": "Frontend",
      "tool_name": 1
    }
    ```
  - Response: Created tool.

- **Get All Tool Components**
  - `GET /toolcomponents/`
  - Response: List of tool components.

- **Create a Tool Component**
  - `POST /toolcomponents/`
  - Request Body:
    ```json
    {
      "name": "Advance formulas",
      "tool": 1
    }
    ```
    same chiz tere frontend me 
     ```json
    {
      "name": "React",
      "tool": 1
    }
    ```
  - Response: Created tool component.

### Education

- **Get All Education Entries**
  - `GET /education/`
  - Response: List of education entries.

- **Add an Education Entry**
  - `POST /education/`
  - Request Body:
    ```json
    {
      "user": 1,
      "degree": "B.Tech",
      "field_of_study": "Computer Science",
      "University": "ABC University",
      "location": "New York",
      "start_date": "2020-01-01",
      "end_date": "2024-01-01",
      "current_grade": "A"
    }
    ```
  - Response: Created education entry.

### Certificates

- **Get All Certificates**
  - `GET /certificates/`
  - Response: List of certificates.

- **Add a Certificate**
  - `POST /certificates/`
  - Request Body:
    ```json
    {
      "user": 1,
      "name": "AWS Certified Developer",
      "gained_on": "2023-06-15"
    }
    ```
  - Response: Created certificate.

### Projects

- **Get All Projects**
  - `GET /projects/`
  - Response: List of projects.

- **Add a Project**
  - `POST /projects/`
  - Request Body:
    ```json
    {
      "user": 1,
      "name": "E-commerce App",
      "description": "A full-stack web application for online shopping."
    }
    ```
  - Response: Created project.

### Links

- **Get All Links**
  - `GET /links/`
  - Response: List of project links.

- **Add a Link**
  - `POST /links/`
  - Request Body:
    ```json
    {
      "project": 1,
      "name": "GitHub Repo",
      "url": "https://github.com/example"
    }
    ```
  - Response: Created link.

## Notes
- Ensure that the `user` field references a valid user in the database.
- All date fields should be in `YYYY-MM-DD` format.
- The API follows RESTful principles and uses appropriate HTTP methods.
- Responses follow standard HTTP status codes:
  - `200 OK` for successful requests.
  - `201 Created` for successfully created resources.
  - `400 Bad Request` for validation errors.
  - `404 Not Found` when the requested resource does not exist.
  - `204 No Content` for successful deletions.




---

## 📝 Notes

- Ensure that all request bodies are formatted in valid JSON.
- Replace `{roadmap_id}` in the URLs with the actual roadmap ID when making requests.
- If authentication is required, ensure valid credentials are included before making API calls.

📩 For any issues or further clarifications, contact the backend team! 🚀
Fareed Sayed - `9987580370`/ `fareedsayedprsnl@gmail.com`
