<script>
  import { onMount, tick } from "svelte";
  import Phaser from "phaser";

  import Login from "./components/Login.svelte";
  import MainMenu from "./scenes/MainMenu";
  import Matchmaking from "./scenes/Matchmaking";
  import InGame from "./scenes/InGame";

  import CONFIG from "./config";
  import Nakama from "./nakama";

  let authenticated = false;

  // Try restoring previous session
  onMount(async () => {
    authenticated = await Nakama.restoreSession();
    if (authenticated) {
      await startPhaser();
    }
  });

  // After login
  async function onAuth() {
    authenticated = true;
    await startPhaser();
  }

  async function startPhaser() {
    await tick();

    // Prevent creating multiple games
    if (window.__PHASER_GAME__) return;

    window.__PHASER_GAME__ = new Phaser.Game({
      type: Phaser.AUTO,
      width: CONFIG.WIDTH,
      height: CONFIG.HEIGHT,
      backgroundColor: "#1e1e1e", // ← fallback, normally replaced by CSS
      parent: "phaser-container",
      scene: [MainMenu, Matchmaking, InGame],
    });
  }
</script>

{#if !authenticated}
  <Login on:auth={onAuth} />
{:else}
  <div id="phaser-wrapper">
    <div id="phaser-container"></div>
  </div>
{/if}

<style>
  /* Fullscreen background */
  body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: linear-gradient(135deg, #6a11cb, #2575fc); /* 🎨 MODERN GRADIENT */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Center wrapper */
  #phaser-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Centered fixed-size game window */
 #phaser-container {
  transform: scale(0.7);       /* 70% = 30% smaller */
  transform-origin: center;    /* keep centered */
  box-shadow: 0 25px 50px rgba(0,0,0,0.35);
  border-radius: 20px;
  overflow: hidden;
}
</style>
