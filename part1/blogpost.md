# Part1: Adding fingerprint authentication to your webapp using javascript

In this blogpost we will add Fingerprint and FaceID authentiate using javascript and the [passwordless API](https://passwordless.dev).

You can checkout all the code on the passwordless-part1 repo.


## Create and serve index.html

You might have an existing web app that you can use, but we will create a small boilerplate app.
The important thing is that you can access it using either `https` or `http://localhost:xx`. (`file://` won't work because of security limitations)

Create a folder and open your favorite editor (Mine is VS Code)

```bash
mkdir passwordless-app
cd passwordless-app
code .
```

Create a `index.html` file with the following boilerplat. The important part is the input field and the buttons.

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Passwordless Minimal</title>
  <style>
    body {
      font-family: sans-serif;
    }
  </style>
</head>

<body>
  <h2>Passwordless Minimal demo</h2>
  <p>To run this example you don't have to do anything other than supply a unique alias.</p>
  
  <input type="text" id="alias" placeholder="Unique Alias (Username, email)" />
  <button id="passwordless-register">Register</button>
  <button id="passwordless-signin">Login</button>
  <pre id="status"></pre>
  <script src="https://cdn.passwordless.dev/dist/0.2.0/passwordless.iife.js" crossorigin="anonymous"></script>
  <script src="auth.js"></script>
</body>

</html>
```

Make sure that you include the script tags that reference the `passwordless.iife.js`-library and the `auth.js` file.
Serve the file using `npx http-server` and checkout the result at `http://localhost:8080`.


## Let's create auth.js

Add a new file called `auth.js`. In this file we will add our authentication code.

Start by adding the apiKey and two methods, `register` and `sign in`. (Yes, you should use the `demobackend` API key for now.)

```js
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
```

So far so good, but we need to connect our buttons to the methods we created.
In `auth.js`, add the following:

```js
// Bind methods to UI buttons/events:

// register
document
  .getElementById("passwordless-register")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    const alias = document.getElementById("alias").value;
    await register(alias);
    status("Succeded with register");
  });

// sign in
 document
    .getElementById("passwordless-signin")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      const alias = document.getElementById("alias").value;
      const user = await signin(alias)
      status("User details: " + JSON.stringify(user, null, 2));
  });

   // Print Status messages to UI.
  const statusel = document.getElementById("status");
  function status(text) {
    const currentText = statusel.innerText;
    var newLine =
      "[" + new Date().toLocaleTimeString() + "]: " + text + "\n";
    statusel.innerText = newLine + currentText;
  }
  status("Welcome! Please register or sign in");
```

## Testing it

Refresh `http://localhost:8080` again. Enter a unique nickname and try clicking the register button.



## Adding your own backend

In the next part we will look how to connect this UI your own backend using Node.js. It's about as easy as this was.