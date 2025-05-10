function useSmartTheme() {
  const isUserSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  const htmlTag = document.querySelector("html")
  htmlTag.setAttribute("data-theme", isUserSystemDark ? "dracula" : "cupcake")
}

export { useSmartTheme }
