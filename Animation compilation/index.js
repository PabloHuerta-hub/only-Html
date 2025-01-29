document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".card").forEach((expandedCard) => {
        expandedCard.classList.add("cancelPointerEvents");
      });

      const cardClone = card.cloneNode(true);
      cardClone.classList.add("modal", "cardExpanded");

      const cardCloneCloseBtn = cardClone.querySelector(".closeBtn");
      cardCloneCloseBtn.classList.remove("visibleWhenOpen");
      cardCloneCloseBtn.classList.add("modalCloseBtn");

      cardClone.classList.remove("cancelPointerEvents");
      document.body.appendChild(cardClone);

      const cardContentClone = cardClone.querySelector(
        ".cardAnimationContainer"
      );

      const newButton = document.createElement("button");
      newButton.textContent = "Copy CSS";
      newButton.classList.add("buttonCopyCss");
      cardContentClone.appendChild(newButton);

      const newButtonHtml = document.createElement("button");
      newButtonHtml.textContent = "Copy HTML";
      newButtonHtml.classList.add("buttonCopyHtml");
      cardContentClone.appendChild(newButtonHtml);

      card.classList.add("cancelPointerEvents");

      cardCloneCloseBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        cardClone.remove();
        document.querySelectorAll(".card").forEach((expandedCard) => {
          expandedCard.classList.remove("cancelPointerEvents");
        });
      });

      cardClone.addEventListener("click", (event) => {
        if (event.target === cardClone) {
          cardClone.remove();
          document.querySelectorAll(".card").forEach((expandedCard) => {
            expandedCard.classList.remove("cancelPointerEvents");
          });
        }
      });

      newButton.addEventListener("click", function () {
        const cardContent = cardContentClone.cloneNode(true);

        const buttons = cardContent.querySelectorAll("button");
        buttons.forEach((btn) => btn.remove());

        let cssText = "";
        const elementsToCopy = cardContent.querySelectorAll(
          ".cardAnimationContainer *"
        );

        const copiedKeyframes = new Set();
        const copiedRules = new Set();

        Array.from(document.styleSheets).forEach((sheet) => {
          try {
            const rules = sheet.cssRules || sheet.rules;
            if (rules) {
              Array.from(rules).forEach((rule) => {
             if (rule instanceof CSSStyleRule) {
                  elementsToCopy.forEach((element) => {
                    if (element.matches(rule.selectorText)) {
                      console.log(rule.style.animationName);

                      if (
                        rule.style.animationName &&
                        rule.style.animationName !== ""
                      ) {
                        console.log(
                          `AnimationName encontrado: ${rule.style.animationName}`
                        );

                        Array.from(sheet.cssRules || sheet.rules).forEach(
                          (keyframeRule) => {
                            if (
                              keyframeRule instanceof CSSKeyframesRule &&
                              keyframeRule.name === rule.style.animationName
                            ) {
                              if (!copiedKeyframes.has(keyframeRule.name)) {
                                console.log(
                                  `@keyframes encontrado para ${rule.style.animationName}`
                                );
                                cssText += keyframeRule.cssText + "\n\n";
                                copiedKeyframes.add(keyframeRule.name);
                              }
                            }
                          }
                        );
                      }

                      const ruleCssText = rule.cssText.trim();
                      if (!copiedRules.has(ruleCssText)) {
                        console.log(`Regla CSS encontrada: ${ruleCssText}`);
                        cssText += ruleCssText + "\n\n";
                        copiedRules.add(ruleCssText);
                      }
                    }
                  });
                }
              });
            }
          } catch (error) {
            console.error("Error al acceder a las reglas CSS:", error);
          }
        });

        navigator.clipboard
          .writeText(cssText)
          .then(() => {
            console.log("CSS copiado al portapapeles!");
          })
          .catch((err) => {
            console.error("Error al copiar CSS: ", err);
          });
      });

      newButtonHtml.addEventListener("click", function () {
        const cardContent = cardContentClone.cloneNode(true);

        const buttons = cardContent.querySelectorAll("button");
        buttons.forEach((btn) => btn.remove());

        const contentHTML = cardContent.innerHTML;

        navigator.clipboard
          .writeText(contentHTML)
          .then(() => {
            console.log("Contenido copiado al portapapeles!");
          })
          .catch((err) => {
            console.error("Error al copiar contenido: ", err);
          });
      });
    });
  });
});
