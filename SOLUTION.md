Approach and Trade-offs

Background

First off, I'm a Fullstack developer, but my backend stack is mainly Ruby on Rails with a Postgres database. That said, I’ve dabbled a bit in Next.js—haven’t worked extensively with it yet, but I’m eager to dive deeper and, in no time, get really good at it.

I lean more toward the frontend side of things and have solid experience in accessibility and UX, thanks to my involvement in design reviews over the years in my current frontend role. That said, I’m excited about working with the backend again. I genuinely enjoy being part of the process of planning how data is structured and figuring out how to handle performance challenges.

For this challenge, I used AI to help me tackle some backend changes and polish a few frontend details, mainly because of the limited time I had. I’m a proud new dad to a baby girl, so my time is a bit stretched these days. Still, I spent about 2.5 hours on this because I really enjoyed it!

Frontend

1. Memory Leak Fix
   Problem: The Items.js component was leaking memory because the fetchItems call could still resolve after the component unmounted.
   Solution: I used the AbortController to cancel the fetch request when the component unmounts. This ensures that no state updates occur after the component is unmounted.
   Trade-off: While this approach works well for fetch requests, it requires careful handling of the AbortController in other parts of the codebase if reused.
2. Pagination and Search
   Problem: The list needed server-side pagination and search functionality.
   Solution: I implemented server-side pagination and search by passing the page, limit, and q parameters to the backend API. The frontend updates the query parameters dynamically based on user input.
   Trade-off: This approach relies on the backend to handle filtering and pagination efficiently. If the backend is slow, the user experience may degrade.
3. Performance Optimization with Virtualization
   Problem: Rendering a large list of items could degrade performance.
   Solution: I integrated react-window to virtualize the list. This ensures that only the visible portion of the list is rendered, significantly improving performance for large datasets.
   Trade-off: Virtualization adds complexity to the code and requires careful handling of layout and styling to ensure a seamless user experience.
4. UI/UX Enhancements
   Problem: The UI needed better loading states and accessibility improvements.
   Solution:
   Added skeleton loaders for the loading state.
   Improved accessibility by adding ARIA labels and ensuring keyboard navigation works seamlessly.
   Enhanced styling for hover and focus states to improve the overall user experience.
   Trade-off: These enhancements slightly increased the codebase size but improved the user experience significantly.
   Backend
5. Refactor Blocking I/O
   Problem: The backend was using fs.readFileSync, which blocks the event loop.
   Solution: Replaced fs.readFileSync with fs.promises.readFile to make the file reading operation non-blocking.
   Trade-off: This change requires handling promises with async/await, which slightly increases code complexity but improves performance.
6. Performance Optimization for /api/stats
   Problem: The /api/stats endpoint recalculated stats on every request, which was inefficient.
   Solution: Introduced a caching mechanism that recalculates stats only when the items.json file changes. Used fs.stat to monitor file modification times and invalidate the cache when necessary.
   Trade-off: This approach adds a small overhead for file monitoring but significantly reduces the computational load for repeated requests.
7. Testing
   Problem: The backend lacked unit tests for the items routes.
   Solution: Added Jest tests to cover both happy paths and error cases for the GET /api/items and GET /api/items/:id endpoints.
   Trade-off: Writing tests required additional time, but it ensures the reliability and maintainability of the codebase.
8. Enhanced Logger Middleware
   Problem: The logger middleware needed better debugging information.
   Solution: Enhanced the logger to include timestamps, HTTP methods, response status codes, and request durations.
   Trade-off: This slightly increases the verbosity of logs but provides more detailed insights for debugging.

Backend

1. Refactor Blocking I/O
   Problem: The backend was using fs.readFileSync, which blocks the event loop.
   Solution: Replaced fs.readFileSync with fs.promises.readFile to make the file reading operation non-blocking.
   Trade-off: This change requires handling promises with async/await, which slightly increases code complexity but improves performance.
2. Performance Optimization for /api/stats
   Problem: The /api/stats endpoint recalculated stats on every request, which was inefficient.
   Solution: Introduced a caching mechanism that recalculates stats only when the items.json file changes. Used fs.stat to monitor file modification times and invalidate the cache when necessary.
   Trade-off: This approach adds a small overhead for file monitoring but significantly reduces the computational load for repeated requests.
3. Testing
   Problem: The backend lacked unit tests for the items routes.
   Solution: Added Jest tests to cover both happy paths and error cases for the GET /api/items and GET /api/items/:id endpoints.
   Trade-off: Writing tests required additional time, but it ensures the reliability and maintainability of the codebase.
4. Enhanced Logger Middleware
   Problem: The logger middleware needed better debugging information.
   Solution: Enhanced the logger to include timestamps, HTTP methods, response status codes, and request durations.
   Trade-off: This slightly increases the verbosity of logs but provides more detailed insights for debugging.
