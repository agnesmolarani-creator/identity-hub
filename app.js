
/* =====================================
   IDENTITY HUB - TELEGRAM MINI APP
===================================== */

// TELEGRAM INITIALIZATION

const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();

  try {
    tg.setHeaderColor("#fff0f5");
    tg.setBackgroundColor("#fff0f5");
  } catch (error) {
    console.log("Telegram theme setting unavailable.");
  }
}

// HELPER

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

// TELEGRAM PROFILE SYNC

function syncTelegramProfile() {
  const user = tg?.initDataUnsafe?.user;

  const status = document.getElementById(
    "telegram-identity-status"
  );

  const message = document.getElementById(
    "telegram-identity-message"
  );

  const avatar = document.getElementById("telegram-avatar");
  const fallback = document.getElementById(
    "telegram-avatar-fallback"
  );

  const profileLink = document.getElementById(
    "telegram-profile-link"
  );

  if (!user) {
    if (status) status.textContent = "Not connected";

    if (message) {
      message.textContent =
        "Open Identity Hub through Telegram to see your Telegram profile ♡";
    }

    if (profileLink) profileLink.style.display = "none";

    setText("telegram-full-name", "Not connected");
    setText("telegram-username", "@not_available");
    setText("telegram-first-name", "-");
    setText("telegram-last-name", "-");
    setText("telegram-user-id", "-");
    setText("telegram-language", "-");

    return;
  }

  const firstName = user.first_name || "";
  const lastName = user.last_name || "";
  const fullName = [firstName, lastName]
    .filter(Boolean)
    .join(" ") || "Telegram User";

  const username = user.username
    ? "@" + user.username
    : "No username";

  // Update existing Identity Hub profile
  setText("username", firstName || "cutie");
  setText("profile-name", fullName);

  if (user.id) {
    setText("profile-id", "Telegram ID: " + user.id);
  }

  // Update Telegram identity card
  if (status) status.textContent = "Connected ♡";

  setText("telegram-full-name", fullName);
  setText("telegram-username", username);
  setText("telegram-first-name", firstName || "-");
  setText("telegram-last-name", lastName || "-");
  setText("telegram-user-id", user.id || "-");
  setText("telegram-language", user.language_code || "-");

  // Profile photo
  if (user.photo_url && avatar) {
    avatar.src = user.photo_url;
    avatar.alt = fullName;

    avatar.style.display = "block";

    if (fallback) fallback.style.display = "none";

    avatar.onerror = () => {
      avatar.style.display = "none";
      if (fallback) fallback.style.display = "block";
    };
  } else {
    if (avatar) avatar.style.display = "none";
    if (fallback) fallback.style.display = "block";
  }

  // Telegram profile link
  if (profileLink) {
    if (user.username) {
      profileLink.href = "https://t.me/" + encodeURIComponent(
        user.username
      );

      profileLink.style.display = "inline-block";
    } else {
      profileLink.style.display = "none";
    }
  }

  if (message) {
    message.textContent =
      "Your Telegram profile information is displayed automatically ♡";
  }
}

// DATA

const usernameIdeas = [
  "pinkcloud", "softie", "moonberry",
  "lovelyday", "peachy", "milkyrose",
  "littleangel", "cloudie", "sweetbloom",
  "strawberry", "rosyheart", "fairywish"
];

const nicknameIdeas = [
  "Mimi", "Lulu", "Nana", "Cici",
  "Kiki", "Momo", "Yuyu", "Bibi",
  "Lala", "Pipi", "Riri", "Dodo"
];

const bioIdeas = [
  "♡ just a little dreamer in a big world",
  "୨୧ collecting little moments",
  "✧ made of dreams and stardust",
  "♡ living my own fairytale",
  "꒰ sweet soul, soft heart ꒱",
  "⋆｡˚ creating my own sunshine",
  "୨୧ a little magic everywhere"
];

const symbols = [
  "♡", "♥", "୨୧", "꒰", "꒱",
  "✧", "✦", "⋆", "˚", "₊",
  "｡", "୭", "ৎ", "❀", "✿",
  "ꕤ", "☁", "☾", "★", "☆",
  "⊹", "𐙚", "༘", "ෆ"
];

