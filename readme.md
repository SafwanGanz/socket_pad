
---

# SocketPad - Real-Time Collaborative Editor 🚀

SocketPad is a **real-time collaborative text editor** built with **Node.js**, **Express**, **Socket.IO**, and modern web technologies. It allows multiple users to collaborate on a single document simultaneously, with live updates, cursor tracking, and more. Perfect for team collaboration, brainstorming, or pair programming!

---

## 🌟 Features

- **Real-Time Collaboration**: Multiple users can edit the same document simultaneously.
- **Live Cursor Tracking**: See where other users are typing in real-time.
- **Dark/Light Mode**: Switch between themes for a comfortable editing experience.
- **Auto-Save Drafts**: Your work is automatically saved locally.
- **Connected Users List**: See who else is collaborating with you.
- **Document History**: Track changes with a built-in history slider.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.

---

## 🛠️ Technologies Used

- **Backend**: Node.js, Express, Socket.IO
- **Frontend**: HTML, CSS, JavaScript
- **Styling**: Modern CSS with Flexbox and Grid
- **Real-Time Updates**: Powered by Socket.IO
- **Local Storage**: Used for saving drafts and theme preferences

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/socketpad.git
   cd socketpad
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🖥️ Usage

1. **Open the Editor**: Navigate to the app in your browser.
2. **Start Typing**: Begin editing the document. Changes will appear in real-time for all connected users.
3. **Switch Themes**: Use the theme toggle button to switch between dark and light modes.
4. **View Connected Users**: Check the sidebar to see who else is collaborating.
5. **Track Changes**: Use the history slider to view past versions of the document.

---

## 📂 Project Structure

```
socketpad/
├── public/              # Static files (CSS, JS, HTML)
│   ├── css/
│   ├── js/
│   └── index.html
├── server.js            # Backend server and Socket.IO logic
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation
```

---

## 🛠️ Customization

- **Change Port**: Modify the `PORT` variable in `server.js` to run the app on a different port.
- **Add Features**: Extend the editor with features like rich text formatting, user authentication, or document sharing.
- **Styling**: Customize the CSS in `public/css/styles.css` to match your branding.

---

## 🤝 Contributing

Contributions are welcome! Here’s how you can help:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ using **Express** and **Socket.IO**.
- Inspired by collaborative tools like **Google Docs** and **Etherpad**.
- Thanks to the open-source community for amazing libraries and tools!

---

