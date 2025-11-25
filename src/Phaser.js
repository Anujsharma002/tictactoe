import Phaser from "phaser";

import MainMenu from "./scenes/MainMenu";
import Matchmaking from "./scenes/Matchmaking";
import InGame from "./scenes/InGame";

import CONFIG from "./config";

export default function startPhaser() {
    const config = {
        type: Phaser.AUTO,
        width: CONFIG.WIDTH,
        height: CONFIG.HEIGHT,
        backgroundColor: "#ffffff",
        parent: "phaser-container",

        scene: [
            MainMenu,
            Matchmaking,
            InGame
        ]
    };

    new Phaser.Game(config);
}
