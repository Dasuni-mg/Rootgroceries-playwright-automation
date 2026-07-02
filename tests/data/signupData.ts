const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export const signupData = {

  // Happy path with all fields
  validUser: {
    username: "janedoe",
    email: `jane${uid}@test.com`,
    phone: `077${uid.replace(/\D/g, '').slice(-7).padStart(7, '0')}`,
    password: "Secure@123"
  },

  // Happy path without phone (phone is optional)
  validUserWithoutPhone: {
    username: "johndoe",
    email: `john${uid}@test.com`,
    phone: "",
    password: "Pass@1234"
  },

  // Username (required — labeled "Name")
  // Requirement: 2–26 characters

  username: [
    // Positive
    { value: "Alice", error: "" },
    { value: "Ab", error: "" },                          // Minimum valid (2 chars)
    { value: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", error: "" }, // Maximum valid (26 chars)

    // Negative
    { value: "", error: "Name is required" },
    { value: "@@@", error: "Please enter a valid name" },

    // Edge
    { value: "A", error: "Name must be at least 2 characters." },              // Below minimum
    { value: "ABCDEFGHIJKLMNOPQRSTUVWXYZA", error: "Name cannot exceed 26 characters." }, // Above maximum

    // Security
    { value: "' OR '1'='1", error: "Please enter a valid name" },              // SQL Injection
    { value: "<script>alert(1)</script>", error: "Please enter a valid name" } // XSS
  ],


  // Phone (optional)
  // Requirement:
  // - Empty value is allowed
  // - Valid formats: 0712345678 or +94712345678

  phone: [
    // Positive
    { value: "", error: "" },                    // Optional field
    { value: "0712345678", error: "" },
    { value: "+94712345678", error: "" },

    // Negative
    { value: "abc123", error: "Please enter a valid phone number" },
    { value: "@#$%", error: "Please enter a valid phone number" },

    // Edge
    { value: "1", error: "Phone number must be 10 digits" },                // Below minimum
    { value: "1234567890123456", error: "Phone number cannot exceed 15 digits" }, // Above maximum

    // Security
    { value: "' OR '1'='1", error: "Please enter a valid phone number" },          // SQL Injection
    { value: "<script>alert('xss')</script>", error: "Please enter a valid phone number" } // XSS
  ],

  // Email (required)
  // Requirement: Valid email format

  email: [
    // Positive
    { value: "user@domain.com", error: "" },
    { value: "user+tag@domain.co.uk", error: "" },

    // Negative
    { value: "", error: "Email is required" },
    { value: "abc", error: "Please enter a valid email address" },
    { value: "john@", error: "Please enter a valid email address" },

    // Edge
    { value: "a@b.co", error: "" }, // Minimum valid email
    { value: "verylongemailaddress1234567890@averylongdomainnameexample.com", error: "" }, // Maximum valid (adjust if app has a limit)
    { value: "user@.com", error: "Please enter a valid email address" }, // Invalid domain

    // Security
    { value: "' OR '1'='1'@x.com", error: "Please enter a valid email address" }, // SQL Injection
    { value: "<script>alert(1)</script>@x.com", error: "Please enter a valid email address" } // XSS
  ],

// Password (required)
// Requirement:
// - Minimum 8 characters
// - At least 1 uppercase letter
// - At least 1 lowercase letter
// - At least 1 number
// - At least 1 special character

password: [
  // Positive
  { value: "Secure@123", error: "" },

  // Negative
  { value: "", error: "Password is required" },
  { value: "Ab1@", error: "Password must be at least 8 characters" },
  { value: "password", error: "Password must contain an uppercase letter, a number, and a special character" },
  { value: "PASSWORD", error: "Password must contain a lowercase letter, a number, and a special character" },
  { value: "Password", error: "Password must contain a number and a special character" },
  { value: "Password1", error: "Password must contain a special character" },

  // Edge
  { value: "Aa1@aaaa", error: "" }, // Minimum valid (8 characters)
  { value: "A".repeat(50) + "@1a", error: "" }, // Maximum valid (adjust to actual limit)
  { value: "A".repeat(51) + "@1a", error: "Password cannot exceed 50 characters" }, // Above maximum (if max is 50)

  // Security
  { value: "' OR '1'='1", error: "Password must contain a lowercase letter, a number, and a special character" }, // SQL Injection
  { value: "<script>alert(1)</script>", error: "Password cannot contain invalid characters" } // XSS
]

};
