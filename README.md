# Steam Game Page

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Contributions](https://img.shields.io/badge/contributions-welcome-brightgreen) <br>
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?&style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?&style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?&style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![EJS](https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=white)
![Axios](https://img.shields.io/badge/axios-%23202020.svg?style=for-the-badge&logo=axios&logoColor=white)
![Compression](https://img.shields.io/badge/compression-%23444.svg?style=for-the-badge)
![Steam API](https://img.shields.io/badge/steam_api-%23000000.svg?style=for-the-badge&logo=steam&logoColor=white)

---

## 📝 Description

Steam Game Page Generator is a Node.js application that creates dynamic game pages using data fetched from the Steam Public API. The website allows users to browse and explore detailed information about Steam games, such as game descriptions, images, and metadata, in a clean and visually appealing layout.

This project is built with HTML5, CSS3, and Bootstrap for the front end, while EJS templates and Express.js handle server-side rendering for smooth performance. Axios is used to fetch data from the API, and Compression helps optimize server response times. 

The primary goal of this project is to provide a functional and responsive interface for exploring game data while keeping the implementation simple and beginner-friendly.

---

## ⚠️ Warning

This website **does not filter or censor NSFW (Not Safe For Work) content** fetched from the Steam Public API. Games and content displayed on the website are sourced directly from the Steam database and may include mature or inappropriate material. Users should exercise caution while browsing, especially in public or shared environments. Viewer discretion is advised.

---

## 💻 Compatibility

Currently, this project is optimized for **1920x1080 screen resolution**. While it is functional at other resolutions, users may experience misalignment, overlapping elements, or other layout issues. Future updates may include improvements for better responsiveness across multiple devices and screen sizes.

---

## 🚧 Known Bug

**External CSS Issue**: When the server is first started, the external CSS may not load properly. This results in unstyled pages when the website is initially accessed.

**Temporary Solution**:  
1. Navigate to any game page by clicking on a game link.  
2. Reload the page.  
3. Return to the homepage. The CSS will be correctly applied.

This issue occurs due to an asynchronous loading conflict between the server and static files. A long-term fix is planned for future updates.

---

## 🚀 Setup

1. Clone the repository:  
   ```
   git clone https://github.com/yatozuki/Steam-Game-Page.git
   ```

2. Navigate to the project directory:  
   ```
   cd Steam-Game-Page
   ```

3. Create a directory for data storage:  
   ```
   mkdir data
   ```

4. Install dependencies:  
   ```
   npm i
   ```

5. Start the server:  
   ```
   nodemon app.js
   ```

6. Open the website in your browser:  
   ```
   localhost:3000
   ```

**First-Time Setup Steps:**  
- On the first run, the application will create a `games.json` file in the `data` directory automatically.  
- If you see a connection error, reload the website to allow the `prices.json` file to generate.  
- Reload the page once more to fully load the game data and display the content.

**Navigate Directly to a Specific Page:**  
Append `?page=pagenumber` to the URL to skip to a specific page. For example:  
```
localhost:3000?page=2
```

---

## 🖼️ Screenshots

### Homepage 
<img src="https://i.ibb.co/X2VYx5h/image.png" width=50% alt="Homepage Screenshot" >

### Game Details Page  
<img src="https://i.ibb.co/yhdBSJc/image.png" width=50% alt="Detail Page Screenshot" >

---

## 🤝 Contributing
I welcome contributions from everyone! If you have ideas for improvements, new features, or spot any issues, feel free to open a pull request or raise an issue. Your suggestions and efforts to enhance the project are greatly appreciated!

---
## 🛡️ License
This project is licensed under the MIT License. This means you are free to:

- **Use**: You can use the project for personal or commercial purposes.
- **Modify**: You can make changes to the code as needed.
- **Distribute**: You can share the project, either in its original state or with modifications, with others.

However, all usage, modification, and distribution must include proper attribution to the original authors. For more details, see the [MIT License](https://opensource.org/licenses/MIT).