const kaomojis = [
  "૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა",
  "(˶ᵔ ᵕ ᵔ˶)",
  "(｡♥‿♥｡)",
  "(づ｡◕‿‿◕｡)づ",
  "૮꒰ ˶• ༝ •˶꒱ა",
  "(≧◡≦)",
  "(˶˃ ᵕ ˂˶)",
  "(๑>ᴗ<๑)",
  "(´｡• ᵕ •｡`)",
  "૮₍ ˃ ⤙ ˂ ₎ა"
];

// FAVORITES

let favorites = [];

try {
  favorites = JSON.parse(
    localStorage.getItem("identityFavorites") || "[]"
  );

  if (!Array.isArray(favorites)) favorites = [];
} catch (error) {
  favorites = [];
}

let previousPage = "home";

// NAVIGATION

function showPage(page) {
  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active");
  });

  const target = document.getElementById(page);

  if (target) target.classList.add("active");

  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.classList.toggle(
      "active",
      btn.dataset.page === page
    );
  });

  if (page === "favorites") renderFavorites();

  if (page === "profile") {
    updateProfile();
    syncTelegramProfile();
  }
}

document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => {
    showPage(btn.dataset.page);
  });
});

// OPEN TOOLS

document.querySelectorAll("[data-tool]").forEach(btn => {
  btn.addEventListener("click", () => {
    openGenerator(btn.dataset.tool);
  });
});

document.getElementById("back-home")?.addEventListener("click", () => {
  showPage(previousPage);
});

// GENERATOR

function openGenerator(type) {
  const current = document.querySelector(".page.active");

  previousPage = current?.id === "tools"
    ? "tools"
    : "home";

  showPage("generator");

  const content = document.getElementById("generator-content");

  const configs = {
    username: {
      title: "Username Generator ୨୧",
      description: "Find your perfect digital identity.",
      placeholder: "Enter your name or keyword...",
      button: "Generate username"
    },
    bio: {
      title: "Bio Maker ♡",
      description: "Create your own aesthetic bio.",
      placeholder: "Enter your name...",
      button: "Generate bio"
    },
    nickname: {
      title: "Nickname Maker 🎀",
      description: "Find a cute nickname.",
      placeholder: "Enter your name...",
      button: "Generate nickname"
    },
    font: {
      title: "Font Changer ✧",
      description: "Transform your text into different styles.",
      placeholder: "Type something...",
      button: "Change font"
    },
    symbol: {
      title: "Symbol Library ♡",
      description: "Tap a symbol to copy it.",
      button: "Show symbols"
    },
    kaomoji: {
      title: "Kaomoji Library ☁",
      description: "Choose your favorite expression.",
      button: "Show kaomoji"
    }
  };

  const config = configs[type];

  if (!config) return;

  content.innerHTML = `
    <h2>${config.title}</h2>
    <p>${config.description}</p>

    ${
      config.placeholder
        ? `<input class="generator-input"
            id="generator-input"
            placeholder="${config.placeholder}"
            maxlength="40">`
        : ""
    }

    <button class="primary-button" id="generate-btn">
      ${config.button}
    </button>

    <div class="result-list" id="results"></div>
  `;

  document.getElementById("generate-btn").onclick = () => {
    generateResults(type);
  };

  if (type === "symbol" || type === "kaomoji") {
    generateResults(type);
  }
}

// GENERATE RESULTS

