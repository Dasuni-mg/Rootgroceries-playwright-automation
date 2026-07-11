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
    { value: "@@@", error: "Invalid name format" },

    // Edge
    { value: "A", error: "" },              // Site accepts "A" (no error shown)
    { value: "ABCDEFGHIJKLMNOPQRSTUVWXYZA", error: "Name cannot exceed 26 characters." }, // Above maximum

    // Security
    { value: "' OR '1'='1", error: "Invalid name format" },              // SQL Injection
    { value: "<script>alert(1)</script>", error: "Invalid name format" } // XSS
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
    { value: "abc", error: "Invalid email format" },
    { value: "john@", error: "Invalid email format" },

    // Edge
    { value: "a@b.co", error: "" }, // Minimum valid email
    { value: "user@.com", error: "Invalid email format" }, // Invalid domain

    // Security
    { value: "' OR '1'='1'@x.com", error: "Invalid email format" }, // SQL Injection
    { value: "<script>alert(1)</script>@x.com", error: "Invalid email format" } // XSS
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

  // Negative — empty triggers min-length check first
  { value: "", error: "Password must be at least 8 characters" },

  // Edge — minimum valid and maximum
  { value: "Aa1@aaaa", error: "" }, // Minimum valid (8 characters)

  // Security — scripts / injection
  { value: "' OR '1'='1", error: "Password must contain an uppercase letter, a digit, and a special character" },
  { value: "<script>alert(1)</script>", error: "Password cannot contain invalid characters" } // XSS
]

};
