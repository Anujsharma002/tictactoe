<script>
  import Nakama from "../nakama";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  let username = "";
  let error = "";
  let loading = false;

  async function doLogin() {
    error = "";
    loading = true;

    try {
      await Nakama.loginWithName(username.trim());
      dispatch("auth");
    } catch (e) {
      console.error(e);
      error = "Login failed";
    }

    loading = false;
  }
</script>

<div class="login-wrapper">
  <div class="glass-card">
    <h1 class="title">Enter Nickname</h1>

    <input
      type="text"
      class="input"
      bind:value={username}
      placeholder="Your nickname..."
    />

    {#if error}
      <div class="error">{error}</div>
    {/if}

    <button on:click={doLogin} class="btn" disabled={loading}>
      {loading ? "Loading..." : "Continue"}
    </button>
  </div>
</div>

<style>
  /* Light background */
  .login-wrapper {
    height: 100vh;
    width: 100vw;

    display: flex;
    justify-content: center;
    align-items: center;

    background: linear-gradient(135deg, #ffffff, #f4f4f4, #ececec);
    overflow: hidden;
  }

  /* Soft frosted glass */
  .glass-card {
    width: 25%;
    padding: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);

    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.7);

    box-shadow:
      0 6px 25px rgba(0, 0, 0, 0.08),
      inset 0 0 20px rgba(255, 255, 255, 0.4);

    animation: float 6s ease-in-out infinite alternate;
    transition: 0.25s;
  }

  .glass-card:hover {
    transform: scale(1.02);
    box-shadow:
      0 8px 30px rgba(0, 0, 0, 0.15),
      inset 0 0 25px rgba(255, 255, 255, 0.55);
  }

  @keyframes float {
    from { transform: translateY(-4px); }
    to   { transform: translateY(4px); }
  }

  .title {
    font-size: 26px;
    text-align: center;
    color: #222;
    margin-bottom: 22px;
  }

  .input {
    width: 100%;
    padding: 14px;

    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(0,0,0,0.15);
    border-radius: 8px;

    font-size: 16px;
    color: #333;
    margin-left: 10px;
    margin-bottom: 20px;
    transition: 0.25s;
  }

  .input:focus {
    outline: none;
    border-color: #7b5cff;
    box-shadow: 0 0 10px #c7baff;
    background: white;
  }

  .btn {
    width: 100%;
    padding: 12px;

    background: linear-gradient(135deg, #7b5cff, #b69cff);
    border: none;
    border-radius: 8px;

    color: #fff;
    font-weight: bold;
    font-size: 18px;
    cursor: pointer;

    box-shadow: 0 0 15px rgba(123, 92, 255, 0.35);
    transition: 0.25s;
  }

  .btn:hover {
    transform: scale(1.03);
    box-shadow: 0 0 22px rgba(123, 92, 255, 0.55);
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error {
    color: #d62828;
    text-align: center;
    margin-bottom: 10px;
    font-size: 14px;
  }
</style>
