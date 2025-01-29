document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    card.addEventListener("click", () => openCardModal(card));
  });

  function openCardModal(card) {
    document
      .querySelectorAll(".card")
      .forEach((c) => c.classList.add("cancelPointerEvents"));

    const cardClone = card.cloneNode(true);
    cardClone.classList.add("modal", "cardExpanded");
    cardClone.classList.remove("cancelPointerEvents");

    const closeBtn = cardClone.querySelector(".closeBtn");
    closeBtn.classList.replace("visibleWhenOpen", "modalCloseBtn");

    const cardContentClone = cardClone.querySelector(".cardAnimationContainer");

    addCopyButton(
      cardClone.querySelector(".cardAnimationContainer"),
      "buttonCopyCss",
      () => copyCSS(cardContentClone),
      "Copy CSS"
    );
    addCopyButton(
      cardClone.querySelector(".cardAnimationContainer"),
      "buttonCopyHtml",
      () => copyHTML(cardContentClone),
      "Copy HTML"
    );

    document.body.appendChild(cardClone);

    closeBtn.addEventListener("click", (event) => closeModal(event, cardClone));
    cardClone.addEventListener("click", (event) => {
      if (event.target === cardClone) closeModal(event, cardClone);
    });
  }

  function addCopyButton(container, text, action, content) {
    const button = document.createElement("button");
    button.textContent = content;
    button.classList.add(text);
    button.addEventListener("click", action);
    container.appendChild(button);
  }

  function closeModal(event, cardClone) {
    event.stopPropagation();
    cardClone.remove();
    document
      .querySelectorAll(".card")
      .forEach((c) => c.classList.remove("cancelPointerEvents"));
  }
  
  function copyCSS(container) {
 

    const elementsToCopy = container.querySelectorAll(".cardAnimationContainer >*:not(button)");

    const copiedKeyframes = new Set();
    const copiedRules = new Set();
    let cssText = "";

    Array.from(document.styleSheets).forEach((sheet) => {
      try {
        const rules = sheet.cssRules || [];
        Array.from(rules).forEach((rule) => {
          if (rule instanceof CSSStyleRule) {
       
            elementsToCopy.forEach((element) => {
              console.log("rule",rule.selectorText)
              console.log("elemento",element)
              if (element.matches(rule.selectorText)) {
         
                if (rule.style.animationName) {
    
                  Array.from(sheet.cssRules).forEach((keyframeRule) => {
                    if (
                      keyframeRule instanceof CSSKeyframesRule &&
                      keyframeRule.name === rule.style.animationName
                    ) {
                      if (!copiedKeyframes.has(keyframeRule.name)) {
                        cssText += keyframeRule.cssText + "\n\n";
                        copiedKeyframes.add(keyframeRule.name);
                      }
                    }
                  });
                }
                const ruleCssText = rule.cssText.trim();
                if (!copiedRules.has(ruleCssText)) {
                  cssText += ruleCssText + "\n\n";
                  copiedRules.add(ruleCssText);
                }
              }
            });
          }
        });
      } catch (error) {
        console.error("Error al acceder a las reglas CSS:", error);
      }
    });

    copyToClipboard(cssText, "CSS");
  }

  function copyHTML(container) {
    const clone = container.cloneNode(true);
 
    copyToClipboard(clone.innerHTML, "HTML");
  }

  function copyToClipboard(content, type) {
    navigator.clipboard
      .writeText(content)
      .then(() => console.log(`${type} copiado al portapapeles!`))
      .catch((err) => console.error(`Error al copiar ${type}: `, err));
  }
});
