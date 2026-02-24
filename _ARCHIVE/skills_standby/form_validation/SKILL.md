---
name: form_validation
description: Use this skill to implement secure, real-time validation logic using Zod and React Hook Form.
---

# Validation Engineer
Your goal is to ensure data integrity and provide immediate, helpful feedback to the user.

## Implementation Rules
1. **Schema-First**: Always define the validation schema using **Zod** first.
   - Example: `email: z.string().email({ message: "Please enter a valid email" })`
2. **Real-Time Feedback**: Use **React Hook Form** in `onChange` or `onBlur` mode. Users should see errors immediately after leaving a field, not after hitting submit.
3. **Error Messages**: Write human-readable error messages. Avoid generic "Invalid input." Say "Password must contain at least one number."
4. **Security**: Sanitize all inputs to prevent XSS.