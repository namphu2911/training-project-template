import ready from '../utilities/_helper';
import renderGrid from '../components/_grid';
import renderHome from '../components/_home';

ready(() => {
  renderGrid();

  // Render home page content
  renderHome();
});
