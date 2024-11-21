// Define elements
const BotUserName = document.getElementById('username');
const BotPassword = document.getElementById('myInput');
const loginBTN = document.getElementById('loginbtn');
const firstForm = document.getElementById('firstForm');
const secondForm = document.getElementById('secondForm');
const wikiUsernameDisplay = document.getElementById('wikiUsername');

// Function to show/hide forms based on login status
function toggleForms(isLoggedIn) {
    if (isLoggedIn) {
        firstForm.classList.add('active');
        secondForm.classList.remove('active');
        wikiUsernameDisplay.textContent = localStorage.getItem("username");
    } else {
        firstForm.classList.remove('active');
        secondForm.classList.add('active');
    }
}

// Check login status on page load
document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("isWikiLoggedIn") === "true";
    toggleForms(isLoggedIn);
});

// Login button event listener
loginBTN.addEventListener('click', (event) => {
    event.preventDefault();
    const UserName = BotUserName.value;
    const Password = BotPassword.value;

    if (UserName && Password) {
        const data = JSON.stringify({ UserName, Password });

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:5000/Botlogin", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    if (response.status === 'success') {
                        localStorage.setItem("isWikiLoggedIn", "true");
                        localStorage.setItem("username", UserName);
                        toggleForms(true);
                        alert("Login successful!");
                    } else {
                        alert("Login failed. Please try again.");
                    }
                } else {
                    console.error("Failed to send content. Status:", xhr.status);
                    alert("Failed to send content.");
                }
            }
        };
        xhr.send(data);
    } else {
        alert("Please enter both username and password.");
    }
});

// Sandbox edit elements
const Search_word = document.getElementById('Search_word');
const Replace_word = document.getElementById('Replace_word');
const confirmBTN = document.getElementById('confirmBTN');

// Confirm button event listener for sandbox edit
confirmBTN.addEventListener('click', (event) => {
    event.preventDefault();
    const OldWord = Search_word.value;
    const NewWord = Replace_word.value;
    const UserName = localStorage.getItem("username");

    if (UserName) {
        const SendData = JSON.stringify({ UserName, OldWord, NewWord });

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:5000/SandBoxEdit", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    console.log(response.status);
                    alert("Content successfully sent!");
                    Search_word.value = ''
                    Replace_word.value =''
                } else {
                    console.error("Failed to send content. Status:", xhr.status);
                    alert("Failed to send content.");
                }
            }
        };
        xhr.send(SendData);
    } else {
        alert("Please enter both username and password.");
    }
});

// Logout
const logoutBTN = document.getElementById('logoutbtn');

logoutBTN.addEventListener('click', () => {
    localStorage.removeItem("isWikiLoggedIn");
    localStorage.removeItem("username");
    toggleForms(false);
});
