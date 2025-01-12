// Signup Form
const signupFormHandler = async (event) => {
  event.preventDefault();

  const username = document.querySelector("#usernameForm").value.trim();
  const password = document.querySelector("#passwordForm").value.trim();

  if (username && password) {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/login");
    } else {
      alert("Please try again!");
    }
  }
};

document
  .querySelector(".join-container")
  .addEventListener("submit", signupFormHandler);
