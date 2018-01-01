import { RocketPage } from './app.po';

describe('rocket App', function() {
  let page: RocketPage;

  beforeEach(() => {
    page = new RocketPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
