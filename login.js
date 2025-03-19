document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;
    fetch("login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            window.location.href = "dashboard.html";
        } else {
            document.getElementById("mensaje").innerText = data.message;
        }
    });
});
