# Portfolio_Test

A portfolio website with dynamic document listing from the docs folder.

## Features

- Responsive portfolio design
- GitHub repository links
- **Dynamic document listing** - Files in the `docs/` folder automatically appear on the homepage

## Setup & Running

### Prerequisites
- Node.js installed on your system

### Installation

1. Navigate to the project directory:
```bash
cd Portfolio_Test
```

2. Install dependencies:
```bash
npm install
```

### Running the Server

Start the server with:
```bash
npm start
```

The server will run on `http://localhost:3000`

### Adding Documents

Simply add files to the `docs/` folder. They will automatically appear on the homepage with:
- File name
- File size
- Last modified date
- Download link

The list updates dynamically without needing to restart the server.

## File Structure

```
Portfolio_Test/
├── index.html          # Main portfolio page
├── styles.css          # Styling
├── script.js           # Client-side JavaScript
├── server.js           # Node.js Express server
├── package.json        # Dependencies
├── docs/               # Upload folder (files here appear on homepage)
│   └── upload.md       # Example document
└── README.md           # This file
```

## Technologies

- HTML5
- CSS3
- JavaScript (ES6+)
- Node.js / Express