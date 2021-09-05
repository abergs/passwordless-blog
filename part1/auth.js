// Passwordless integration
const apiKey = "demobackend:public:c203e65b581443778ea4823b3ef0d6af";
const backendUrl = "https://demo-backend.passwordless.dev";

const p = new Passwordless.Client({ apiKey });


async function register(alias) {
    const myToken = await fetch(backendUrl + "/create-token?alias=" + alias).then((r) => r.text());
    await p.register(myToken);
    console.log("Register succeded");
}
async function signin(alias) {
    const token = await p.signinWithAlias(alias);
    const user = await fetch(backendUrl + "/verify-signin?token=" + token).then((r) => r.json());
    console.log("User details", user);
    return user;
}

// Print Status messages to UI.
function uistatus(text) {
    const statusel = document.getElementById("status");
    const currentText = statusel.innerText;
    var newLine =
        "[" + new Date().toLocaleTimeString() + "]: " + text + "\n";
    statusel.innerText = newLine + currentText;
}
uistatus("Welcome! Please register or sign in");

// Bind methods to UI buttons/events:

// register
document
    .getElementById("passwordless-register")
    .addEventListener("click", async (e) => {
        e.preventDefault();
        const alias = document.getElementById("alias").value;
        await register(alias);
        uistatus("Succeded with register");
    });

// sign in
document
    .getElementById("passwordless-signin")
    .addEventListener("click", async (e) => {
        e.preventDefault();
        uistatus("Starting authentication...");
        const alias = document.getElementById("alias").value;
        const user = await signin(alias)
        uistatus("User details: " + JSON.stringify(user, null, 2));
    });