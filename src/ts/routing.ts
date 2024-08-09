// const routes: { [key: string]: () => void } = {
//   '': () => showPage('easy'),
//   '/medium': () => showPage('medium'),
//   '/hard': () => showPage('hard'),
//   '/tutorial': () => showPage('tutorial'),
// };

// function showPage(pageName: string): void {
//   if (pageName === 'tutorial') {
//     // Load the tutorial.html file
//     fetch('tutorial.html')
//       .then(response => response.text())
//       .then(html => {
//         document.getElementById('content')!.innerHTML = html;
//       });
//   } else {
//     // Load the content for the easy, medium, or hard phases
//     // (based on the logic you already have)
//     loadGameContent(pageName);
//   }
// }

// // Handle URL changes
// window.addEventListener('hashchange', () => {
//   const path = window.location.hash.slice(1) || '/';
//   routes[path]();
// });

// // Initial load
// routes[window.location.hash.slice(1) || '']();