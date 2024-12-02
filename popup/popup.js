// Define elements
const BotUserName = document.getElementById('username');
const BotPassword = document.getElementById('myInput');
const loginBTN = document.getElementById('loginbtn');
const firstForm = document.getElementById('firstForm');
const secondForm = document.getElementById('secondForm');
const wikiUsernameDisplay = document.getElementById('wikiUsername');
const Search_word = document.getElementById('Search_word');
const Replace_word = document.getElementById('Replace_word');
const confirmBTN = document.getElementById('confirmBTN');
const logoutBTN = document.getElementById('logoutbtn');

// Toast Icon Definitions
const icons = {
    ToastSuccess: '<span class="material-symbols-outlined"></span>',
    ToastDanger: '<span class="material-symbols-outlined"></span>',
};

// Function to Show Toast Notifications
const showToast = (message = "Sample Message", toastType = "ToastDanger", duration = 5000, color = "red") => {
    // Validate the toast type
    if (!icons[toastType]) toastType = "ToastDanger";

    // Remove existing toast if present
    const existingToast = document.querySelector(".toast");
    if (existingToast) existingToast.remove();

    // Create a new toast element
    const toast = document.createElement("div");
    toast.className = `toast toast-${toastType}`;
    toast.innerHTML = `
        <div class="toast-content-wrapper" style="background-color:${color};">
            <div class="toast-icon">${icons[toastType]}</div>
            <div class="toast-message">${message}</div>
            <div class="toast-progress" style="animation-duration: ${duration / 1000}s;"></div>
        </div>
    `;

    // Append the toast to the body
    document.body.appendChild(toast);

    // Remove the toast after the specified duration
    setTimeout(() => toast.classList.add("closing"), duration);
    toast.addEventListener("animationend", () => {
        if (toast.classList.contains("closing")) toast.remove();
    });
};

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
    const UserName = BotUserName.value.trim();
    const Password = BotPassword.value.trim();

    if (!UserName || !Password) {
        showToast("Please enter both username and password.", "ToastDanger", 2000, '#e74c3c');
        return;
    }

    const data = JSON.stringify({ UserName, Password });
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/Botlogin", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.status === "success") {
                    localStorage.setItem("isWikiLoggedIn", "true");
                    localStorage.setItem("username", UserName);
                    toggleForms(true);
                    showToast("Login successful!", "ToastSuccess", 2000, "#2ecc71");
                } else {
                    showToast("Login failed. Please try again.", "ToastDanger", 2000, "#e74c3c");
                }
            } else {
                showToast("Failed to send content. Server error.", "ToastDanger", 2000, "#e74c3c");
            }
        }
    };

    xhr.send(data);
});

// Confirm button event listener for sandbox edit
confirmBTN.addEventListener('click', (event) => {
    event.preventDefault();
    const OldWord = Search_word.value.trim();
    const NewWord = Replace_word.value.trim();
    const UserName = localStorage.getItem("username");

    if (!OldWord || !NewWord) {
        showToast("Please enter both search and replace words.", "ToastDanger", 5000, "#e74c3c");
        return;
    }

    const SendData = JSON.stringify({ UserName, OldWord, NewWord });
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/SandBoxEdit", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                showToast("Content successfully sent!", "ToastSuccess", 2000, "#2ecc71");
                Search_word.value = '';
                Replace_word.value = '';
            } else {
                showToast("Failed to send content. Server error.", "ToastDanger", 2000, "#e74c3c");
            }
        }
    };

    xhr.send(SendData);
});

// Logout button event listener
logoutBTN.addEventListener('click', () => {
    localStorage.removeItem("isWikiLoggedIn");
    localStorage.removeItem("username");
    toggleForms(false);
    showToast("logout successfully !", "ToastSuccess", 2000, "#2ecc71");

});
