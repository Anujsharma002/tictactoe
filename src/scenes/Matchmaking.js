import CONFIG from "../config";
import Nakama from "../nakama";

export default class Matchmaking extends Phaser.Scene {
    constructor() {
        super("matchmaking");
        this.isSearching = true;
    }

    preload() {
        this.load.spritesheet("spinner", "assets/loader-spritesheet.png", {
            frameWidth: 200,
            frameHeight: 200,
            endFrame: 40,
        });
    }

    async create(data) {
        const isAI = data?.ai ?? false;

        this.add
            .text(CONFIG.WIDTH / 2, 125, isAI 
                ? "Starting AI game..."
                : "Searching for an opponent...", {
                fontFamily: "Arial",
                fontSize: "24px",
                color: "#000"
            })
            .setOrigin(0.5);

        this.anims.create({
            key: "spinnerAnimation",
            frames: this.anims.generateFrameNumbers("spinner"),
            frameRate: 30,
            repeat: -1,
        });

        this.add
            .sprite(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2, "spinner")
            .play("spinnerAnimation")
            .setScale(0.5);

        // --- Cancel Button ---
        const cancelBtn = this.add
            .rectangle(CONFIG.WIDTH / 2, 650, 225, 70, 0xffca27)
            .setInteractive({ useHandCursor: true });

        const cancelText = this.add
            .text(CONFIG.WIDTH / 2, 650, "Cancel", {
                fontFamily: "Arial",
                fontSize: "32px",
                color: "#000"
            })
            .setOrigin(0.5);

        cancelBtn.on("pointerdown", () => {
            this.isSearching = false;
            this.scene.start("main-menu");
        });

        cancelBtn.on("pointerover", () => {
            cancelBtn.setScale(1.1);
            cancelText.setScale(1.1);
        });

        cancelBtn.on("pointerout", () => {
            cancelBtn.setScale(1);
            cancelText.setScale(1);
        });

        // --- Start matchmaking safely (without blocking UI) ---
        this.safeStartMatchmaking(isAI);
    }

    async safeStartMatchmaking(isAI) {
        try {
            await Nakama.findMatch(isAI);

            if (!this.isSearching) return;

            this.scene.start("in-game");
        } catch (e) {
            console.error("Matchmaking failed:", e);

            // gracefully fall back to main menu
            this.scene.start("main-menu");
        }
    }
}
