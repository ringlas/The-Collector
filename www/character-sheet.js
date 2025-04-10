console.log("[CharacterSheet] Script loaded and executing...");


(function () {
    const skillLabels = {
        hide_and_seek: "Криеница",
        tag: "Гоненица",
        truth_or_dare: "Истината или се осмеляваш"
    };

    function renderCharacterSheet() {
        const listEl = document.getElementById("skill-list");
        if (!listEl || !window.story) return;

        const skillsRaw = window.story.variablesState["skills"];
        if (!skillsRaw) return;

        listEl.innerHTML = "";

        if (skillsRaw instanceof inkjs.InkList || typeof skillsRaw.entries === "function") {
            for (const [rawKey, score] of skillsRaw) {
                try {
                    const parsed = JSON.parse(rawKey);
                    const skillId = parsed.itemName;
                    const label = skillLabels[skillId] || skillId;

                    const li = document.createElement("li");
                    li.textContent = label;
                    listEl.appendChild(li);
                } catch (e) {
                    console.warn("[CharacterSheet] Could not parse key:", rawKey);
                }
            }
        }

        // If no skills present, show placeholder in JS
        if (!listEl.hasChildNodes()) {
            const placeholder = document.createElement("li");
            placeholder.textContent = "Няма избрани умения";
            placeholder.classList.add("empty-placeholder");
            listEl.appendChild(placeholder);
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
        

        // ✅ Tap anywhere on the sheet to close it (for mobile friendliness)
        sheetPanel.addEventListener("click", () => {
            sheetPanel.classList.remove("visible");
        });
    
        // ✅ Update sheet whenever the story continues
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
            document.getElementById("char-sheet-toggle")
        ) {
            setupCharacterSheet();
        } else {
            window.requestAnimationFrame(waitUntilReady);
        }
    }
    
    document.addEventListener("DOMContentLoaded", waitUntilReady);
    
})();
