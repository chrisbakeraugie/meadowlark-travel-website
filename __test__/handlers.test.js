// How this test is written

// First, import the code we're trying to test (in this case, the route handlers).
const handlers = require('../lib/handlers');

/*
This first test has a description, 'home page renders'
Then, *this* test is checking to see that the home page renders.
The req(uest) and res(ponse) parts are to see that we are getting the correct responses
We need nothing from the req object (hence empty object)
We need a render method from the res object

jest.fn() "creates a generic mock function that keeps track of how it's called"

Finally,
*/
test('home page renders', () => {
  const req = {}
  const res = { render: jest.fn() }
  handlers.home(req, res);
  expect(res.render.mock.calls[0][0]).toBe('home');
});

test('about page renders', () => {
  const req = {}
  const res = { render: jest.fn() }
  handlers.about(req, res);
  expect(res.render.mock.calls.length).toBe(1);
  expect(res.render.mock.calls[0][0]).toBe('about');
  expect(res.render.mock.calls[0][1]).toEqual(expect.objectContaining({
    fortune: expect.stringMatching(/\W/)
    // basicallly just making sure it has at least one character in the fortune section
  }));
});

test('404 handler renders', () => {
  const req = {};
  const res = { render: jest.fn() }
  handlers.notFound(req, res);
  expect(res.render.mock.calls.length).toBe(1);
  expect(res.render.mock.calls[0][0]).toBe('404');
});

test('500 handler renders', () => {
  const err = new Error('some error');
  const req = {};
  const res = { render: jest.fn() };
  const next = jest.fn();
  handlers.serverError(err, req, res, next);
  expect(res.render.mock.calls.length).toBe(1);
  expect(res.render.mock.calls[0][0]).toBe('500');
});
