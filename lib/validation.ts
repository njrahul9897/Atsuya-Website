// Assessment form rules, shared by the browser (inline validation) and the server action.

export type AssessmentFields = { name: string; email: string; company: string; industry: string; sites: string; message: string };
export type AssessmentErrors = Partial<Record<keyof AssessmentFields, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Shared by the assessment form and the newsletter sign-up.
export function validateEmail(value: string, empty = "Enter your email address."): string | undefined {
  const text = value.trim();
  return !text ? empty : !EMAIL.test(text) ? "Enter a valid email address, like name@company.com." : undefined;
}

export function validateField(field: keyof AssessmentFields, value: string): string | undefined {
  const text = value.trim();
  switch (field) {
    case "name":
      return text.length < 2 ? "Enter your name." : undefined;
    case "email":
      return validateEmail(text, "Enter your work email.");
    case "company":
      return text.length < 2 ? "Enter your company name." : undefined;
    case "industry":
      return !text ? "Choose an industry." : undefined;
    case "sites":
      return !text ? "Choose the number of sites." : undefined;
    case "message":
      return text.length > 2000 ? "Keep the message under 2,000 characters." : undefined;
  }
}

export function validateAssessment(fields: AssessmentFields): AssessmentErrors {
  const errors: AssessmentErrors = {};
  (Object.keys(fields) as (keyof AssessmentFields)[]).forEach((field) => {
    const error = validateField(field, fields[field] ?? "");
    if (error) errors[field] = error;
  });
  return errors;
}
