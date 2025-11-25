import CONFIG from "../config";
import Nakama from "../nakama";

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super("main-menu");
    }

    create() {
        this.add
            .text(CONFIG.WIDTH / 2, 125, "Welcome to XOXO", {
                fontFamily: "Arial",
                fontSize: "36px",
                color: "#fff",
            })
            .setOrigin(0.5);

        this.add
            .text(CONFIG.WIDTH / 2, 200, "Logged in as: " + localStorage.getItem("username"), {
                fontFamily: "Arial",
                fontSize: "20px",
                color: "#fff",
            })
            .setOrigin(0.5);


        // ------------------------------
        // NORMAL MATCH BUTTON
        // ------------------------------
        const btnNormal = this.add
            .rectangle(CONFIG.WIDTH / 2, 500, 260, 70, 0xffca27)
            .setInteractive({ useHandCursor: true });

        this.add
            .text(CONFIG.WIDTH / 2, 500, "Find Match", {
                fontFamily: "Arial",
                fontSize: "32px",
            })
            .setOrigin(0.5);

        btnNormal.on("pointerdown", async () => {
            try {
                await Nakama.findMatch(false); // player vs player
                this.scene.start("in-game");
            } catch (e) {
                console.error(e);
                this.showError();
            }
        });


        // ------------------------------
        // AI MATCH BUTTON
        // ------------------------------
        const btnAI = this.add
            .rectangle(CONFIG.WIDTH / 2, 600, 260, 70, 0x28c76f)
            .setInteractive({ useHandCursor: true });

        this.add
            .text(CONFIG.WIDTH / 2, 600, "Play vs AI", {
                fontFamily: "Arial",
                fontSize: "32px",
            })
            .setOrigin(0.5);

        btnAI.on("pointerdown", async () => {
            try {
                await Nakama.findMatch(true); // AI match
                this.scene.start("in-game");
            } catch (e) {
                console.error(e);
                this.showError();
            }
        });
    }

    showError() {
        this.cameras.main.setBackgroundColor("#ed807aff");
        this.add
            .text(CONFIG.WIDTH / 2, 350, "Nakama Error", {
                fontFamily: "Arial",
                fontSize: "32px",
            })
            .setOrigin(0.5);
    }
}
