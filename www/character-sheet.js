console.log("[CharacterSheet] Script loaded and executing...");

(function () {
    function renderCharacterSheet() {
        const container = document.getElementById("char-sheet");
        if (!container || !window.getCharacterSheetData) return;
    
        const data = window.getCharacterSheetData();
        const content = data.sections || [];
    
        // Remove old blocks before re-rendering
        const existingBlocks = container.querySelectorAll(".property-block.dynamic");
        existingBlocks.forEach(block => block.remove());
    
        if (content.length === 0) return;
    
        for (const section of content) {
            const block = document.createElement("div");
            block.classList.add("property-block", "dynamic");
    
            const h3 = document.createElement("h3");
            h3.textContent = section.title;
            block.appendChild(h3);
    
            const ul = document.createElement("ul");
            ul.classList.add("section-list");
    
            if (!section.items || section.items.length === 0) {
                const placeholder = document.createElement("li");
                placeholder.textContent = "Няма налична информация";
                placeholder.classList.add("empty-placeholder");
                ul.appendChild(placeholder);
            } else {
                for (const item of section.items) {
                    const li = document.createElement("li");
                    li.textContent = item;
                    ul.appendChild(li);
                }
            }
    
            block.appendChild(ul);
            container.appendChild(block);
        }
    }

    function setupCharacterSheet() {
        console.log("[CharacterSheet] Setup complete");

        const toggleBtn = document.getElementById("char-sheet-toggle");
        const sheetPanel = document.getElementById("char-sheet");

        sheetPanel.style.opacity = '';
        sheetPanel.style.transform = '';

        if (!toggleBtn || !sheetPanel) return;

        toggleBtn.addEventListener("click", () => {
            console.log("[CharacterSheet] Toggle clicked");

            const isVisible = sheetPanel.classList.contains("visible");
            if (isVisible) {
                sheetPanel.classList.remove("visible");
            } else {
                renderCharacterSheet();
                sheetPanel.classList.add("visible");
            }
        });

        sheetPanel.addEventListener("click", () => {
            sheetPanel.classList.remove("visible");
        });

        window.onStoryContinued = () => {
            if (sheetPanel.classList.contains("visible")) {
                renderCharacterSheet();
            }
        };
    }

    function waitUntilReady() {
        if (
            document.readyState === "complete" &&
            window.story &&
            window.continueStory &&
            window.getCharacterSheetData &&
            document.getElementById("char-sheet-toggle")
        ) {
            setupCharacterSheet();
        } else {
            window.requestAnimationFrame(waitUntilReady);
        }
    }

    document.addEventListener("DOMContentLoaded", waitUntilReady);
})();
