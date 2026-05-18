const generateContentMock = jest.fn();

class MockGenerativeModel {
  generateContent = generateContentMock;
}

class MockGoogleGenerativeAI {
  getGenerativeModel() {
    return new MockGenerativeModel();
  }
}

module.exports = {
  GoogleGenerativeAI: MockGoogleGenerativeAI,
  __mock: {
    generateContentMock,
  },
};