(() => {
  "use strict";

  async function loadSiteHeader() {
    const container = document.getElementById("header-container");
    if (!container) return;

    // Shadow DOMでCSSを分離
    const shadowRoot = container.shadowRoot ||
      container.attachShadow({ mode: "open" });

    try {
      const response = await fetch("/header/index.html", {
        cache: "no-cache"
      });

      if (!response.ok) {
        throw new Error(`ヘッダーの読み込みに失敗しました: ${response.status}`);
      }

      const html = await response.text();
      const template = document.createElement("template");
      template.innerHTML = html;

      // CSSをShadow DOM内に読み込む
      const globalStyle = document.createElement("link");
      globalStyle.rel = "stylesheet";
      globalStyle.href = "/header/global.css";

      const headerStyle = document.createElement("link");
      headerStyle.rel = "stylesheet";
      headerStyle.href = "/header/style.css";

      shadowRoot.replaceChildren(
        globalStyle,
        headerStyle,
        template.content.cloneNode(true)
      );

    } catch (error) {
      console.error("サイトヘッダー:", error);
      container.textContent = "ヘッダーを読み込めませんでした。";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadSiteHeader, {
      once: true
    });
  } else {
    loadSiteHeader();
  }
})();