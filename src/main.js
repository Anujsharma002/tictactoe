import App from './App.svelte';

const app = new App({
    target: document.getElementById("app"),   // FIXED
    props: {}
});

export default app;
