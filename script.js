document.addEventListener("DOMContentLoaded", function () {
    const grid = document.getElementById("imageGrid");
    const imageSrc = 'Gura cool.jpg';
    const totalCells = 200;
    let isFullyUnlocked = false;
    let boletos = 0;

    let cooldownActivo = false;
    const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutos

    const ticketDisplay = document.getElementById("ticketCounter");
    const submitButton = document.getElementById("submitButton");

    function actualizarBoletos() {
        ticketDisplay.textContent = `Boletos: ${boletos}`;
    }

    function activarCooldown() {
        cooldownActivo = true;
        submitButton.disabled = true;
        submitButton.textContent = "Espera 10 minutos...";

        setTimeout(() => {
            cooldownActivo = false;
            submitButton.disabled = false;
            submitButton.textContent = "Enviar";
        }, COOLDOWN_MS);
    }

    function procesarInput() {
        if (isFullyUnlocked || cooldownActivo) {
            alert("Debes esperar 10 minutos antes de responder otra vez.");
            return;
        }

        const inputValue = document.getElementById("userInput").value.trim();

        activarCooldown(); // inicia cooldown

        if (inputValue.toLowerCase() === "gura") {
            alert("¡Correcto! Has ganado un premio tipo A.");
            const cells = document.querySelectorAll(".locked");
            cells.forEach(cell => {
                cell.classList.remove("locked");
                cell.classList.add("unlocked", "permanently-unlocked");
                cell.style.transform = "scale(1)";
                cell.style.zIndex = "1";
            });
            const celdasDesbloqueadas = document.querySelectorAll(".unlocked").length;
            boletos += celdasDesbloqueadas;
            actualizarBoletos();

            isFullyUnlocked = true;
            document.querySelector(".input-container").style.display = "none";
        } else {
            alert("Incorrecto. Intenta de nuevo.");
        }
    }

    submitButton.addEventListener("click", procesarInput);

    const img = new Image();
    img.src = imageSrc;
    img.onload = function () {
        const imgWidth = img.width;
        const imgHeight = img.height;

        let cols = Math.round(Math.sqrt(totalCells * (imgWidth / imgHeight)));
        let rows = Math.ceil(totalCells / cols);

        const cellWidth = Math.floor(imgWidth / cols);
        const cellHeight = Math.floor(imgHeight / rows);

        grid.style.width = `${cols * (cellWidth + 2)}px`;
        grid.style.height = `${rows * (cellHeight + 2)}px`;
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = `repeat(${cols}, ${cellWidth}px)`;
        grid.style.gridTemplateRows = `repeat(${rows}, ${cellHeight}px)`;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let cell = document.createElement("div");
                cell.style.width = `${cellWidth}px`;
                cell.style.height = `${cellHeight}px`;
                cell.style.backgroundImage = `url('${imageSrc}')`;
                cell.style.backgroundSize = `${imgWidth}px ${imgHeight}px`;
                cell.style.backgroundPosition = `-${col * cellWidth}px -${row * cellHeight}px`;
                cell.classList.add("locked", "grid-cell");

                cell.addEventListener("click", function () {
                    if (cooldownActivo) {
                        alert("Debes esperar 10 minutos antes de responder otra vez.");
                        return;
                    }

                    if (!isFullyUnlocked && !this.classList.contains("permanently-unlocked")) {
                        const respuesta = prompt("¿Sabes la respuesta?");
                        activarCooldown(); // activa el cooldown al responder una celda

                        if (respuesta && respuesta.trim().toLowerCase() === "no") {
                            this.classList.remove("locked");
                            this.classList.add("unlocked", "permanently-unlocked");
                            boletos++;
                            actualizarBoletos();
                        } else {
                            alert("Respuesta incorrecta. Intenta de nuevo.");
                        }
                    }
                });
                grid.appendChild(cell);
            }
        }
    };

    window.procesarInput = procesarInput;
});