function generateResults(type) {
  const input = document.getElementById("generator-input");
  const keyword = input?.value.trim() || "";

  if (
    input &&
    !keyword &&
    ["username", "bio", "nickname"].includes(type)
  ) {
    input.focus();
    input.placeholder = "Please enter a name first ♡";
    return;
  }

  let results = [];

  if (type === "username") {
    const base = keyword.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (!base) {
      alert("Please use letters or numbers.");
      return;
    }

    results = [
      base + "_",
      "its" + base,
      "luv" + base,
      base + "ie",
      base + ".jpg",
      "little" + base,
      base + "cloud",
      "hey" + base,
      base + "berry",
      "dear" + base
    ];
  }

  if (type === "nickname") {
    const first = keyword.charAt(0).toUpperCase();

    results = nicknameIdeas.map(name =>
      first + name.slice(1)
    );

    results = [
      first + "i",
      first + "u",
      first + "ie",
      ...results.slice(0, 7)
    ];
  }

  if (type === "bio") {
    results = bioIdeas.map(bio =>
      bio.replace("dreamer", keyword)
    );

    results = [
      ...results,
      `♡ ${keyword}'s little world`,
      `୨୧ made with love by ${keyword}`
    ];
  }

  if (type === "font") {
    results = makeFonts(keyword);
  }

  if (type === "symbol") {
    results = symbols;
  }

  if (type === "kaomoji") {
    results = kaomojis;
  }

  renderResults(results);
}

// FONT CHANGER

function makeFonts(text) {
  const styles = [
    0x1D5D4,
    0x1D608,
    0x1D63C,
    0x1D670
  ];

  const normal = "abcdefghijklmnopqrstuvwxyz";
  const output = [];

  styles.forEach(start => {
    let converted = "";

    for (const char of text.toLowerCase()) {
      const position = normal.indexOf(char);

      if (position === -1) {
        converted += char;
        continue;
      }

      converted += String.fromCodePoint(start + position);
    }

    output.push(converted);
  });

  return output;
}

// DISPLAY RESULTS

function renderResults(results) {
  const container = document.getElementById("results");

  if (!container) return;

  container.innerHTML = "";

  if (!results.length) {
    container.innerHTML =
      '<div class="empty-state">No results found ♡</div>';
    return;
  }

  results.forEach(value => {
    const card = document.createElement("div");
    card.className = "result-card";

    const text = document.createElement("span");
    text.textContent = value;

    const actions = document.createElement("div");
    actions.className = "result-actions";

    const copy = document.createElement("button");
    copy.textContent = "Copy";
    copy.onclick = () => copyText(value);

    const save = document.createElement("button");
    save.textContent = "♡";
    save.onclick = () => saveFavorite(value);

    actions.append(copy, save);
    card.append(text, actions);

    container.appendChild(card);
  });
}

// COPY

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    alert("Copied successfully! ♡");
  } catch {
    alert("Copy unavailable. Please try again.");
  }
}

// FAVORITES

function saveFavorite(value) {
  if (favorites.includes(value)) {
    alert("Already saved! ♡");
    return;
  }

  favorites.push(value);

  localStorage.setItem(
    "identityFavorites",
    JSON.stringify(favorites)
  );

  updateProfile();
  alert("Added to favorites! 🎀");
}

function renderFavorites() {
  const list = document.getElementById("favorite-list");

  if (!list) return;

  list.innerHTML = "";

  if (!favorites.length) {
    list.innerHTML =
      '<div class="empty-state">No favorites yet. Start creating! ♡</div>';
    return;
  }

  favorites.forEach((value, index) => {
    const card = document.createElement("div");
    card.className = "result-card";

    const text = document.createElement("span");
    text.textContent = value;

    const actions = document.createElement("div");
    actions.className = "result-actions";

    const copy = document.createElement("button");
    copy.textContent = "Copy";
    copy.onclick = () => copyText(value);

    const remove = document.createElement("button");
    remove.textContent = "✕";

    remove.onclick = () => {
      favorites.splice(index, 1);

      localStorage.setItem(
        "identityFavorites",
        JSON.stringify(favorites)
      );

      renderFavorites();
      updateProfile();
    };

    actions.append(copy, remove);
    card.append(text, actions);

    list.appendChild(card);
  });
}

// PROFILE

function updateProfile() {
  setText("favorite-count", favorites.length);
}

// SEARCH

const searchInput = document.getElementById("search");

searchInput?.addEventListener("input", event => {
  const query = event.target.value.toLowerCase();

  document.querySelectorAll("#home .tool-card").forEach(card => {
    const text = card.innerText.toLowerCase();

    card.style.display = text.includes(query) ? "flex" : "none";
  });
});

// INITIALIZE

updateProfile();
syncTelegramProfile();
    
