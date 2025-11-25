// src/nakama.js
import { Client } from "@heroiclabs/nakama-js";
import { v4 as uuidv4 } from "uuid";

constructor() {
  this.client = new Client(
    "defaultkey",
    window.location.hostname,
    "",
    true,
    "/api/nakama"
  );

  this.session = null;
  this.socket = null;
  this.username = null;
}

    //------------------------------------------------------
    // LOGIN USING deviceID + username
    //------------------------------------------------------
    async loginWithName(username) {
        if (!username) throw new Error("Username required");
        this.username = username;
        localStorage.setItem("username", username);

        // Get or create device ID
        let deviceId = localStorage.getItem("deviceId");
        if (!deviceId) {
            deviceId = uuidv4();
            localStorage.setItem("deviceId", deviceId);
        }

        // Authenticate device
        this.session = await this.client.authenticateDevice(deviceId, true);

        // Save user id
        localStorage.setItem("user_id", this.session.user_id);

        // Connect socket (IMPORTANT: pass session object)
        this.socket = this.client.createSocket(false, false);
        await this.socket.connect(this.session);

        console.log("Logged in with:", username);
        return this.session;
    }

    //------------------------------------------------------
    // FIND MATCH
    //------------------------------------------------------
    async findMatch(ai = false) {
        const rpcResponse = await this.client.rpc(this.session, "find_match", { ai });

        const data = typeof rpcResponse.payload === "string"
            ? JSON.parse(rpcResponse.payload)
            : rpcResponse.payload;

        this.matchID = data.matchIds[0];

        await this.socket.joinMatch(this.matchID);

        console.log("Match joined:", this.matchID);
    }

    //------------------------------------------------------
    // SEND MOVE
    //------------------------------------------------------
    makeMove(position) {
        const bytes = new TextEncoder().encode(JSON.stringify({ position }));
        this.socket.send({
            match_data_send: {
                match_id: this.matchID,
                op_code: 4,
                data: bytes
            }
        });
    }

    inviteAI() {
        const bytes = new TextEncoder().encode("{}");
        this.socket.send({
            match_data_send: {
                match_id: this.matchID,
                op_code: 7,
                data: bytes
            }
        });
    }
}

export default new Nakama();
