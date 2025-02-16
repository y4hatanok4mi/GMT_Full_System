export const emailVerificationTemplate = (code: string) => `
  <h1>Email Verification</h1>
  <p>Use the code below to verify your email:</p>
  <h2>${code}</h2>
`;

export const forgotPasswordTemplate = (resetLink: string) => `
  <h1>Reset Your Password</h1>
  <p>Click the link below to reset your password:</p>
  <a href="${resetLink}">Reset Password</a>
  <p>If you did not request this, please ignore this email.</p>
`;
