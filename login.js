document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  // const username = document.getElementById("username").value.trim();
  const passWord = document.getElementById("password").value.trim();
  const progressBar = document.getElementById("topProgressBar");
    const email = document.getElementById("username").value.trim();

  //const email = localStorage.getItem("username");
//document.getElementById("dropdownName").textContent = email;

  // Start the loading bar
  progressBar.style.width = "30%";

  try {
    const response = await fetch("http://localhost:5194/api/Auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, passWord })
    });

    const result = await response.json();

    if (response.ok) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("name", result.name);
      localStorage.setItem("adminId", result.userId);
      localStorage.setItem("role", result.role);
      localStorage.setItem("email",result.userCreadential.email);
      

      // Finish loading
      progressBar.style.width = "100%";

      // Show toast
      const toastEl = document.getElementById("successToast");
      const toast = new bootstrap.Toast(toastEl, { autohide: true, delay: 1500 });
      toast.show();

      // Redirect after toast
      toastEl.addEventListener("hidden.bs.toast", () => {
        window.location.href = "/Admin/admin.html";
      });
    } else {
      showToast("errorToast");
      progressBar.style.width = "0%";
    }
  } catch (err) {
    console.error("Login error", err);
    showToast("errorToast");
    progressBar.style.width = "0%";
  }
});

// Utility: Show toast by ID
function showToast(id) {
  const toastEl = document.getElementById(id);
  if (toastEl) {
    const toast = new bootstrap.Toast(toastEl, { autohide: true, delay: 2000 });
    toast.show();
  }
}
