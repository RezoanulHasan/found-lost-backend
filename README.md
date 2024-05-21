# Lost and Found System

Welcome to the Lost and Found System! This system is designed to simplify the process of reporting and claiming lost items. Whether you've found an item and want to reunite it with its owner or you're looking to claim a lost possession, this system has got you covered.

## Live-link:  https://found-lost-project.vercel.app/

## Features

- **Report Found Items**: Users can report found items, providing details such as item name, description, location, and category.
- **Claim Lost Items**: Users can claim items they believe to be their lost possessions by providing relevant information and distinguishing features.
- **User Profiles**: Users have the option to create profiles, allowing them to share additional information about themselves.

## Technology use
- Prisma for PostgreSQL
- Node js
- Express js
- typescript
- JWT(validation)
- bcrypt (validation)
- Zod (validation)
- eslint ( code formatting and quality checking )
- prettier (maintain code structure)

## Proper Error handling
- Jwt Error
- Validation Error
- Cast Error
- Duplicate Entry
- Internal Server Error

## Models

1. **User Model**:
    - Fields: id, name, email, password, createdAt, updatedAt
    - Relationships: One-to-Many with FoundItem, One-to-Many with Claim, One-to-One with UserProfile

2. **FoundItemCategory Model**:
    - Fields: id, name, createdAt, updatedAt

3. **FoundItem Model**:
    - Fields: id, userId, categoryId, foundItemName, description, location, createdAt, updatedAt
    - Relationships: Belongs to one User, Belongs to one FoundItemCategory

4. **Claim Model**:
    - Fields: id, userId, foundItemId, status, distinguishingFeatures, lostDate, createdAt, updatedAt
    - Relationships: Belongs to one User, Belongs to one FoundItem

5. **UserProfile Model**:
    - Fields: id, userId, bio, age, createdAt, updatedAt
    - Relationships: Belongs to one User

## API Documentation
### 1. User Registration
This endpoint handles user registration, creating both the user account and corresponding user profile simultaneously using a transactional approach.

 **Endpoint**: `POST /api/register`
- **Method:** `POST`
- **Request Body:** data formate like this \*

```json

{
    "name": "your_name",
    "email": "your_email@example.com",
    "password": "your_password",

    "profile": {
        "bio": "your_bio",
        "age": your_age
		}
 }

```


### 2. User Login

- **Endpoint**: `POST /api/login`
- **Method:** `POST`
- **Request Body:** data formate like this \*

```json
{
  "email": "your_email",
  "password": "your_password"
}
```
### createFoundItemCategory

Creates a Found  category using the user's details extracted from the authorization token.

- **Endpoint**: `POST /api/found-item-categories`
- **Request Headers**:
  - Authorization: `<JWT_TOKEN>`

- **Method:** `POST`
- **Request Body:** data formate like this \*

```json
{
  "name": "category_name"
 
}
```

### 3. Report a Found Item

Creates a Found Item using the user's details extracted from the authorization token.

- **Endpoint**: `POST /api/found-items`
- **Request Headers**:
  - Authorization: `<JWT_TOKEN>`
 
- **Request Body:** data formate like this \*

```json
{
    "categoryId":"use_ID",
    "foundItemName": " choose_any_name",
    "description": " set_descripation ",
    "location": " set_locatoion"
}
```

### 4. Get Paginated and Filtered Found Items

When interacting with the API, you can utilize the following query parameters to customize and filter the results according to your preferences.

- **Endpoint**: `GET /api/found-items`
- **Query Parameters for API Requests**:
  - searchTerm: (Optional) Searches for items based on a keyword or phrase.
  - page: (Optional) Specifies the page number for paginated results. Default is 1.
  - limit: (Optional) Sets the number of items per page. Default is a predefined limit.
  - sortBy: (Optional) Specifies the field by which the results should be sorted.
  - sortOrder: (Optional) Determines the sorting order, either 'asc' (ascending) or 'desc' (descending).
  - foundItemName: (Optional) Filters results by the name of the found item.

### 5. Create a Claim

Creates a Claim using the user's details extracted from the authorization token.

- **Endpoint**: `POST /api/claims`
- **Request Headers**:
  - Authorization: `<JWT_TOKEN>`
 
- **Request Body:** data formate like this \*

```json
{
    "foundItemId": " use_ID",
    "distinguishingFeatures": "write feature",
    "lostDate": "2024-05-25T10:00:00Z"
}
```

### 6. Get Claims

- **Endpoint**: `GET /api/claims`
- **Request Headers**:
  - Authorization: `<JWT_TOKEN>`

### 7. Update Claim Status

- **Endpoint**: `PUT /api/claims/:claimId`
- **Request Headers**:
  - Authorization: `<JWT_TOKEN>`
 
- **Request Body:** data formate like this \*

```json
{
   status:" APPROVED or  REJECTED " ,
 
}
```

### 8. Get Profile

- **Endpoint**: `GET /api/my-profile`
- **Request Headers**:
  - Authorization: `<JWT_TOKEN>`

### 9. Update My Profile

- **Endpoint**: `PUT /api/my-profile`
- **Request Headers**:
  - Authorization: `<JWT_TOKEN>`
 
## For ADMIN 


### Get all user by 

- **Endpoint:** `/api/users`
- **Method:** `GET`
- **Access:** `admin`


### Get single user by ID

- **Endpoint:** `/api/users/:id`
- **Method:** `GET`
- **Access:** `admin`

### Delete a user
-  Delete form  user model and   user profile
- **Endpoint:** `/api/users/:id`
- **Method:** `Delete`
- **Access:** `admin`

### Update a user
- Update  user model and   user profile
- **Endpoint:** `/api/users/:id`
- **Method:** `PATCH`
- **Access:** `admin`

## Contributing

Contributions are welcome! Please check out the [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).


## Getting Started

 **Database Setup**:
    - Ensure PostgreSQL is installed and running.
    - Configure your database connection in the Prisma schema file (`schema.prisma`).
    - Run migrations:
        ```
        npx prisma migrate dev --name init
        ```
to set up and run projects locally
- download this repository
- npm install
- npm migrate
- npm run build
- npm run start: dev
