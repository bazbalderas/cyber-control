document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    if (usuario == "admin" && password == "1234") {


        window.location.href = "dashboard.html";

}
});
