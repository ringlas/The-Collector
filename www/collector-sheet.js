(function () {
    const skillLabels = {
        hide_and_seek: "Криеница",
        tag: "Гоненица",
        truth_or_dare: "Истината или се осмеляваш"
    };

    window.getCharacterSheetData = function () {
        const vars = window.story.variablesState;

        // Skills
        const skills = [];
        const skillsRaw = vars["skills"];
        if (skillsRaw instanceof inkjs.InkList || typeof skillsRaw.entries === "function") {
            for (const [rawKey] of skillsRaw) {
                try {
                    const parsed = JSON.parse(rawKey);
                    const skillId = parsed.itemName;
                    const label = skillLabels[skillId] || skillId;
                    skills.push(label);
                } catch (e) {
                    console.warn("[CollectorSheet] Could not parse skill key:", rawKey);
                }
            }
        }

        // Stats
        const stats = [
            `Здраве: ${vars["health"] ?? "?"}`,
            `Атака: ${vars["attack"] ?? "?"}`
        ];

        // Inventory (Ink List or simple array)
        const inventory = vars["inventory"] ?? [];

        return {
            sections: [
                { title: "Умения", items: skills },
                // { title: "Статистики", items: stats },
                // { title: "Инвентар", items: [...inventory] }
            ]
        };
    };
})();
