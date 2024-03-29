module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'lg': {'max': '1100px'},
      'md': {'max': '800px'},
      'sm': {'max': '500px'},
    },
    extend: {
      colors: {
        "gray-navbar": "#202225",
        "gray-sidebar": "#2F3136",
        "gray-message": "#40444B",
        "gray-user": "#292B2F",
        "gray-chat": "#36393F",
        "gray-sidetext": "#96989D",
        "gray-icons": "#B9BBBE",
        "gray-chat-text": "#A3A6AA",
        "gray-channel": "#4F545C99",
        "gray-text": "rgb(220, 221, 222)",
        "gray-modalbg": "rgb(54, 57, 63)",
        "modal-input-bg": "rgb(32,34,37)",
        "modal-bg-buttons": "rgb(47, 49, 54)",
        "blue-button": "rgb(88, 101, 242)",
        "blue-button-hover": "rgb(71, 82, 196)",
        "bg-user-icons": "rgba(79, 84, 92, 0.6)",
        "green-icons": "#3BA55D",
      },
    },
  },
  plugins: [],
};
