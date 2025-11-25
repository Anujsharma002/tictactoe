import CONFIG from "../config";
import Nakama from "../nakama";

export default class InGame extends Phaser.Scene {
    constructor() {
        super("in-game");

        this.INDEX_TO_POS = null;
        this.headerText = null;

        this.playerTurn = false;
        this.playerPos = null;
        this.cellSprites = Array(9).fill(null);

        // Score
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;

        this.scoreText = null;

        // NEW — username
        this.username = localStorage.getItem("username") || "Player";
        this.nameText = null;

        this.playAIBtn = null;
        this.playAIBtnText = null;
    }

    updateScoreText() {
        this.scoreText.setText(`W:${this.wins}  L:${this.losses}  T:${this.ties}`);
        this.nameText.setText(this.username);
    }

    resetBoard() {
        this.cellSprites.forEach(sprite => sprite?.destroy());
        this.cellSprites = Array(9).fill(null);

        this.headerText.setText("New round starting…");

        setTimeout(() => {
            this.headerText.setText(
                this.playerTurn ? "Your turn!" : "Opponent’s turn!"
            );
        }, 800);
    }

    updateBoard(board) {
        board.forEach((value, index) => {
            if (this.cellSprites[index]) return;

            const pos = this.INDEX_TO_POS[index];
            if (!pos) return;

            if (value === 1) {
                this.cellSprites[index] = this.add.image(pos.x, pos.y, "X");
            } else if (value === 2) {
                this.cellSprites[index] = this.add.image(pos.x, pos.y, "O");
            }
        });
    }

    updatePlayerTurn() {
        this.playerTurn = !this.playerTurn;
        this.headerText.setText(
            this.playerTurn ? "Your turn!" : "Opponent’s turn!"
        );
    }

    setPlayerTurn(data) {
        const uid = localStorage.getItem("user_id");
        const mark = data?.marks?.[uid];

        if (mark === 1) {
            this.playerPos = 1;
            this.playerTurn = true;
            this.headerText.setText("Your turn!");
        } else {
            this.playerPos = 2;
            this.playerTurn = false;
            this.headerText.setText("Opponent’s turn!");
        }
    }

    opponentLeft() {
        this.headerText.setText("Opponent left!");

        this.playAIBtn.setVisible(true);
        this.playAIBtnText.setVisible(true);
    }

    endGame(data) {
        if (Array.isArray(data.board)) this.updateBoard(data.board);

        if (data.winner === this.playerPos) {
            this.headerText.setText("You win!");
            this.wins++;
        } else if (data.winner == null) {
            this.headerText.setText("Tie!");
            this.ties++;
        } else {
            this.headerText.setText("You lose :(");
            this.losses++;
        }

        this.updateScoreText();

        setTimeout(() => this.resetBoard(), 1200);
    }

    nakamaListener() {
        Nakama.socket.onmatchdata = (result) => {
            try {
                const decoded = new TextDecoder().decode(result.data);
                const data = decoded ? JSON.parse(decoded) : {};

                switch (result.op_code) {
                    case 1:
                        this.setPlayerTurn(data);
                        if (data.board) this.updateBoard(data.board);
                        break;

                    case 2:
                        this.updateBoard(data.board);
                        this.updatePlayerTurn();
                        break;

                    case 3:
                        this.endGame(data);
                        break;

                    case 6:
                        this.opponentLeft();
                        break;

                    default:
                        console.warn("Unknown opcode:", result.op_code);
                }
            } catch (e) {
                console.error("Failed to parse matchdata:", e);
            }
        };
    }

    preload() {
        this.load.image("X", "assets/X.png");
        this.load.image("O", "assets/O.png");
    }

    create() {
        this.headerText = this.add
            .text(CONFIG.WIDTH / 2, 125, "Waiting for game to start", {
                fontFamily: "Arial",
                fontSize: "36px",
            })
            .setOrigin(0.5);

        // NAME — Left top
        this.nameText = this.add
            .text(40, 40, this.username, {
                fontFamily: "Arial",
                fontSize: "30px",
                color: "#ffffff"
            })
            .setOrigin(0, 0.5);

        // SCORE — Right top
        this.scoreText = this.add
            .text(CONFIG.WIDTH - 40, 40, "W:0  L:0  T:0", {
                fontFamily: "Arial",
                fontSize: "30px",
                color: "#ffffff"
            })
            .setOrigin(1, 0.5);

        const gridWidth = 300;
        const cell = gridWidth / 3;

        const grid = this.add.grid(
            CONFIG.WIDTH / 2,
            CONFIG.HEIGHT / 2,
            gridWidth,
            gridWidth,
            cell,
            cell,
            0xffffff,
            0,
            0xffca27
        );

        const gx = grid.getCenter().x;
        const gy = grid.getCenter().y;

        this.INDEX_TO_POS = {
            0: { x: gx - cell, y: gy - cell },
            1: { x: gx, y: gy - cell },
            2: { x: gx + cell, y: gy - cell },

            3: { x: gx - cell, y: gy },
            4: { x: gx, y: gy },
            5: { x: gx + cell, y: gy },

            6: { x: gx - cell, y: gy + cell },
            7: { x: gx, y: gy + cell },
            8: { x: gx + cell, y: gy + cell },
        };

        this.cellSprites = Array(9).fill(null);

        this.nakamaListener();

        Object.entries(this.INDEX_TO_POS).forEach(([i, pos]) => {
            this.add
                .rectangle(pos.x, pos.y, cell, cell, 0xffffff, 0)
                .setInteractive({ useHandCursor: true })
                .on("pointerdown", () => {
                    const index = Number(i);

                    if (!this.playerTurn) return;
                    if (this.cellSprites[index]) return;

                    Nakama.makeMove(index);
                });
        });

        this.playAIBtn = this.add
            .rectangle(CONFIG.WIDTH / 2, 680, 270, 70, 0xffca27)
            .setVisible(false)
            .setInteractive();

        this.playAIBtnText = this.add
            .text(CONFIG.WIDTH / 2, 680, "Continue with AI", {
                fontFamily: "Arial",
                fontSize: "36px",
            })
            .setVisible(false)
            .setOrigin(0.5);

        this.playAIBtn.on("pointerdown", () => {
            Nakama.inviteAI();
            this.playAIBtn.setVisible(false);
            this.playAIBtnText.setVisible(false);
        });
    }
}
