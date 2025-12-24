const API_URL = "http://127.0.0.1:8000/register/";

const regForm = document.getElementById("regForm");

regForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const Login = regForm.elements["Login"].value
  const password = regForm.elements["password"].value

  PostFunc(Login, password)
});

async function PostFunc(Login, password) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        userId: 1,
        Login: Login,
        password: password,
      })
    })

    const data = await response.JSON();
    return data;
  } catch (error) {
    console.log(error)
  }
}


