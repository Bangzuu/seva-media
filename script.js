const accordionItems = [...document.querySelectorAll(".info-column")];
const mobileQuery = window.matchMedia("(max-width: 600px)");

function setMobileAccordionState() {
  if (!mobileQuery.matches) {
    accordionItems.forEach((item) => {
      item.open = true;
    });
    return;
  }

  const openItems = accordionItems.filter((item) => item.open);
  if (openItems.length === 0) accordionItems[0].open = true;

  openItems.slice(1).forEach((item) => {
    item.open = false;
  });
}

accordionItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!mobileQuery.matches || !item.open) return;

    accordionItems.forEach((otherItem) => {
      if (otherItem !== item) otherItem.open = false;
    });
  });
});

mobileQuery.addEventListener("change", setMobileAccordionState);
setMobileAccordionState();
