document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".answer-btn").forEach(button => {
        button.addEventListener("click", () => {
            const isCorrect = button.getAttribute("data-correct") === "true";
            alert(isCorrect ? "Rétt!" : "Rangt");
        });
    });
});
