# 🏛️ Wiki Transfer Guide

This directory contains the documentation for the **Pi Forge Quantum Genesis** Wiki.

## 📤 How to Publish

To push this content to the official GitHub Wiki:

1.  **Enable Wiki:** Go to your GitHub repository settings and enable the Wiki feature.
2.  **Clone Wiki Repo:**
    ```bash
    # Replace with your actual repo URL, appending .wiki.git
    git clone https://github.com/onenoly1010/pi-forge-quantum-genesis.wiki.git
    cd pi-forge-quantum-genesis.wiki
    ```
3.  **Copy Content:**
    Copy all `.md` files from this directory (`wiki/`) to the cloned wiki repository.
    ```bash
    cp -r /path/to/local/wiki/* .
    ```
4.  **Push:**
    ```bash
    git add .
    git commit -m "Update wiki content"
    git push origin master
    ```

## 📝 Editing

*   Use standard Markdown.
*   Use `[[Page Name]]` syntax for internal links.
*   Update `_Sidebar.md` when adding new pages.
