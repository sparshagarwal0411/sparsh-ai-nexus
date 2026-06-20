export type ContactFormPayload = {
  name: string;
  email: string;
  message: string;
};

export async function sendContactEmail(data: ContactFormPayload) {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    throw new Error(
      "Contact form is not configured yet. Add VITE_WEB3FORMS_ACCESS_KEY to your environment."
    );
  }

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: accessKey,
      name: data.name,
      email: data.email,
      message: data.message,
      subject: `Portfolio message from ${data.name}`,
      from_name: "Sparsh Portfolio",
    }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to send your message. Please try again.");
  }

  return result;
}
