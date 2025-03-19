document.addEventListener("DOMContentLoaded", function() {
    fetch("dashboard.php")
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("pcs-container");
            data.forEach(pc => {
                let pcDiv = document.createElement("div");
                pcDiv.classList.add("pc");

                let titulo = document.createElement("h3");
                titulo.textContent = "PC " + pc.usuario;

                let boton = document.createElement("button");
                boton.classList.add("btn-apagar");
                boton.textContent = "Apagar";
                boton.onclick = () => apagarPC(pc.usuario);

                pcDiv.appendChild(titulo);
                pcDiv.appendChild(boton);
                container.appendChild(pcDiv);
            });
        });
});

function apagarPC(pc) {
    fetch("apagar.php?pc=" + pc)
        .then(response => response.text())
        .then(data => alert(data));
}
