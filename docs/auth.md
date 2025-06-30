````markdown
# 🔐 Auth Routes

## POST /api/auth/register

Register a new user.

**Request Body:**

```json
{
  "firstName": "Jane Doe",
  "lastName": "jane@example.com",
  "email": "securepassword",
  "password": "securepassword"
}
```
````

**Response Body:**

```json
{
  "message": "User registered successfully",
  "token": "jwt-token"
}
```

## POST /api/auth/login

Login a new user.

**Request Body:**

```json
{
  "email": "jane@example.com",
  "password": "securepassword"
}
```

**Response Body:**

```json
{
  "message": "User login successfully",
  "token": "jwt-token"
}
```
