document.addEventListener("DOMContentLoaded", function () {
  // ============================================
  // 1. ИНИЦИАЛИЗАЦИЯ СЛАЙДЕРА
  // ============================================
  const swiper = new Swiper(".slider-wrapper", {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    speed: 300,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: false,
    },
    autoHeight: false,
    autoplay: true,
    effect: "slide",
    grabCursor: true,
    a11y: {
      prevSlideMessage: "Предыдущий слайд",
      nextSlideMessage: "Следующий слайд",
      firstSlideMessage: "Первый слайд",
      lastSlideMessage: "Последний слайд",
    },
  });

  // ============================================
  // 2. РАБОТА С ВАЛЮТАМИ
  // ============================================
  const currencies = document.querySelectorAll(".pay-form__input-currency");
  const amountInput = document.querySelector("#amount");
  const paymentButton = document.querySelector("#payment");

  const currencyMap = {
    "--dollar": "$",
    "--tenge": "₸",
    "--ruble": "₽",
  };

  function getCurrentSymbol() {
    const active = document.querySelector(".pay-form__input-currency.--active");
    if (!active) return "$";

    for (const [className, symbol] of Object.entries(currencyMap)) {
      if (active.classList.contains(className)) {
        return symbol;
      }
    }
    return "$";
  }

  function getCleanValue() {
    let value = amountInput.value;
    Object.values(currencyMap).forEach((symbol) => {
      value = value.replace(symbol, "");
    });
    return value.trim();
  }

  function getFormattedAmount() {
    const cleanValue = getCleanValue();
    const symbol = getCurrentSymbol();
    return cleanValue ? `${cleanValue}${symbol}` : `0${symbol}`;
  }

  function updateInputWithCurrency() {
    const cleanValue = getCleanValue();
    const symbol = getCurrentSymbol();

    if (cleanValue) {
      amountInput.value = `${cleanValue}${symbol}`;
    } else {
      amountInput.placeholder = `500${symbol}`;
    }

    updatePaymentButton();
  }

  function updatePaymentButton() {
    const formattedAmount = getFormattedAmount();
    const cleanValue = getCleanValue();

    if (cleanValue && parseFloat(cleanValue) > 0) {
      paymentButton.textContent = `Оплатить ${formattedAmount}`;
    } else {
      const symbol = getCurrentSymbol();
      paymentButton.textContent = `Оплатить 500${symbol}`;
    }
  }

  currencies.forEach((currency) => {
    currency.addEventListener("click", function () {
      currencies.forEach((c) => c.classList.remove("--active"));
      this.classList.add("--active");
      updateInputWithCurrency();
    });
  });

  amountInput.addEventListener("input", function () {
    let value = this.value;
    const symbol = getCurrentSymbol();

    Object.values(currencyMap).forEach((s) => {
      value = value.replace(s, "");
    });

    value = value.replace(/[^\d.]/g, "");

    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    if (value) {
      this.value = `${value}${symbol}`;
    } else {
      this.value = "";
    }

    updatePaymentButton();
  });

  amountInput.addEventListener("blur", function () {
    if (this.value) {
      const cleanValue = getCleanValue();
      if (cleanValue) {
        updateInputWithCurrency();
      }
    } else {
      updateInputWithCurrency();
    }
  });

  amountInput.addEventListener("focus", function () {
    const cleanValue = getCleanValue();
    if (cleanValue) {
      this.value = cleanValue;
    }
  });

  updateInputWithCurrency();

  // ============================================
  // 3. МЕГА-МЕНЮ
  // ============================================
  const catalogButton = document.querySelector(".header-nav__button");
  const megamenu = document.getElementById("megamenu");
  const overlay = document.getElementById("megamenuOverlay");
  const body = document.body;

  let isOpen = false;

  function openMegamenu() {
    isOpen = true;
    megamenu.classList.add("active");
    overlay.classList.add("active");
    body.classList.add("megamenu-open");
    body.style.overflow = "hidden";
    catalogButton.classList.add("active");
  }

  function closeMegamenu() {
    isOpen = false;
    megamenu.classList.remove("active");
    overlay.classList.remove("active");
    body.classList.remove("megamenu-open");
    body.style.overflow = "";
    catalogButton.classList.remove("active");
  }

  catalogButton.addEventListener("click", function (e) {
    e.stopPropagation();
    if (isOpen) {
      closeMegamenu();
    } else {
      openMegamenu();
    }
  });

  overlay.addEventListener("click", closeMegamenu);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) {
      closeMegamenu();
    }
  });

  const menuLinks = megamenu.querySelectorAll("a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", closeMegamenu);
  });

  const promoButton = megamenu.querySelector(".megamenu-promo__button");
  if (promoButton) {
    promoButton.addEventListener("click", closeMegamenu);
  }

  // ============================================
  // 4. ПЕРЕКЛЮЧЕНИЕ КАТЕГОРИЙ В МЕГА-МЕНЮ
  // ============================================
  document.querySelectorAll(".megamenu-categories__item").forEach((item) => {
    item.addEventListener("mouseenter", function () {
      document.querySelectorAll(".megamenu-categories__item").forEach((c) => {
        c.classList.remove("active");
      });
      this.classList.add("active");

      const category = this.dataset.category;

      document.querySelectorAll(".megamenu-subcategory").forEach((sub) => {
        if (sub.dataset.category === category) {
          sub.style.display = "block";
        } else {
          sub.style.display = "none";
        }
      });
    });
  });
});
