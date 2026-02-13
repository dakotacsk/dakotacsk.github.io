/*  Blog Engine
 *  ───────────
 *  Reads blogs/posts.json and renders posts on blog.html,
 *  or loads a single post on blog-post.html.
 *
 *  To add a new post:
 *    1. Write a .md file in the blogs/ folder
 *    2. Add an entry to blogs/posts.json with id, title, date, tags, excerpt, file
 *    3. Done — it shows up automatically
 */

(function () {
  "use strict";

  const POSTS_PATH = "./blogs/posts.json";
  const BLOGS_DIR = "./blogs/";

  /* ── Tiny Markdown → HTML converter (no dependencies) ──────────── */
  function md(text) {
    let html = text
      // code blocks (``` ... ```)
      .replace(/```(\w*)\n([\s\S]*?)```/g, function (_, lang, code) {
        return (
          '<pre class="blog-code"><code>' +
          code.replace(/</g, "&lt;").replace(/>/g, "&gt;") +
          "</code></pre>"
        );
      })
      // inline code
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      // headings
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      // bold & italic
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      // horizontal rules
      .replace(/^---$/gm, "<hr>")
      // unordered lists
      .replace(/^- (.+)$/gm, "<li>$1</li>");

    // Wrap consecutive <li> into <ul>
    html = html.replace(/((?:<li>.*<\/li>\s*)+)/g, "<ul>$1</ul>");

    // Paragraphs: wrap remaining bare lines
    html = html
      .split("\n\n")
      .map(function (block) {
        block = block.trim();
        if (!block) return "";
        if (/^<[hupol]|^<hr|^<pre/.test(block)) return block;
        return "<p>" + block.replace(/\n/g, "<br>") + "</p>";
      })
      .join("\n");

    return html;
  }

  /* ── Date formatting ───────────────────────────────────────────── */
  function fmtDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  /* ── Tag color helper ──────────────────────────────────────────── */
  function tagClass(tag) {
    return "blog-tag blog-tag--" + tag.toLowerCase();
  }

  /* ── Fetch helper ──────────────────────────────────────────────── */
  async function fetchJSON(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error("Failed to fetch " + url);
    return r.json();
  }

  async function fetchText(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error("Failed to fetch " + url);
    return r.text();
  }

  /* ══════════════════════════════════════════════════════════════════
   *  BLOG LIST PAGE  (blog.html)
   * ══════════════════════════════════════════════════════════════════ */
  const blogList = document.getElementById("blog-list");
  const blogEmpty = document.getElementById("blog-empty");
  const searchInput = document.getElementById("blog-search");
  const tagBtns = document.querySelectorAll(".blog-tag-btn");

  if (blogList) {
    let allPosts = [];
    let activeTag = "all";
    let searchQuery = "";

    /* Render the visible post list */
    function render() {
      const filtered = allPosts.filter(function (p) {
        const matchTag =
          activeTag === "all" ||
          p.tags.map((t) => t.toLowerCase()).includes(activeTag.toLowerCase());
        const q = searchQuery.toLowerCase();
        const matchSearch =
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q));
        return matchTag && matchSearch;
      });

      if (filtered.length === 0) {
        blogList.innerHTML = "";
        blogEmpty.style.display = "block";
        return;
      }

      blogEmpty.style.display = "none";
      blogList.innerHTML = filtered
        .map(function (p) {
          const tagsHtml = p.tags
            .map(function (t) {
              return '<span class="' + tagClass(t) + '">' + t + "</span>";
            })
            .join("");

          return (
            '<a href="blog-post.html?id=' +
            encodeURIComponent(p.id) +
            '" class="blog-post-link">' +
            '<article class="glass-card blog-post-card">' +
            '<div class="blog-post-card-header">' +
            '<div class="blog-post-tags">' +
            tagsHtml +
            "</div>" +
            '<p class="blog-post-meta">' +
            fmtDate(p.date) +
            "</p>" +
            "</div>" +
            "<h2>" +
            p.title +
            "</h2>" +
            '<p class="blog-post-excerpt">' +
            p.excerpt +
            "</p>" +
            '<span class="blog-read-more">Read more <i class="fas fa-arrow-right"></i></span>' +
            "</article></a>"
          );
        })
        .join("");
    }

    /* Tag filter buttons */
    tagBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        tagBtns.forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        activeTag = btn.getAttribute("data-tag");
        render();
      });
    });

    /* Search input */
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        searchQuery = searchInput.value;
        render();
      });
    }

    /* Load posts */
    fetchJSON(POSTS_PATH)
      .then(function (posts) {
        // sort newest first
        allPosts = posts.sort(function (a, b) {
          return new Date(b.date) - new Date(a.date);
        });
        render();
      })
      .catch(function () {
        blogList.innerHTML =
          '<p class="blog-loading">Could not load posts. Make sure you\'re running a local server.</p>';
      });
  }

  /* ══════════════════════════════════════════════════════════════════
   *  SINGLE POST PAGE  (blog-post.html)
   * ══════════════════════════════════════════════════════════════════ */
  const articleTitle = document.getElementById("blog-article-title");
  const articleDate = document.getElementById("blog-article-date");
  const articleTags = document.getElementById("blog-article-tags");
  const articleBody = document.getElementById("blog-article-body");

  if (articleTitle && articleBody) {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("id");

    if (!postId) {
      articleTitle.textContent = "Post not found";
      articleBody.innerHTML = '<p>No post ID specified. <a href="blog.html">Go back</a>.</p>';
    } else {
      fetchJSON(POSTS_PATH)
        .then(function (posts) {
          const post = posts.find(function (p) {
            return p.id === postId;
          });
          if (!post) {
            articleTitle.textContent = "Post not found";
            articleBody.innerHTML =
              '<p>Could not find this post. <a href="blog.html">Go back</a>.</p>';
            return;
          }

          document.title = post.title + " | Dakota Chang";
          articleTitle.textContent = post.title;
          articleDate.textContent = fmtDate(post.date);
          articleTags.innerHTML = post.tags
            .map(function (t) {
              return '<span class="' + tagClass(t) + '">' + t + "</span>";
            })
            .join("");

          return fetchText(BLOGS_DIR + post.file).then(function (content) {
            // Remove the first # heading (already shown as title)
            const body = content.replace(/^# .+\n*/m, "");
            articleBody.innerHTML = md(body);
          });
        })
        .catch(function () {
          articleBody.innerHTML =
            '<p>Could not load post. Make sure you\'re running a local server.</p>';
        });
    }
  }
})();
