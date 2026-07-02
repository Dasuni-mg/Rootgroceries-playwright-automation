export const signupData = {

  // Valid user for happy path
  validUser: {
    username: "john123",
    phone: "0771234567",
    email: "john@test.com",
    password: "Password@123"
  },

  // Username validation
  username: [
    // Required
    { value: "", error: "Username is required" },

    // Boundary
    { value: "ab", error: "Minimum 3 characters required" },
    { value: "abc", error: "" },                        // Minimum valid
    { value: "abcdefghijklmnopqrst", error: "" },       // Maximum valid (20 chars)
    { value: "abcdefghijklmnopqrstu", error: "Maximum 20 characters allowed" },

    // Positive
    { value: "john123", error: "" },
    { value: "john_doe", error: "" },

    // Negative
    { value: "john doe", error: "Username cannot contain spaces" },
    { value: "@john", error: "Invalid username" },
    { value: "' OR '1'='1", error: "Invalid username" },
    { value: "<script>alert(1)</script>", error: "Invalid username" }
  ],

  // Phone validation
  phone: [
    { value: "", error: "Phone number is required" },

    { value: "123456789", error: "Invalid phone number" },      // 9 digits
    { value: "0771234567", error: "" },                         // Valid
    { value: "07712345678", error: "Invalid phone number" },    // 11 digits

    { value: "abcdef", error: "Invalid phone number" },
    { value: "@#$%", error: "Invalid phone number" }
  ],

  // Email validation
  email: [
    { value: "", error: "Email is required" },

    { value: "abc", error: "Invalid email" },
    { value: "john@", error: "Invalid email" },
    { value: "john@gmail", error: "Invalid email" },

    { value: "john@gmail.com", error: "" }
  ],

  // Password validation
  password: [
    { value: "", error: "Password is required" },

    { value: "12345", error: "Password must be at least 8 characters" },
    { value: "password", error: "Password must contain uppercase, number and special character" },
    { value: "PASSWORD", error: "Password must contain lowercase, number and special character" },
    { value: "Password", error: "Password must contain number and special character" },
    { value: "Password1", error: "Password must contain special character" },

    { value: "Password@123", error: "" }
  ]

};