var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var apiClient = apigClientFactory.newClient();
var token = null;

function signUp() {
  event.preventDefault();
  console.log("signup");
  const username = document.querySelector("#username").value;
  const emailadd = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  var email = new AmazonCognitoIdentity.CognitoUserAttribute({
    Name: "email",
    Value: emailadd,
  });

  userPool.signUp(username, password, [email], null, function (err, result) {
    if (err) {
      alert(err);
    } else {
      location.href = "signin.html";
    }
  });
};

function signIn() {
  event.preventDefault();
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;

  let authenticationData = {
    Username: username,
    Password: password,
  };

  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData
  );
  var userData = {
    Username: username,
    Pool: userPool,
  };

  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function () {
      console.log("login success");
      location.href = "index.html";
    },
    onFailure: function (err) {
      alert(JSON.stringify(err));
    },
  });
};

function signOut() {
  console.log("sign out");
  var cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) cognitoUser.signOut();
};


function checkLogin() {
  console.log("checking login..");
  const login = false;
  const userBtn = document.querySelector(".user");
  const leftBtn = document.querySelector(".left");
  const rightBtn = document.querySelector(".right");
  var cognitoUser = userPool.getCurrentUser();
  if (cognitoUser != null) {
    userBtn.innerHTML += cognitoUser.username;
    rightBtn.classList.toggle("hide");
  } else {
    leftBtn.innerHTML = "Sign In";
    rightBtn.innerHTML = "Register";
  }
};

function navTosignUp() {
  console.log("sign up");
  location.href = "signup.html";
};

function navTosignIn() {
  console.log("sign in");
  location.href = "signin.html";
};

function loadUsers() {
  getJWTToken(function (token) {
    apiClient
      .usersGet({}, null, { headers: { Authorization: token } })
      .then(function (result) {
        console.log(result);
        displayUsers(result.data);
      })
      .catch((err) => console.log(err));
  });
};

