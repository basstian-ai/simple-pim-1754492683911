# 🌟 Vision: Recipe Finder

This project is a small, polished Recipe Finder web app built with Next.js and intended for deployment on Vercel.

## Core Idea

A minimal recipe app that:

- 🍳 Lets users **search for recipes** from a public API.
- 📖 Shows recipe details like ingredients, instructions, and images.
- ❤️ Allows users to **save favorites** in local storage.
- ⚡ Loads quickly and works well on mobile and desktop.

## MVP (v1.0)

The first release focuses on a tight, useful feature set:

- Homepage with a search input and a list of trending/popular recipes.
- Recipe detail page showing ingredients, steps, and media (images/videos).
- Favorites page that persists saved recipes in localStorage.
- About page describing the project and data source.

## Future Ideas

Potential improvements after MVP:

- Search filtering (by category, cuisine, diet type).
- Shareable recipe links.
- Dark mode toggle.
- Offline access to saved recipes.

## Why This Matters

Cooking is universal — everyone relates to recipes. This app should be:

- 🧑‍🍳 Useful: quick inspiration for meals, accessible anywhere.
- 💻 Educational: demonstrates fetching data from an API, dynamic routes, client-side state, and deployment on Vercel.
- 🎨 Delightful: a clean, simple UI that feels like a real product.

## Data Source

We will use TheMealDB: https://www.themealdb.com

TheMealDB supports searches by name, ingredient, or category and returns full meal details (ingredients, instructions, images, and YouTube videos). No authentication is required for the free tier.

Example request:

```
https://www.themealdb.com/api/json/v1/1/search.php?s=chicken
```

## Goals for the repository

- Keep the app small and focused so it can be built and iterated quickly.
- Provide clear documentation and examples so contributors can get started fast.
- Prioritize performance and accessibility for a good user experience on mobile and desktop.

---

This document is the source of truth for the project's direction. Keep it updated as features and priorities change.